import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import {
  LogEvent,
  LogFileMetadata,
  TransactionCandidate,
} from "./types";
import { parseLogFileContent } from "./parser";
import { correlateTransactionsByRrn } from "./correlation-engine";
import { detectTransactionAnomalies } from "./anomaly-detector";

interface IndexedFileRecord {
  metadata: LogFileMetadata;
  events: LogEvent[];
  rrnIndex: Map<string, string[]>;
  stanIndex: Map<string, string[]>;
}

interface StoreState {
  files: Map<string, IndexedFileRecord>;
  transactionsCache: Map<string, TransactionCandidate>;
}

// Dossier de persistance locale dans .data/log-analyzer/
const STORAGE_DIR = path.resolve(process.cwd(), ".data", "log-analyzer");

function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

// Singleton global sur globalThis pour garantir le partage entre toutes les routes API Next.js
const globalAny = globalThis as any;
if (!globalAny.__monetiqueLogStore) {
  globalAny.__monetiqueLogStore = {
    files: new Map<string, IndexedFileRecord>(),
    transactionsCache: new Map<string, TransactionCandidate>(),
    isInitialized: false,
  };
}

const globalStore: StoreState = globalAny.__monetiqueLogStore;

/**
 * Charge les métadonnées et fichiers persistés depuis le disque (.data/log-analyzer/).
 */
function loadPersistedFiles() {
  if (globalAny.__monetiqueLogStore.isInitialized) return;
  globalAny.__monetiqueLogStore.isInitialized = true;

  try {
    ensureStorageDir();
    const indexPath = path.join(STORAGE_DIR, "index.json");
    if (fs.existsSync(indexPath)) {
      const indexRaw = fs.readFileSync(indexPath, "utf8");
      const metadataList: LogFileMetadata[] = JSON.parse(indexRaw);

      for (const meta of metadataList) {
        const parsedPath = path.join(STORAGE_DIR, `${meta.id}_parsed.json`);
        if (fs.existsSync(parsedPath)) {
          const parsedData = JSON.parse(fs.readFileSync(parsedPath, "utf8"));
          const rrnIndex = new Map<string, string[]>(parsedData.rrnIndexEntries || []);
          const stanIndex = new Map<string, string[]>(parsedData.stanIndexEntries || []);

          globalStore.files.set(meta.id, {
            metadata: meta,
            events: parsedData.events || [],
            rrnIndex,
            stanIndex,
          });
        }
      }
    }
  } catch (err) {
    console.error("Erreur lors de la lecture du stockage persistant :", err);
  }
}

/**
 * Sauvegarde sur disque les métadonnées et événements d'un fichier indexé.
 */
function persistFileToDisk(record: IndexedFileRecord) {
  try {
    ensureStorageDir();
    const metaList = Array.from(globalStore.files.values()).map((r) => r.metadata);
    fs.writeFileSync(
      path.join(STORAGE_DIR, "index.json"),
      JSON.stringify(metaList, null, 2),
      "utf8"
    );

    const parsedPath = path.join(STORAGE_DIR, `${record.metadata.id}_parsed.json`);
    const payload = {
      events: record.events,
      rrnIndexEntries: Array.from(record.rrnIndex.entries()),
      stanIndexEntries: Array.from(record.stanIndex.entries()),
    };
    fs.writeFileSync(parsedPath, JSON.stringify(payload), "utf8");
  } catch (err) {
    console.error("Erreur lors de la persistance sur disque :", err);
  }
}

/**
 * Calcule l'empreinte SHA-256 d'un contenu.
 */
function computeHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Indexe un fichier de log monétique importé par l'utilisateur.
 */
export function indexLogFile(
  filename: string,
  content: string,
  importedBy: string = "Exploitant Monétique"
): LogFileMetadata {
  loadPersistedFiles();

  const fileHash = computeHash(content);

  // Vérifier si le fichier avec ce hash a déjà été indexé
  for (const record of globalStore.files.values()) {
    if (record.metadata.fileHash === fileHash) {
      return record.metadata;
    }
  }

  const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const { events, rrnIndex, stanIndex, parseErrors } = parseLogFileContent(
    content,
    fileId,
    50000
  );

  const discoveredRrns = Array.from(rrnIndex.keys()).slice(0, 50);

  const metadata: LogFileMetadata = {
    id: fileId,
    filename,
    fileHash,
    fileSizeBytes: Buffer.byteLength(content, "utf8"),
    importedAt: new Date().toISOString(),
    importedBy,
    status: "INDEXED",
    parsedEventCount: events.length,
    parseErrorCount: parseErrors,
    distinctRrnCount: rrnIndex.size,
    discoveredRrns,
  };

  const record: IndexedFileRecord = {
    metadata,
    events,
    rrnIndex,
    stanIndex,
  };

  globalStore.files.set(fileId, record);
  persistFileToDisk(record);

  return metadata;
}

/**
 * Liste les fichiers de logs indexés.
 */
export function listLogFiles(): LogFileMetadata[] {
  loadPersistedFiles();
  return Array.from(globalStore.files.values()).map((r) => r.metadata);
}

/**
 * Récupère les métadonnées d'un fichier indexé.
 */
export function getLogFile(fileId: string): LogFileMetadata | undefined {
  loadPersistedFiles();
  return globalStore.files.get(fileId)?.metadata;
}

/**
 * Recherche des transactions par RRN dans un fichier donné.
 */
export function searchTransactionsByRrn(
  fileId: string,
  rrn: string
): TransactionCandidate[] {
  loadPersistedFiles();
  const fileRecord = globalStore.files.get(fileId);
  if (!fileRecord) return [];

  const candidates = correlateTransactionsByRrn(
    rrn,
    fileRecord.events,
    fileId
  );

  for (const candidate of candidates) {
    candidate.anomalies = detectTransactionAnomalies(candidate);
    globalStore.transactionsCache.set(candidate.id, candidate);
  }

  return candidates;
}

/**
 * Récupère le détail d'une transaction par son ID.
 */
export function getTransactionCandidateById(
  transactionId: string
): TransactionCandidate | undefined {
  loadPersistedFiles();
  return globalStore.transactionsCache.get(transactionId);
}

/**
 * Récupère la liste résumée des premières transactions identifiées dans un fichier.
 */
export function getFileTransactionsSummary(
  fileId: string,
  limit: number = 30
): Array<{
  rrn: string;
  stan?: string;
  terminalId?: string;
  mti?: string;
  eventsCount: number;
  firstTimestamp?: string;
}> {
  loadPersistedFiles();
  const fileRecord = globalStore.files.get(fileId);
  if (!fileRecord) return [];

  const summaries: Array<{
    rrn: string;
    stan?: string;
    terminalId?: string;
    mti?: string;
    eventsCount: number;
    firstTimestamp?: string;
  }> = [];

  const rrns = Array.from(fileRecord.rrnIndex.keys()).slice(0, limit);
  for (const rrn of rrns) {
    const eventIds = fileRecord.rrnIndex.get(rrn) || [];
    const firstEvt = fileRecord.events.find((e) => e.eventId === eventIds[0]);
    summaries.push({
      rrn,
      stan: firstEvt?.isoFields["11"],
      terminalId: firstEvt?.isoFields["41"],
      mti: firstEvt?.mti,
      eventsCount: eventIds.length,
      firstTimestamp: firstEvt?.timestampRaw || firstEvt?.timestampIso,
    });
  }

  return summaries;
}

/**
 * Supprime un fichier de log indexé ainsi que ses données persistées sur disque.
 */
export function deleteLogFile(fileId: string): boolean {
  loadPersistedFiles();
  const existed = globalStore.files.delete(fileId);

  // Nettoyer le cache des transactions associées
  for (const [txId, tx] of globalStore.transactionsCache.entries()) {
    if (tx.fileId === fileId) {
      globalStore.transactionsCache.delete(txId);
    }
  }

  try {
    ensureStorageDir();
    // Mettre à jour index.json
    const metaList = Array.from(globalStore.files.values()).map((r) => r.metadata);
    fs.writeFileSync(
      path.join(STORAGE_DIR, "index.json"),
      JSON.stringify(metaList, null, 2),
      "utf8"
    );

    // Supprimer le fichier parsed correspondant
    const parsedPath = path.join(STORAGE_DIR, `${fileId}_parsed.json`);
    if (fs.existsSync(parsedPath)) {
      fs.unlinkSync(parsedPath);
    }
  } catch (err) {
    console.error(`Erreur lors de la suppression du fichier ${fileId} :`, err);
  }

  return existed;
}

/**
 * Supprime tous les fichiers de log indexés et réinitialise le stockage.
 */
export function clearAllLogFiles(): void {
  loadPersistedFiles();
  globalStore.files.clear();
  globalStore.transactionsCache.clear();

  try {
    ensureStorageDir();
    if (fs.existsSync(STORAGE_DIR)) {
      const items = fs.readdirSync(STORAGE_DIR);
      for (const item of items) {
        try {
          fs.unlinkSync(path.join(STORAGE_DIR, item));
        } catch (_) {}
      }
      fs.writeFileSync(
        path.join(STORAGE_DIR, "index.json"),
        JSON.stringify([], null, 2),
        "utf8"
      );
    }
  } catch (err) {
    console.error("Erreur lors de la réinitialisation complète des fichiers :", err);
  }
}


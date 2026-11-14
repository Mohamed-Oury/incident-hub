"use client";

import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { useSubsidiary } from "@/modules/layout/SubsidiaryContext";
import { ConfirmDeleteModal } from "@/modules/ui/ConfirmDeleteModal";
import {
  LogFileMetadata,
  TransactionCandidate,
  AiDiagnosticReport,
  LogEvent,
} from "@/modules/log-analyzer/types";

interface FileTransactionSummary {
  rrn: string;
  stan?: string;
  terminalId?: string;
  mti?: string;
  eventsCount: number;
  firstTimestamp?: string;
}

export default function LogAnalyzerPage() {
  const { subsidiary, isAFG } = useSubsidiary();

  const [files, setFiles] = useState<LogFileMetadata[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [rrnInput, setRrnInput] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileTransactions, setFileTransactions] = useState<FileTransactionSummary[]>([]);
  const [txFilter, setTxFilter] = useState<string>("");
  const [candidates, setCandidates] = useState<TransactionCandidate[]>([]);
  const [selectedTx, setSelectedTx] = useState<TransactionCandidate | null>(null);
  const [activeTab, setActiveTab] = useState<"timeline" | "iso-fields" | "comparison" | "diagnostic">("timeline");
  const [diagnostic, setDiagnostic] = useState<AiDiagnosticReport | null>(null);
  const [isLoadingDiag, setIsLoadingDiag] = useState(false);
  const [selectedEventRaw, setSelectedEventRaw] = useState<LogEvent | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isoCategoryFilter, setIsoCategoryFilter] = useState<string>("ALL");
  const [isoSearchTerm, setIsoSearchTerm] = useState<string>("");

  // Modale personnalisée de suppression
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    mode: "single" | "all";
    fileId?: string;
    filename?: string;
    eventCount?: number;
    rrnCount?: number;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Palette dynamique selon la filiale active
  const brandPrimary = isAFG ? "#00a800" : "#e60028";
  const brandHover = isAFG ? "#15803d" : "#99001b";
  const brandBgSubtle = isAFG ? "rgba(0, 168, 0, 0.1)" : "rgba(230, 0, 40, 0.1)";
  const brandBorderSubtle = isAFG ? "rgba(0, 168, 0, 0.25)" : "rgba(230, 0, 40, 0.25)";

  // Charger les transactions du fichier sélectionné
  const loadFileTransactions = async (targetFileId: string) => {
    if (!targetFileId) return;
    try {
      const res = await fetch(`/api/monetique/log-analyzer/transactions?fileId=${targetFileId}`);
      const data = await res.json();
      if (data.transactions) {
        setFileTransactions(data.transactions);
      }
    } catch (_) {}
  };

  // Chargement de la liste des fichiers
  const loadFiles = async (preferredFileId?: string) => {
    try {
      const res = await fetch("/api/monetique/log-analyzer/files");
      const data = await res.json();
      if (data.files && data.files.length > 0) {
        setFiles(data.files);
        const targetId = preferredFileId || selectedFileId || data.files[0].id;
        setSelectedFileId(targetId);
        await loadFileTransactions(targetId);
      }
    } catch (_) {}
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Détection du changement de fichier sélectionné
  const handleSelectFile = async (newFileId: string) => {
    setSelectedFileId(newFileId);
    setSelectedTx(null);
    setCandidates([]);
    setDiagnostic(null);
    await loadFileTransactions(newFileId);

    const f = files.find((item) => item.id === newFileId);
    if (f && f.discoveredRrns && f.discoveredRrns.length > 0) {
      setRrnInput(f.discoveredRrns[0]);
    }
  };

  // Exécution de la recherche RRN
  const executeSearch = async (targetFileId: string, targetRrn: string) => {
    if (!targetRrn.trim()) {
      setMessage({ text: "Veuillez saisir un RRN valide (ex: 630644782950).", type: "error" });
      return;
    }

    setIsSearching(true);
    setSelectedTx(null);
    setDiagnostic(null);

    try {
      const res = await fetch("/api/monetique/log-analyzer/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: targetFileId, rrn: targetRrn.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.switchedFile && data.file?.id) {
          setSelectedFileId(data.file.id);
          await loadFileTransactions(data.file.id);
        }

        setCandidates(data.candidates || []);

        if (data.candidates && data.candidates.length > 0) {
          setSelectedTx(data.candidates[0]);
          setMessage({
            text: `✓ ${data.candidates.length} transaction(s) candidate(s) identifiée(s) pour le RRN ${targetRrn} dans "${data.file?.filename || 'le fichier'}".`,
            type: "success",
          });
        } else {
          setMessage({
            text: `Aucune transaction trouvée pour le RRN ${targetRrn} dans le fichier sélectionné.`,
            type: "info",
          });
        }
      } else {
        setMessage({ text: data.error || "Erreur de recherche.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: `Erreur lors de la recherche : ${err.message}`, type: "error" });
    } finally {
      setIsSearching(false);
    }
  };

  // Upload d'un fichier réel (.log, .txt, .trc, .csv)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    setMessage({ text: `Téléversement et analyse en cours de "${file.name}" (${sizeMb} Mo)...`, type: "info" });

    try {
      const fileText = await file.text();

      const res = await fetch("/api/monetique/log-analyzer/upload", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "x-filename": encodeURIComponent(file.name),
        },
        body: fileText,
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.file) {
        setMessage({
          text: `Fichier "${data.file.filename}" indexé avec succès : ${data.file.parsedEventCount.toLocaleString()} événements extraits, ${data.file.distinctRrnCount.toLocaleString()} RRNs identifiés !`,
          type: "success",
        });

        // Mise à jour immédiate sur le nouveau fichier
        await loadFiles(data.file.id);
        setSelectedFileId(data.file.id);
        await loadFileTransactions(data.file.id);

        if (data.file.discoveredRrns && data.file.discoveredRrns.length > 0) {
          const firstRrn = data.file.discoveredRrns[0];
          setRrnInput(firstRrn);
          await executeSearch(data.file.id, firstRrn);
        }
      } else {
        const errorDetail = data?.detail ? ` (${data.detail})` : "";
        setMessage({
          text: (data?.error || "Erreur lors du traitement du fichier") + errorDetail,
          type: "error",
        });
      }
    } catch (err: any) {
      setMessage({ text: `Erreur client : ${err.message}`, type: "error" });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Demande de diagnostic IA
  const handleRequestDiagnostic = async () => {
    if (!selectedTx) return;
    setIsLoadingDiag(true);
    try {
      const res = await fetch("/api/monetique/log-analyzer/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: selectedTx.id }),
      });
      const data = await res.json();
      if (res.ok && data.diagnostic) {
        setDiagnostic(data.diagnostic);
        setActiveTab("diagnostic");
      } else {
        alert(data.error || "Erreur lors du diagnostic");
      }
    } catch (err: any) {
      alert("Erreur de connexion : " + err.message);
    } finally {
      setIsLoadingDiag(false);
    }
  };

  // Ouverture de la modale de suppression d'un fichier
  const promptDeleteFile = (targetFileId: string) => {
    if (!targetFileId) return;
    const f = files.find((item) => item.id === targetFileId);
    if (!f) return;
    setDeleteModal({
      isOpen: true,
      mode: "single",
      fileId: f.id,
      filename: f.filename,
      eventCount: f.parsedEventCount,
      rrnCount: f.distinctRrnCount,
    });
  };

  // Ouverture de la modale pour vider tous les fichiers
  const promptClearAllFiles = () => {
    if (files.length === 0) return;
    setDeleteModal({
      isOpen: true,
      mode: "all",
    });
  };

  // Confirmation et exécution de la suppression
  const confirmDelete = async () => {
    if (!deleteModal) return;
    setIsDeleting(true);

    try {
      if (deleteModal.mode === "single" && deleteModal.fileId) {
        const targetId = deleteModal.fileId;
        const confirmName = deleteModal.filename || "le fichier";
        const res = await fetch(`/api/monetique/log-analyzer/files?fileId=${targetId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (res.ok) {
          setMessage({ text: `✓ Fichier "${confirmName}" supprimé avec succès.`, type: "success" });
          setSelectedTx(null);
          setCandidates([]);
          setDiagnostic(null);
          setFileTransactions([]);
          setRrnInput("");

          const updatedFiles = files.filter((item) => item.id !== targetId);
          setFiles(updatedFiles);
          if (updatedFiles.length > 0) {
            const nextId = updatedFiles[0].id;
            setSelectedFileId(nextId);
            await loadFileTransactions(nextId);
          } else {
            setSelectedFileId("");
          }
        } else {
          setMessage({ text: data.error || "Erreur lors de la suppression.", type: "error" });
        }
      } else if (deleteModal.mode === "all") {
        const res = await fetch(`/api/monetique/log-analyzer/files?all=true`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (res.ok) {
          setMessage({ text: "✓ Tous les fichiers de traces ont été supprimés.", type: "success" });
          setSelectedTx(null);
          setCandidates([]);
          setDiagnostic(null);
          setFileTransactions([]);
          setRrnInput("");
          setFiles([]);
          setSelectedFileId("");
        } else {
          setMessage({ text: data.error || "Erreur lors de la suppression globale.", type: "error" });
        }
      }
    } catch (err: any) {
      setMessage({ text: `Erreur : ${err.message}`, type: "error" });
    } finally {
      setIsDeleting(false);
      setDeleteModal(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(null), 2500);
    }
  };

  const selectedFile = files.find((f) => f.id === selectedFileId);

  // Filtrage du tableau des transactions
  const filteredTransactions = useMemo(() => {
    if (!txFilter.trim()) return fileTransactions;
    const q = txFilter.toLowerCase().trim();
    return fileTransactions.filter((tx) =>
      tx.rrn.toLowerCase().includes(q) ||
      (tx.stan && tx.stan.toLowerCase().includes(q)) ||
      (tx.terminalId && tx.terminalId.toLowerCase().includes(q)) ||
      (tx.mti && tx.mti.toLowerCase().includes(q))
    );
  }, [fileTransactions, txFilter]);

  // Extraction et consolidation des champs ISO 8583
  const consolidatedIsoFields = useMemo(() => {
    if (!selectedTx) return [];
    const fieldsMap: Record<string, { value: string; sources: string[] }> = {};

    for (const assoc of selectedTx.events) {
      for (const [de, val] of Object.entries(assoc.event.isoFields)) {
        if (!fieldsMap[de]) {
          fieldsMap[de] = { value: val, sources: [assoc.event.realm] };
        } else if (!fieldsMap[de].sources.includes(assoc.event.realm)) {
          fieldsMap[de].sources.push(assoc.event.realm);
        }
      }
    }

    const entries = Object.entries(fieldsMap).map(([de, info]) => {
      const deNum = parseInt(de, 10);
      let category = "AUTRE";
      if ([2, 11, 37, 38, 41, 42, 43].includes(deNum)) category = "IDENTIFIANT";
      else if ([4, 6, 49, 50, 51].includes(deNum)) category = "FINANCIER";
      else if ([7, 12, 13, 15, 17].includes(deNum)) category = "DATE_HEURE";
      else if ([39, 44, 48].includes(deNum)) category = "REPONSE";
      else if ([52, 53, 55, 64, 128].includes(deNum)) category = "SECURITE_EMV";

      return {
        de,
        deNum: isNaN(deNum) ? 999 : deNum,
        value: info.value,
        sources: info.sources,
        category,
      };
    });

    entries.sort((a, b) => a.deNum - b.deNum);
    return entries;
  }, [selectedTx]);

  const filteredIsoFields = useMemo(() => {
    return consolidatedIsoFields.filter((item) => {
      const matchesCategory = isoCategoryFilter === "ALL" || item.category === isoCategoryFilter;
      const q = isoSearchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.de.includes(q) ||
        `de${item.de}`.includes(q) ||
        item.value.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [consolidatedIsoFields, isoCategoryFilter, isoSearchTerm]);

  return (
    <AppShell pageTitle="Monétique Log Analyzer" eyebrow="INVESTIGATION FORENSICS DES LOGS SWITCH">
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1400px", margin: "0 auto", paddingBottom: "48px" }}>
        
        {/* ========================================================================= */}
        {/* 1. HERO COMMAND CENTER : Titre, Charte Graphique & Action d'Importation   */}
        {/* ========================================================================= */}
        <section
          style={{
            background: "linear-gradient(135deg, #0b1320 0%, #111e33 60%, #0a1727 100%)",
            color: "#ffffff",
            padding: "24px 28px",
            borderRadius: "14px",
            border: "1px solid #1e2e47",
            borderLeft: `5px solid ${brandPrimary}`,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.35)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ligne lumineuse en fond subtil */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "350px",
              height: "100%",
              background: `radial-gradient(circle at top right, ${brandBgSubtle} 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px", position: "relative", zIndex: 1 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: brandBgSubtle,
                    color: brandPrimary,
                    border: `1px solid ${brandBorderSubtle}`,
                  }}
                >
                  ⚡ SWITCH CORE MONÉTIQUE & CBS
                </span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>•</span>
                <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>
                  Filiale active : <strong style={{ color: "#ffffff" }}>{subsidiary === "AFG" ? "AFG Bank (Atlantic)" : "SGABS"}</strong>
                </span>
              </div>

              <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
                Monétique Log Analyzer &amp; Corrélation Multi-Sauts
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: 0, maxWidth: "780px", lineHeight: "1.5" }}>
                Parseur déterministe pour traces <strong style={{ color: "#e2e8f0" }}>jPOS XML</strong>, <strong style={{ color: "#e2e8f0" }}>fichiers plats</strong> et <strong style={{ color: "#e2e8f0" }}>.TRC</strong>. 
                Reconstitution automatique de la chaîne transactionnelle de bout en bout (Client ➔ Switch ➔ CBS/Host) avec détection de ruptures et diagnostic IA certifié.
              </p>
            </div>

            {/* Bouton d'importation pro */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label
                style={{
                  background: `linear-gradient(135deg, ${brandPrimary} 0%, ${brandHover} 100%)`,
                  color: "#ffffff",
                  padding: "11px 20px",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  cursor: isUploading ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: `0 4px 14px ${brandBgSubtle}`,
                  border: "1px solid rgba(255,255,255,0.15)",
                  transition: "all 0.2s ease",
                }}
              >
                {isUploading ? (
                  <>
                    <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>🔄</span>
                    Indexation en cours...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Importer un fichier de traces (.log, .txt, .trc)
                  </>
                )}
                <input
                  type="file"
                  accept=".log,.txt,.trc,.TRC,.csv"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          {/* Bannière de notification stylée */}
          {message && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                background:
                  message.type === "success"
                    ? "rgba(6, 78, 59, 0.85)"
                    : message.type === "error"
                    ? "rgba(127, 29, 29, 0.85)"
                    : "rgba(30, 58, 138, 0.85)",
                border:
                  message.type === "success"
                    ? "1px solid #059669"
                    : message.type === "error"
                    ? "1px solid #dc2626"
                    : "1px solid #3b82f6",
                color: "#ffffff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "16px" }}>
                  {message.type === "success" ? "✅" : message.type === "error" ? "⚠️" : "ℹ️"}
                </span>
                <span>{message.text}</span>
              </div>
              <button
                onClick={() => setMessage(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "16px",
                  cursor: "pointer",
                  opacity: 0.7,
                }}
              >
                ✕
              </button>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 2. BARRE DE COMMANDE & RECHERCHE TRANSACTIONNELLE                         */}
        {/* ========================================================================= */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            padding: "20px 24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1.2fr 0.8fr",
              gap: "20px",
              alignItems: "flex-end",
            }}
          >
            {/* Sélection du fichier actif */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <label
                  style={{
                    color: "#475569",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Fichier de logs actif
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      background: "#f1f5f9",
                      color: "#334155",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {files.length} disponible(s)
                  </span>
                  {files.length > 1 && (
                    <button
                      onClick={promptClearAllFiles}
                      title="Vider tous les fichiers indexés"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: 0,
                      }}
                    >
                      Vider tout
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <select
                  value={selectedFileId}
                  onChange={(e) => handleSelectFile(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "#f8fafc",
                    color: "#0f172a",
                    border: "1px solid #cbd5e1",
                    fontSize: "13.5px",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {files.length === 0 ? (
                    <option value="">Aucun fichier indexé - Veuillez importer un fichier</option>
                  ) : (
                    files.map((f) => (
                      <option key={f.id} value={f.id}>
                        📁 {f.filename} ({f.parsedEventCount.toLocaleString()} jalons, {f.distinctRrnCount.toLocaleString()} RRNs)
                      </option>
                    ))
                  )}
                </select>

                {selectedFileId && (
                  <button
                    onClick={() => promptDeleteFile(selectedFileId)}
                    title="Supprimer ce fichier et ses index"
                    style={{
                      background: "#fee2e2",
                      color: "#b91c1c",
                      border: "1px solid #fca5a5",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      whiteSpace: "nowrap",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>🗑️</span>
                    <span>Supprimer</span>
                  </button>
                )}
              </div>
            </div>

            {/* Saisie du RRN */}
            <div>
              <label
                style={{
                  display: "block",
                  color: "#475569",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                RRN DE37 Recherché (12 caractères)
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={rrnInput}
                  onChange={(e) => setRrnInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      executeSearch(selectedFileId, rrnInput);
                    }
                  }}
                  placeholder="Ex: 630644782950 ou 164550290820"
                  style={{
                    width: "100%",
                    padding: "10px 36px 10px 14px",
                    borderRadius: "8px",
                    background: "#f8fafc",
                    color: "#0f172a",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    outline: "none",
                  }}
                />
                {rrnInput && (
                  <button
                    onClick={() => setRrnInput("")}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Bouton de recherche */}
            <div>
              <button
                onClick={() => executeSearch(selectedFileId, rrnInput)}
                disabled={isSearching}
                style={{
                  width: "100%",
                  padding: "11px 20px",
                  borderRadius: "8px",
                  background: isSearching ? "#94a3b8" : `linear-gradient(135deg, ${brandPrimary} 0%, ${brandHover} 100%)`,
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: isSearching ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.15s ease",
                }}
              >
                {isSearching ? (
                  <>
                    <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>🔄</span>
                    Recherche...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    Analyser la Transaction
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RRNs découverts sous forme de tags interactifs */}
          {selectedFile && selectedFile.discoveredRrns && selectedFile.discoveredRrns.length > 0 && (
            <div
              style={{
                marginTop: "16px",
                paddingTop: "14px",
                borderTop: "1px dashed #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "11.5px", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                RRNs découverts dans ce fichier :
              </span>
              {selectedFile.discoveredRrns.slice(0, 10).map((sampleRrn) => {
                const isActive = rrnInput === sampleRrn;
                return (
                  <button
                    key={sampleRrn}
                    onClick={() => {
                      setRrnInput(sampleRrn);
                      executeSearch(selectedFileId, sampleRrn);
                    }}
                    style={{
                      background: isActive ? brandPrimary : "#f1f5f9",
                      color: isActive ? "#ffffff" : "#0f172a",
                      border: `1px solid ${isActive ? brandPrimary : "#cbd5e1"}`,
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>{sampleRrn}</span>
                    {isActive && <span style={{ fontSize: "10px" }}>✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 3. TABLEAU DES TRANSACTIONS DU FICHIER (quand aucune n'est sélectionnée)  */}
        {/* ========================================================================= */}
        {!selectedTx && fileTransactions.length > 0 && (
          <section
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "20px 24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0" }}>
                  📋 Transactions identifiées dans "{selectedFile?.filename}"
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                  Sélectionnez une transaction pour déplier sa timeline multi-sauts, comparer requête/réponse et lancer le diagnostic IA.
                </p>
              </div>

              {/* Filtre rapide */}
              <div style={{ width: "260px" }}>
                <input
                  type="text"
                  value={txFilter}
                  onChange={(e) => setTxFilter(e.target.value)}
                  placeholder="Filtrer par RRN, STAN, TID..."
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    fontSize: "12.5px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", color: "#475569", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: "11.5px", textTransform: "uppercase" }}>RRN (DE37)</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: "11.5px", textTransform: "uppercase" }}>STAN (DE11)</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: "11.5px", textTransform: "uppercase" }}>Terminal (DE41)</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: "11.5px", textTransform: "uppercase" }}>Type (MTI)</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: "11.5px", textTransform: "uppercase" }}>Horodatage</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: "11.5px", textTransform: "uppercase" }}>Jalons</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: "11.5px", textTransform: "uppercase", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((txSummary, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        background: idx % 2 === 0 ? "#ffffff" : "#fbfcfd",
                        transition: "background 0.15s ease",
                      }}
                    >
                      <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 800, color: brandPrimary }}>
                        {txSummary.rrn}
                      </td>
                      <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "#334155", fontWeight: 600 }}>
                        {txSummary.stan || "—"}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#475569", fontWeight: 600 }}>
                        {txSummary.terminalId || "—"}
                      </td>
                      <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "#0f172a", fontWeight: 700 }}>
                        <span
                          style={{
                            background: txSummary.mti?.startsWith("02") ? "#e0f2fe" : "#f1f5f9",
                            color: txSummary.mti?.startsWith("02") ? "#0369a1" : "#475569",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "11.5px",
                          }}
                        >
                          {txSummary.mti || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#64748b", fontSize: "12.5px" }}>
                        {txSummary.firstTimestamp?.substring(0, 19) || "—"}
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <span
                          style={{
                            background: "#ecfdf5",
                            color: "#047857",
                            border: "1px solid #a7f3d0",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "11.5px",
                            fontWeight: 700,
                          }}
                        >
                          {txSummary.eventsCount} jalon(s)
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "right" }}>
                        <button
                          onClick={() => {
                            setRrnInput(txSummary.rrn);
                            executeSearch(selectedFileId, txSummary.rrn);
                          }}
                          style={{
                            background: `linear-gradient(135deg, ${brandPrimary} 0%, ${brandHover} 100%)`,
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "6px 14px",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          }}
                        >
                          Examiner ➔
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 4. DÉTAIL COMPLET DE LA TRANSACTION SÉLECTIONNÉE                          */}
        {/* ========================================================================= */}
        {selectedTx && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* CARTE D'EN-TÊTE RÉCAPITULATIF (METRICS OVERVIEW) */}
            <section
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                padding: "20px 24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span
                      style={{
                        background: brandBgSubtle,
                        color: brandPrimary,
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 800,
                        border: `1px solid ${brandBorderSubtle}`,
                      }}
                    >
                      TRANSACTION CORRÉLÉE
                    </span>
                    <span style={{ fontSize: "13px", color: "#64748b" }}>•</span>
                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>
                      Fichier source : <strong>{selectedFile?.filename}</strong>
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "monospace" }}>
                      RRN : {selectedTx.rrn}
                    </h2>
                    <button
                      onClick={() => copyToClipboard(selectedTx.rrn, "RRN copié")}
                      style={{
                        background: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        color: "#475569",
                        cursor: "pointer",
                      }}
                    >
                      {copyFeedback === "RRN copié" ? "✓ Copié !" : "📋 Copier"}
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button
                    onClick={() => setSelectedTx(null)}
                    style={{
                      background: "#f1f5f9",
                      color: "#334155",
                      border: "1px solid #cbd5e1",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    ← Retour à la liste
                  </button>

                  <button
                    onClick={handleRequestDiagnostic}
                    disabled={isLoadingDiag}
                    style={{
                      background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                      color: "#ffffff",
                      border: "none",
                      padding: "9px 18px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: isLoadingDiag ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 2px 8px rgba(124, 58, 237, 0.25)",
                    }}
                  >
                    {isLoadingDiag ? (
                      <>
                        <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>🔄</span>
                        Analyse IA en cours...
                      </>
                    ) : (
                      <>
                        <span>🤖</span> Solliciter le Diagnostic IA
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Grille des KPI transactionnels */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                  marginTop: "16px",
                }}
              >
                <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>STAN (DE11)</span>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", fontFamily: "monospace", marginTop: "2px" }}>
                    {selectedTx.stan || "N/A"}
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Audit Trace Number</span>
                </div>

                <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Terminal (DE41)</span>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", fontFamily: "monospace", marginTop: "2px" }}>
                    {selectedTx.terminalId || "N/A"}
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Identifiant GAB / TPE</span>
                </div>

                <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Flux MTI</span>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", fontFamily: "monospace", marginTop: "2px" }}>
                    {selectedTx.mtiInitial || "?"} ➔ {selectedTx.mtiFinal || "?"}
                  </div>
                  <span style={{ fontSize: "11px", color: "#059669", fontWeight: 600 }}>Requête ➔ Réponse</span>
                </div>

                <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Durée de Traversée</span>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      marginTop: "2px",
                      color: selectedTx.durationMs > 2000 ? "#dc2626" : selectedTx.durationMs > 500 ? "#d97706" : "#059669",
                    }}
                  >
                    {selectedTx.durationMs.toLocaleString()} ms
                  </div>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    {selectedTx.eventsCount} jalon(s) corrélé(s)
                  </span>
                </div>

                <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Niveau de Confiance</span>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: brandPrimary, marginTop: "2px" }}>
                    {Math.round(selectedTx.correlationScore * 100)}%
                  </div>
                  <span style={{ fontSize: "11px", color: "#059669", fontWeight: 600 }}>Déterministe ISO 8583</span>
                </div>
              </div>

              {/* Bandeau d'anomalies détectées */}
              {selectedTx.anomalies.length > 0 && (
                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedTx.anomalies.map((anom) => (
                    <div
                      key={anom.id}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "12.5px",
                        background: anom.severity === "CRITICAL" ? "#fef2f2" : "#fffbeb",
                        border: `1px solid ${anom.severity === "CRITICAL" ? "#fecaca" : "#fde68a"}`,
                        color: anom.severity === "CRITICAL" ? "#991b1b" : "#92400e",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "14px" }}>
                          {anom.severity === "CRITICAL" ? "🚨" : "⚠️"}
                        </span>
                        <div>
                          <strong>[{anom.category}] {anom.title} :</strong> {anom.description}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "10.5px",
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: anom.severity === "CRITICAL" ? "#fee2e2" : "#fef3c7",
                          color: anom.severity === "CRITICAL" ? "#991b1b" : "#92400e",
                          border: `1px solid ${anom.severity === "CRITICAL" ? "#fca5a5" : "#fcd34d"}`,
                        }}
                      >
                        {anom.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* BARRE D'ONGLETS ÉLÉGANTE */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                borderBottom: "2px solid #e2e8f0",
                paddingBottom: "2px",
              }}
            >
              <button
                onClick={() => setActiveTab("timeline")}
                style={{
                  padding: "10px 18px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  background: activeTab === "timeline" ? "#ffffff" : "transparent",
                  color: activeTab === "timeline" ? brandPrimary : "#64748b",
                  border: "none",
                  borderBottom: activeTab === "timeline" ? `3px solid ${brandPrimary}` : "3px solid transparent",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                <span>⏱️</span> Timeline du Traitement ({selectedTx.eventsCount} jalons)
              </button>

              <button
                onClick={() => setActiveTab("iso-fields")}
                style={{
                  padding: "10px 18px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  background: activeTab === "iso-fields" ? "#ffffff" : "transparent",
                  color: activeTab === "iso-fields" ? brandPrimary : "#64748b",
                  border: "none",
                  borderBottom: activeTab === "iso-fields" ? `3px solid ${brandPrimary}` : "3px solid transparent",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                <span>📊</span> Champs ISO 8583 ({consolidatedIsoFields.length})
              </button>

              <button
                onClick={() => setActiveTab("comparison")}
                style={{
                  padding: "10px 18px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  background: activeTab === "comparison" ? "#ffffff" : "transparent",
                  color: activeTab === "comparison" ? brandPrimary : "#64748b",
                  border: "none",
                  borderBottom: activeTab === "comparison" ? `3px solid ${brandPrimary}` : "3px solid transparent",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                <span>⚖️</span> Comparateur Requête / Réponse
              </button>

              <button
                onClick={() => setActiveTab("diagnostic")}
                style={{
                  padding: "10px 18px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  background: activeTab === "diagnostic" ? "#ffffff" : "transparent",
                  color: activeTab === "diagnostic" ? "#7c3aed" : "#64748b",
                  border: "none",
                  borderBottom: activeTab === "diagnostic" ? "3px solid #7c3aed" : "3px solid transparent",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s ease",
                }}
              >
                <span>🧠</span> Diagnostic Intelligent {diagnostic ? "✓" : ""}
              </button>
            </div>

            {/* ========================================================================= */}
            {/* ONGLET 1 : TIMELINE VERTICALE DU PARCOURS                                 */}
            {/* ========================================================================= */}
            {activeTab === "timeline" && (
              <section
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  padding: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ marginBottom: "18px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0" }}>
                    Parcours chronologique reconstitué à travers les composants du switch :
                  </h3>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                    Chaque jalon représente une capture réseau ou un point d'étape validé avec son delta de temps en millisecondes.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", position: "relative" }}>
                  {selectedTx.events.map((assoc, idx) => {
                    const isIncoming = assoc.event.direction === "incoming";
                    const isOutgoing = assoc.event.direction === "outgoing";

                    return (
                      <div
                        key={assoc.event.eventId}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "16px",
                          padding: "14px 18px",
                          borderRadius: "10px",
                          background: isIncoming ? "#f8fafc" : isOutgoing ? "#fcfaf7" : "#fafafa",
                          border: `1px solid ${isIncoming ? "#cbd5e1" : isOutgoing ? "#fed7aa" : "#e2e8f0"}`,
                          borderLeft: `4px solid ${isIncoming ? "#0284c7" : isOutgoing ? "#ea580c" : brandPrimary}`,
                          transition: "all 0.15s ease",
                        }}
                      >
                        {/* Numéro du saut */}
                        <div
                          style={{
                            minWidth: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: isIncoming ? "#e0f2fe" : isOutgoing ? "#ffedd5" : brandBgSubtle,
                            color: isIncoming ? "#0369a1" : isOutgoing ? "#c2410c" : brandPrimary,
                            display: "grid",
                            placeItems: "center",
                            fontSize: "13px",
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          #{idx + 1}
                        </div>

                        {/* Horodatage & Delta */}
                        <div style={{ minWidth: "140px", flexShrink: 0 }}>
                          <div style={{ fontSize: "12.5px", color: "#0f172a", fontWeight: 700, fontFamily: "monospace" }}>
                            {assoc.event.timestampRaw || assoc.event.timestampIso?.substring(11, 23)}
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px", fontWeight: 600 }}>
                            {idx === 0 ? "Jalon initial" : `+${assoc.delayFromPreviousMs} ms`}
                          </div>
                        </div>

                        {/* Realm & Direction */}
                        <div style={{ minWidth: "160px", flexShrink: 0 }}>
                          <span
                            style={{
                              fontSize: "11.5px",
                              fontWeight: 800,
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background: "#f1f5f9",
                              color: "#334155",
                              border: "1px solid #cbd5e1",
                              fontFamily: "monospace",
                            }}
                          >
                            {assoc.event.realm}
                          </span>
                          <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "4px", fontWeight: 600 }}>
                            {isIncoming ? "📥 Entrant" : isOutgoing ? "📤 Sortant" : "⚙️ Traitement interne"}
                          </div>
                        </div>

                        {/* Contenu de l'événement */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#0f172a" }}>
                            {assoc.event.eventType} {assoc.event.mti ? `(MTI: ${assoc.event.mti})` : ""}
                          </div>
                          <div style={{ fontSize: "12px", color: "#475569", marginTop: "3px" }}>
                            {assoc.reason}
                          </div>

                          {/* Conversion de code éventuelle */}
                          {assoc.event.responseCodeConversion && (
                            <div
                              style={{
                                marginTop: "6px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "3px 10px",
                                borderRadius: "4px",
                                background: "#fffbeb",
                                border: "1px solid #fde68a",
                                color: "#b45309",
                                fontSize: "12px",
                                fontWeight: 700,
                              }}
                            >
                              <span>🔄 Transcodage :</span>
                              <span>Received {assoc.event.responseCodeConversion.receivedCode} ➔ Send {assoc.event.responseCodeConversion.sendCode}</span>
                            </div>
                          )}
                        </div>

                        {/* Action voir trace brute */}
                        <div style={{ flexShrink: 0 }}>
                          <button
                            onClick={() => setSelectedEventRaw(assoc.event)}
                            style={{
                              background: "#ffffff",
                              color: "#334155",
                              border: "1px solid #cbd5e1",
                              borderRadius: "6px",
                              padding: "5px 12px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            }}
                          >
                            <span>🔍</span> Voir trame
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ========================================================================= */}
            {/* ONGLET 2 : CHAMPS ISO 8583 DÉCODÉS                                        */}
            {/* ========================================================================= */}
            {activeTab === "iso-fields" && (
              <section
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  padding: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0" }}>
                      Champs ISO 8583 Normalisés ({filteredIsoFields.length} champ(s))
                    </h3>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                      Données extraites, normalisées et conformes aux règles de masquage strict PCI-DSS.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {/* Filtre catégorie */}
                    <select
                      value={isoCategoryFilter}
                      onChange={(e) => setIsoCategoryFilter(e.target.value)}
                      style={{
                        padding: "7px 12px",
                        borderRadius: "6px",
                        background: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        fontSize: "12.5px",
                        fontWeight: 600,
                      }}
                    >
                      <option value="ALL">Toutes catégories</option>
                      <option value="IDENTIFIANT">Identifiants (DE2, DE11, DE37...)</option>
                      <option value="FINANCIER">Financier (DE4, DE49...)</option>
                      <option value="REPONSE">Réponse (DE39...)</option>
                      <option value="SECURITE_EMV">Sécurité EMV (DE52, DE55...)</option>
                      <option value="DATE_HEURE">Date / Heure</option>
                    </select>

                    {/* Barre de recherche */}
                    <input
                      type="text"
                      value={isoSearchTerm}
                      onChange={(e) => setIsoSearchTerm(e.target.value)}
                      placeholder="Chercher par DE ou valeur..."
                      style={{
                        padding: "7px 12px",
                        borderRadius: "6px",
                        background: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        fontSize: "12.5px",
                        width: "200px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {filteredIsoFields.map((item) => (
                    <div
                      key={item.de}
                      style={{
                        background: "#f8fafc",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span
                          style={{
                            background: brandBgSubtle,
                            color: brandPrimary,
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontFamily: "monospace",
                            border: `1px solid ${brandBorderSubtle}`,
                          }}
                        >
                          DE {item.de}
                        </span>
                        <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 700 }}>
                          {item.sources.join(", ")}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 700,
                          color: "#0f172a",
                          fontFamily: "monospace",
                          wordBreak: "break-all",
                          background: "#ffffff",
                          padding: "6px 8px",
                          borderRadius: "4px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        {item.value}
                      </div>

                      {item.de === "2" && (
                        <span style={{ fontSize: "10.5px", color: "#059669", fontWeight: 700 }}>
                          🔒 Masqué PCI-DSS (6 premiers / 4 derniers)
                        </span>
                      )}
                      {item.de === "39" && (
                        <span style={{ fontSize: "11px", color: item.value === "00" ? "#059669" : "#dc2626", fontWeight: 700 }}>
                          {item.value === "00" ? "✓ Accord / Transaction approuvée" : `⚠️ Code rejet : ${item.value}`}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ========================================================================= */}
            {/* ONGLET 3 : COMPARATEUR REQUÊTE VS RÉPONSE                                 */}
            {/* ========================================================================= */}
            {activeTab === "comparison" && (
              <section
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  padding: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ marginBottom: "18px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0" }}>
                    Comparaison Déterministe Requête vs Réponse
                  </h3>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                    Identification automatique des altérations de champs, des ajouts de codes d'autorisation et des cohérences financières.
                  </p>
                </div>

                {selectedTx.comparison ? (
                  <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", color: "#475569", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                          <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: "11.5px" }}>CHAMP DE</th>
                          <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: "11.5px" }}>DÉSIGNATION OFFICIELLE</th>
                          <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: "11.5px" }}>VALEUR REQUÊTE</th>
                          <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: "11.5px" }}>VALEUR RÉPONSE</th>
                          <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: "11.5px" }}>STATUT DIFF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTx.comparison.fields.map((f, idx) => {
                          const isIdentical = f.status === "IDENTICAL";
                          const isModified = f.status === "MODIFIED";

                          return (
                            <tr
                              key={f.fieldId}
                              style={{
                                borderBottom: "1px solid #f1f5f9",
                                background: idx % 2 === 0 ? "#ffffff" : "#fbfcfd",
                              }}
                            >
                              <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 800, color: brandPrimary }}>
                                DE {f.fieldId}
                              </td>
                              <td style={{ padding: "10px 14px", color: "#334155", fontWeight: 600 }}>
                                {f.name}
                              </td>
                              <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "#0f172a" }}>
                                {f.requestValue || "—"}
                              </td>
                              <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "#0f172a", fontWeight: 700 }}>
                                {f.responseValue || "—"}
                              </td>
                              <td style={{ padding: "10px 14px" }}>
                                <span
                                  style={{
                                    padding: "3px 8px",
                                    borderRadius: "12px",
                                    fontSize: "11px",
                                    fontWeight: 800,
                                    background: isIdentical ? "#ecfdf5" : isModified ? "#fffbeb" : "#f1f5f9",
                                    color: isIdentical ? "#047857" : isModified ? "#b45309" : "#475569",
                                    border: `1px solid ${isIdentical ? "#a7f3d0" : isModified ? "#fde68a" : "#cbd5e1"}`,
                                  }}
                                >
                                  {f.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "36px 0", color: "#64748b" }}>
                    Aucune paire de messages requête/réponse complète identifiée pour cette transaction.
                  </div>
                )}
              </section>
            )}

            {/* ========================================================================= */}
            {/* ONGLET 4 : DIAGNOSTIC IA & CAUSE RACINE (RCA)                              */}
            {/* ========================================================================= */}
            {activeTab === "diagnostic" && (
              <section
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  padding: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {diagnostic ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Bannière Cause Racine */}
                    <div
                      style={{
                        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                        borderRadius: "10px",
                        padding: "20px 24px",
                        color: "#ffffff",
                        border: "1px solid #4338ca",
                        boxShadow: "0 4px 14px rgba(67, 56, 202, 0.2)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background: "rgba(255,255,255,0.2)",
                            color: "#ffffff",
                            textTransform: "uppercase",
                          }}
                        >
                          🧠 Cause Racine Identifiée
                        </span>
                        <span style={{ fontSize: "12px", color: "#c7d2fe" }}>
                          Indice de certitude : <strong>{diagnostic.rootCauseConfidence}</strong>
                        </span>
                      </div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
                        {diagnostic.probableRootCause}
                      </div>
                      <p style={{ fontSize: "13.5px", color: "#e0e7ff", margin: 0, lineHeight: "1.5" }}>
                        {diagnostic.summary}
                      </p>
                    </div>

                    {/* Grille Faits & Hypothèses */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      {/* Faits Confirmés */}
                      <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "18px", border: "1px solid #e2e8f0" }}>
                        <h4 style={{ fontSize: "14px", fontWeight: 800, color: "#0369a1", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>✓</span> Faits Confirmés (Traces observables) :
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#334155", lineHeight: "1.6" }}>
                          {diagnostic.facts.map((fact, idx) => (
                            <li key={idx} style={{ marginBottom: "6px" }}>{fact}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Hypothèses Causales */}
                      <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "18px", border: "1px solid #e2e8f0" }}>
                        <h4 style={{ fontSize: "14px", fontWeight: 800, color: "#b45309", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>💡</span> Hypothèses Causales formulées :
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {diagnostic.hypotheses.map((hyp) => (
                            <div key={hyp.id} style={{ fontSize: "12.5px", color: "#334155" }}>
                              <div style={{ fontWeight: 700, color: "#0f172a" }}>
                                [{hyp.id}] {hyp.title} ({hyp.confidence})
                              </div>
                              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                                Preuves : {hyp.supportingEvidence.join(", ")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Plan d'action & Recommandations */}
                    <div style={{ background: "#f0fdf4", borderRadius: "10px", padding: "18px", border: "1px solid #bbf7d0" }}>
                      <h4 style={{ fontSize: "14px", fontWeight: 800, color: "#15803d", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>📋</span> Recommandations Immédiates &amp; Plan d'Action :
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#166534", lineHeight: "1.6" }}>
                        {diagnostic.correctiveActions.map((act, idx) => (
                          <li key={idx} style={{ marginBottom: "6px" }}><strong>Action corrective :</strong> {act}</li>
                        ))}
                        {diagnostic.recommendedVerifications.map((verif, idx) => (
                          <li key={idx} style={{ marginBottom: "6px" }}><strong>Vérification recommandée :</strong> {verif}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "48px 0" }}>
                    <div style={{ fontSize: "36px", marginBottom: "12px" }}>🤖</div>
                    <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>
                      Aucun rapport de diagnostic généré pour cette transaction
                    </h4>
                    <p style={{ color: "#64748b", fontSize: "13.5px", maxWidth: "520px", margin: "0 auto 20px auto" }}>
                      Cliquez ci-dessous pour déclencher l'analyse déterministe et le diagnostic IA certifié basé sur le runbook bancaire.
                    </p>
                    <button
                      onClick={handleRequestDiagnostic}
                      disabled={isLoadingDiag}
                      style={{
                        background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                        color: "#ffffff",
                        border: "none",
                        padding: "10px 22px",
                        borderRadius: "8px",
                        fontSize: "13.5px",
                        fontWeight: 700,
                        cursor: isLoadingDiag ? "not-allowed" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
                      }}
                    >
                      {isLoadingDiag ? "Génération en cours..." : "Générer le diagnostic IA"}
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODALE TRACE BRUTE D'UN ÉVÉNEMENT                                        */}
        {/* ========================================================================= */}
        {selectedEventRaw && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15, 23, 42, 0.75)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
            }}
          >
            <div
              style={{
                background: "#0b1320",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                maxWidth: "850px",
                width: "100%",
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                style={{
                  padding: "14px 20px",
                  background: "#111c2e",
                  borderBottom: "1px solid #1e293b",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      background: brandBgSubtle,
                      color: brandPrimary,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 800,
                      fontFamily: "monospace",
                    }}
                  >
                    ÉVÉNEMENT {selectedEventRaw.eventId}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>
                    Realm : {selectedEventRaw.realm}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={() => copyToClipboard(selectedEventRaw.rawContent, "Trace copiée")}
                    style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: "#e2e8f0",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {copyFeedback === "Trace copiée" ? "✓ Copié !" : "📋 Copier"}
                  </button>
                  <button
                    onClick={() => setSelectedEventRaw(null)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#94a3b8",
                      fontSize: "18px",
                      cursor: "pointer",
                      padding: "0 4px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              <pre
                style={{
                  margin: 0,
                  padding: "20px",
                  overflowY: "auto",
                  fontSize: "12.5px",
                  fontFamily: "monospace",
                  color: "#38bdf8",
                  background: "#070d18",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  lineHeight: "1.6",
                }}
              >
                {selectedEventRaw.rawContent}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODALE DE CONFIRMATION DE SUPPRESSION BANCAIRE REUTILISABLE               */}
        {/* ========================================================================= */}
        <ConfirmDeleteModal
          isOpen={!!deleteModal?.isOpen}
          title={
            deleteModal?.mode === "single"
              ? "Supprimer ce fichier de traces ?"
              : "Vider tous les fichiers de traces ?"
          }
          description={
            deleteModal?.mode === "single"
              ? "Cette action est irréversible. Le fichier et l'ensemble de ses index de transactions seront définitivement purgés du stockage local."
              : "Cette action effacera l'ensemble des fichiers indexés, les tables de corrélation et réinitialisera l'espace d'analyse."
          }
          itemBadge={
            deleteModal?.mode === "single" && deleteModal.filename
              ? {
                  icon: "📁",
                  label: deleteModal.filename,
                  details: `Événements : ${deleteModal.eventCount?.toLocaleString() || 0} · RRNs distincts : ${deleteModal.rrnCount?.toLocaleString() || 0}`,
                }
              : undefined
          }
          confirmButtonLabel="Confirmer la suppression"
          cancelButtonLabel="Annuler"
          isDeleting={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal(null)}
        />

      </div>
    </AppShell>
  );
}

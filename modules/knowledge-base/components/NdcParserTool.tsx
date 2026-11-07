"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  parseNdcMessage,
  NdcParseResult,
  NdcDeviceIdentifier,
  generateNdcForensicTicket,
  generateIso8583FromNdc,
  formatNumberSpace,
} from "../data/ndc-parser";

interface SampleMessage {
  category: "TRANSACTION" | "ALARM" | "HOST_COMMAND";
  label: string;
  msg: string;
  desc: string;
}

const SAMPLE_NDC_MESSAGES: SampleMessage[] = [
  // 1. Transactions Porteur (T2H Class 11)
  {
    category: "TRANSACTION",
    label: "Retrait Espèces Nominal (50 000 XOF)",
    msg: "00000111\x1c143201\x1cA\x1c;4970101234567890=2812201123456789\x1c01\x1c000000050000\x1cA1B2C3D4E5F60718\x1c",
    desc: "Transaction Request 11 : LUNO 000, Touche A, Piste 2 masquée, Montant 500.00, PIN Block",
  },
  {
    category: "TRANSACTION",
    label: "Retrait EMV Puce avec CAM Buffer (ARQC)",
    msg: "00100211\x1c150422\x1cB\x1c;4970109988776655=2906101000000000\x1c01\x1c000000020000\x1c8899AABBCCDDEEFF\x1c9F26084D5E12F9884511A2950500000480009F3602005A82023800",
    desc: "Retrait Puce avec données EMV complètes : Tags 9F26 (ARQC), 95 (TVR), 9F36 (ATC) et 82 (AIP)",
  },
  {
    category: "TRANSACTION",
    label: "Consultation Solde avec PIN Block",
    msg: "00000311\x1c161205\x1cC\x1c;4970105544332211=2709121234567890\x1c31\x1c000000000000\x1c7F6E5D4C3B2A1098\x1c",
    desc: "Demande de Solde Porteur : OpCode 31, montant 0.00, PIN chiffré DES/3DES",
  },
  {
    category: "TRANSACTION",
    label: "Retrait Rapide Fast Cash (20 000 XOF - Touche D)",
    msg: "00000411\x1c172314\x1cD\x1c;4970107766554433=2610201100000000\x1c01\x1c000000020000\x1c1122334455667788\x1c",
    desc: "Fast Cash Touche D : Retrait instantané 20 000 XOF avec piste magnétique et PIN chiffré",
  },
  {
    category: "TRANSACTION",
    label: "Virement Compte à Compte sur GAB (OpCode 40)",
    msg: "00000511\x1c183425\x1cB\x1c;4970102233445566=2711201123456789\x1c40\x1c000000100000\x1c9988776655443322\x1c",
    desc: "OpCode 40 : Transfert de fonds 100 000 XOF initié sur le guichet automatique",
  },
  {
    category: "TRANSACTION",
    label: "Changement Code Confidentiel PIN (OpCode 70)",
    msg: "00000611\x1c194536\x1cA\x1c;4970103344556677=2801201123456789\x1c70\x1c000000000000\x1c33445566778899AA\x1c",
    desc: "OpCode 70 : Mise à jour sécurisée du PIN sur le clavier EPP sous triple DES",
  },

  // 2. Alarmes & Pannes Matérielles (Unsolicited Status 12 avec Runbook de Résolution)
  {
    category: "ALARM",
    label: "Alarme D03 : Bourrage Stacker Distributeur S2 (M:23 R:02)",
    msg: "00000312\x1c0042\x1cD03\x1cM-STATUS:23 R-STATUS:02 STACKER_JAM",
    desc: "Unsolicited Status 12 : Alarme critique Cash Dispenser (D) - Billets bloqués dans l'accumulateur/stacker",
  },
  {
    category: "ALARM",
    label: "Alarme D05 : Volet d'Obturation Bloqué / Non Libéré (M:23 R:06)",
    msg: "00000412\x1c0043\x1cD05\x1cM-STATUS:23 R-STATUS:06 SHUTTER_FAIL_BLOCKED",
    desc: "Unsolicited Status 12 : Shutter physique bloqué - Volet de présentation d'espèces non libéré",
  },
  {
    category: "ALARM",
    label: "Alarme D01 : Cassettes de Coupures Vides (M:22 R:01)",
    msg: "00000512\x1c0044\x1cD01\x1cM-STATUS:22 R-STATUS:01 DISPENSER_EMPTY",
    desc: "Unsolicited Status 12 : Rupture totale de billets dans les cassettes d'approvisionnement",
  },
  {
    category: "ALARM",
    label: "Alarme D04 : Bac de Rejet Plein (M:24 R:03)",
    msg: "00000612\x1c0045\x1cD04\x1cM-STATUS:24 R-STATUS:03 DIVERT_BIN_FULL",
    desc: "Unsolicited Status 12 : Bac de purge (Divert Cassette) saturé de billets défectueux",
  },
  {
    category: "ALARM",
    label: "Alarme C01 : Bourrage Mécanique Lecteur Carte (M:12 R:01)",
    msg: "00000712\x1c0046\x1cC01\x1cM-STATUS:12 R-STATUS:01 CARD_READER_JAMMED",
    desc: "Unsolicited Status 12 : Carte plastique coincée dans le convoyeur motorisé du lecteur",
  },
  {
    category: "ALARM",
    label: "Alarme C02 : Bac de Rétention Cartes Plein (M:14 R:00)",
    msg: "00000812\x1c0047\x1cC02\x1cM-STATUS:14 R-STATUS:00 CAPTURE_BIN_FULL",
    desc: "Unsolicited Status 12 : Bac de capture saturé (capacité maximale de 30 cartes atteinte)",
  },
  {
    category: "ALARM",
    label: "Alarme C03 : Carte Porteur Avalée / Timeout 30s (M:11 R:03)",
    msg: "00000912\x1c0048\x1cC03\x1cM-STATUS:11 R-STATUS:03 CARD_RETAINED_TIMEOUT",
    desc: "Unsolicited Status 12 : Carte capturée suite au non-retrait par le porteur dans le délai imparti",
  },
  {
    category: "ALARM",
    label: "Alarme K01 : Anti-Intrusion EPP Tamper Déclenché (M:71 R:01)",
    msg: "00001012\x1c0049\x1cK01\x1cM-STATUS:71 R-STATUS:01 TAMPER_ACTIVE_KEYS_LOST",
    desc: "Unsolicited Status 12 : Clavier sécurisé EPP en autodéfense - Effacement préventif des clés maîtresses",
  },
  {
    category: "ALARM",
    label: "Alarme L01 : Alerte Sismique & Choc Coffre-Fort (M:82 R:01)",
    msg: "00001112\x1c0050\x1cL01\x1cM-STATUS:82 R-STATUS:01 SEISMIC_ATTACK",
    desc: "Unsolicited Status 12 : Alerte de sécurité maximale - Détecteur de vibration/choc activé sur le coffre",
  },
  {
    category: "ALARM",
    label: "Alarme L02 : Porte Coffre Ouverte sans Autorisation (M:80 R:01)",
    msg: "00001212\x1c0051\x1cL02\x1cM-STATUS:80 R-STATUS:01 VAULT_DOOR_OPEN",
    desc: "Unsolicited Status 12 : Contacteur porte de coffre ouvert en dehors d'une fenêtre de maintenance",
  },
  {
    category: "ALARM",
    label: "Alarme F01 : Papier Bobine Reçus Épuisé (M:32 R:00)",
    msg: "00001312\x1c0052\x1cF01\x1cM-STATUS:32 R-STATUS:00 PAPER_OUT",
    desc: "Unsolicited Status 12 : Imprimante reçus (F) en défaut de papier thermique 80mm",
  },
  {
    category: "ALARM",
    label: "Alarme F02 : Massicot Bloqué / Bourrage Ticket (M:33 R:03)",
    msg: "00001412\x1c0053\x1cF02\x1cM-STATUS:33 R-STATUS:03 CUTTER_JAM",
    desc: "Unsolicited Status 12 : Lame du massicot bloquée dans la fente d'éjection des reçus",
  },
  {
    category: "ALARM",
    label: "Alarme Q01 : BNA Recycleur - Bourrage Module Reconnaissance (M:52 R:01)",
    msg: "00001512\x1c0054\x1cQ01\x1cM-STATUS:52 R-STATUS:01 BNA_IN_FEED_JAM",
    desc: "Unsolicited Status 12 : Billet plié coincé dans la tête de détection optique UV/IR du BNA",
  },
  {
    category: "ALARM",
    label: "Alarme M00 : Bascule en Mode Superviseur / Maintenance",
    msg: "00001612\x1c0055\x1cM00\x1cSUPERVISOR_KEY_TURNED_ON",
    desc: "Unsolicited Status 12 : Clé superviseur tournée par l'exploitant pour arrêt local de service",
  },

  // 3. Commandes Host vers Automate (H2T) & Statuts Sollicités
  {
    category: "HOST_COMMAND",
    label: "H2T : Ordre Distribution (5 Billets C2)",
    msg: "1000\x1c005\x1c00050000\x1c1\x1cMERCI DE VOTRE VISITE - RETRAIT 50000 XOF",
    desc: "Function Command Host ➜ GAB : Délivrer 5 billets de la cassette 2 et éjecter la carte",
  },
  {
    category: "HOST_COMMAND",
    label: "H2T : Chargement Clé Maître EPP Master Key A1",
    msg: "3000\x1cA1\x1c4F9A8C7B1E2D3F4A5B6C7D8E9F0A1B2C\x1cA1B2C3",
    desc: "Key Management Host ➜ GAB : Chargement de Master Key 3DES A1 avec cryptogramme et KCV",
  },
  {
    category: "HOST_COMMAND",
    label: "H2T : Téléchargement Masque d'États (State Table A)",
    msg: "2000\x1cA001\x1c001\x1c002",
    desc: "Configuration Load : Masque d'état A (Lecture carte et orientation porteur)",
  },
  {
    category: "HOST_COMMAND",
    label: "T2H : Compte-Rendu Distribution Réussie (Solicited 22)",
    msg: "20000122\x1c0042\x1c00000000\x1c00000000",
    desc: "Solicited Status 22 : Compte-rendu du distributeur confirmant la distribution sans incident",
  },
  {
    category: "HOST_COMMAND",
    label: "T2H : Distribution Partielle avec Bourrage (Solicited 22 JAM)",
    msg: "20000222\x1c0043\x1c00020000\x1c00030000_JAM",
    desc: "Solicited Status 22 : 2 billets distribués sur 5, bourrage survenu pendant l'éjection",
  },
];

const CURRENCIES = [
  { code: "XOF", label: "Franc CFA (XOF)", defaultDenoms: [10000, 5000, 2000, 1000] },
  { code: "EUR", label: "Euro (€ / EUR)", defaultDenoms: [50, 20, 10, 5] },
  { code: "USD", label: "Dollar ($ / USD)", defaultDenoms: [100, 50, 20, 10] },
  { code: "MAD", label: "Dirham (MAD)", defaultDenoms: [200, 100, 50, 20] },
  { code: "XAF", label: "Franc CFA CEMAC (XAF)", defaultDenoms: [10000, 5000, 2000, 1000] },
];

export function NdcParserTool() {
  const router = useRouter();
  const [inputMessage, setInputMessage] = useState<string>(SAMPLE_NDC_MESSAGES[0].msg);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sampleFilter, setSampleFilter] = useState<"ALL" | "TRANSACTION" | "ALARM" | "HOST_COMMAND">("ALL");
  const [viewMode, setViewMode] = useState<"READABLE" | "CONTROL_CHARS">("READABLE");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("XOF");
  const [denominations, setDenominations] = useState<[number, number, number, number]>([10000, 5000, 2000, 1000]);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [selectedDeviceFocus, setSelectedDeviceFocus] = useState<NdcDeviceIdentifier | null>(null);

  // Mettre à jour les coupures lors du changement de devise
  const handleCurrencyChange = (currCode: string) => {
    setSelectedCurrency(currCode);
    const curr = CURRENCIES.find((c) => c.code === currCode);
    if (curr) {
      setDenominations(curr.defaultDenoms as [number, number, number, number]);
    }
  };

  const parsed: NdcParseResult = useMemo(() => {
    return parseNdcMessage(inputMessage, {
      cassetteDenominations: denominations,
      currency: selectedCurrency,
    });
  }, [inputMessage, denominations, selectedCurrency]);

  const filteredFields = useMemo(() => {
    return parsed.fields.filter((field) => {
      const q = searchTerm.toLowerCase().trim();
      return (
        !q ||
        field.name.toLowerCase().includes(q) ||
        field.frenchTitle.toLowerCase().includes(q) ||
        field.displayValue.toLowerCase().includes(q) ||
        (field.interpretation && field.interpretation.toLowerCase().includes(q))
      );
    });
  }, [parsed, searchTerm]);

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(
      {
        direction: parsed.direction,
        category: parsed.messageCategory,
        luno: parsed.luno,
        criticalInsights: parsed.criticalInsights,
        deviceDiagnostic: parsed.deviceDiagnostic,
        fields: parsed.fields.map((f) => ({
          index: f.index,
          name: f.name,
          title: f.frenchTitle,
          value: f.displayValue,
          isMasked: f.isMasked,
          interpretation: f.interpretation,
        })),
        errors: parsed.errors,
        warnings: parsed.warnings,
      },
      null,
      2
    );
    navigator.clipboard.writeText(jsonStr);
    setCopyFeedback("JSON copié !");
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleCopyForensicTicket = () => {
    const ticket = generateNdcForensicTicket(parsed);
    navigator.clipboard.writeText(ticket);
    setCopyFeedback("Rapport ticket copié !");
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleCopyRunbook = () => {
    if (!parsed.deviceDiagnostic?.runbook) return;
    const rb = parsed.deviceDiagnostic.runbook;
    const text = `======================================================================
PROCÉDURE D'INTERVENTION & MARCHE À SUIVRE (GAB / ATM RUNBOOK)
TITRE       : ${rb.title}
LUNO GAB    : ${parsed.luno}
COMPOSANT   : ${parsed.deviceDiagnostic.frenchName} (${parsed.deviceDiagnostic.deviceName})
STATUT M/R  : M:${parsed.deviceDiagnostic.mStatus || "N/A"} / R:${parsed.deviceDiagnostic.rStatus || "N/A"}
DÉLAI ESTIMÉ: ${rb.estimatedDownTime}
RESPONSABLE : ${rb.escalationTarget}
======================================================================

ÉTAPE 1 - SÉCURISATION & MISE HORS-SERVICE IMMÉDIATE :
${rb.phase1Security}

ÉTAPE 2 - ACCÈS PHYSIQUE & DÉVERROUILLAGE DU COFFRE :
${rb.phase2Access}

ÉTAPE 3 - DIAGNOSTIC & DÉGAGEMENT MÉCANIQUE / RÉPARATION :
${rb.phase3ClearingOrRepair}

ÉTAPE 4 - RÉCONCILIATION FINANCIÈRE & AUDIT DES COMPTEURS :
${rb.phase4AuditAndCount}

ÉTAPE 5 - TESTS SUPERVISEUR & REMISE EN SERVICE OFFICIELLE :
${rb.phase5Recommissioning}
======================================================================`;
    navigator.clipboard.writeText(text);
    setCopyFeedback("Marche à suivre copiée !");
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleBridgeToIsoParser = () => {
    if (!parsed.criticalInsights.isoBridge) return;
    const isoRaw = parsed.criticalInsights.isoBridge.isoRaw;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ndc_to_iso_payload", isoRaw);
    }
    router.push("/hub/parser");
  };

  const handleCopyIsoBridge = () => {
    if (!parsed.criticalInsights.isoBridge) return;
    navigator.clipboard.writeText(parsed.criticalInsights.isoBridge.isoRaw);
    setCopyFeedback("Trame ISO 8583 copiée !");
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  // Filtrage des échantillons
  const filteredSamples = useMemo(() => {
    if (sampleFilter === "ALL") return SAMPLE_NDC_MESSAGES;
    return SAMPLE_NDC_MESSAGES.filter((s) => s.category === sampleFilter);
  }, [sampleFilter]);

  // État de santé des sous-ensembles pour le synoptique matériel
  const hardwareStatus = useMemo(() => {
    const dev = parsed.criticalInsights.deviceAffected;
    const hasJam = parsed.criticalInsights.hasBillJam;
    const isAlarm = parsed.messageCategory === "UNSOLICITED_STATUS";

    return {
      cardReader: dev === "C" ? (isAlarm ? "FAULT" : "ACTIVE") : parsed.criticalInsights.pan ? "ACTIVE" : "IDLE",
      dispenser: dev === "D" || hasJam ? "FAULT" : parsed.criticalInsights.dispenseDetails ? "ACTIVE" : "IDLE",
      epp: dev === "K" ? "FAULT" : parsed.criticalInsights.hasPinBlock ? "ACTIVE" : "IDLE",
      printer: dev === "F" ? "FAULT" : "IDLE",
      safe: dev === "L" ? "FAULT" : "LOCKED",
      screen: parsed.criticalInsights.nextScreen ? "ACTIVE" : "IDLE",
      bna: dev === "Q" ? "FAULT" : "IDLE",
    };
  }, [parsed]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* En-tête */}
      <div className="hero-search">
        <div>
          <p className="eyebrow accent" style={{ color: "#10b981" }}>
            EXPLOITATION &amp; PROTOCOLE GAB (NDC+ / DDC SPECIFICATION)
          </p>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a" }}>
            Décodeur Avancé de Trames NDC / NDC+ (NCR Direct Connect)
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#64748b", marginTop: "0.35rem", lineHeight: "1.5" }}>
            Analyse forensique complète des échanges automate (GAB / ATM) et switch monétique. Décodage synoptique du matériel, alarmes M-Status &amp; R-Status détaillées, calcul automatique des coupures de billets, passerelle ISO 8583 et génération de tickets d&apos;incident technique.
          </p>
        </div>
      </div>

      {/* Barre de sélection des scénarios d'exemple */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          padding: "1rem 1.25rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0f172a" }}>📚 Scénarios de Production :</span>
            <div style={{ display: "inline-flex", background: "#f1f5f9", padding: "2px", borderRadius: "6px" }}>
              {(["ALL", "TRANSACTION", "ALARM", "HOST_COMMAND"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSampleFilter(cat)}
                  style={{
                    border: "none",
                    background: sampleFilter === cat ? "#ffffff" : "transparent",
                    color: sampleFilter === cat ? "#0369a1" : "#64748b",
                    fontWeight: sampleFilter === cat ? 800 : 600,
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    boxShadow: sampleFilter === cat ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  {cat === "ALL" ? "Tous" : cat === "TRANSACTION" ? "💳 Retraits & Porteur" : cat === "ALARM" ? "🚨 Pannes & Alarmes" : "🖥️ Ordres Host (H2T)"}
                </button>
              ))}
            </div>
          </div>

          <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
            {filteredSamples.length} exemples disponibles
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {filteredSamples.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setInputMessage(sample.msg)}
              className="btn-ghost"
              title={sample.desc}
              style={{
                fontSize: "0.78rem",
                padding: "0.3rem 0.65rem",
                background: inputMessage === sample.msg ? "#e0f2fe" : "#f8fafc",
                borderColor: inputMessage === sample.msg ? "#0284c7" : "#cbd5e1",
                color: inputMessage === sample.msg ? "#0369a1" : "#334155",
                fontWeight: inputMessage === sample.msg ? 700 : 500,
              }}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zone de Saisie & Contrôles */}
      <div
        className="card"
        style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <label style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>
            Trame NDC Brute (ASCII FS <code style={{ color: "#0284c7" }}>0x1C</code> / Séparateur <code style={{ color: "#0284c7" }}>^</code> ou <code style={{ color: "#0284c7" }}>&lt;FS&gt;</code>) :
          </label>

          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              onClick={() => setViewMode(viewMode === "READABLE" ? "CONTROL_CHARS" : "READABLE")}
              className="btn-ghost"
              style={{ fontSize: "0.78rem", padding: "0.25rem 0.55rem" }}
            >
              {viewMode === "READABLE" ? "🔍 Afficher Délimiteurs <FS>" : "📄 Mode Texte Normal"}
            </button>
            <button
              onClick={() => setInputMessage("")}
              className="btn-ghost"
              style={{ fontSize: "0.78rem", padding: "0.25rem 0.55rem" }}
            >
              Effacer
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={
            viewMode === "CONTROL_CHARS"
              ? inputMessage.replace(/\x1c/g, "<FS>").replace(/\x1d/g, "<GS>").replace(/\x1e/g, "<RS>")
              : inputMessage
          }
          onChange={(e) => {
            const val = e.target.value;
            setInputMessage(val.replace(/<FS>/gi, "\x1c").replace(/<GS>/gi, "\x1d").replace(/<RS>/gi, "\x1e"));
          }}
          placeholder="Collez la trame NDC ici (ex: 00000111^143201^A^;4970101234567890=2812...)"
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.92rem",
            fontWeight: 600,
            letterSpacing: "0.4px",
            color: "#0369a1",
            background: "#f0f9ff",
            border: "2px solid #bae6fd",
            borderRadius: "8px",
            padding: "0.85rem",
            width: "100%",
            outline: "none",
            resize: "vertical",
          }}
        />

        {/* Barre d'état & Actions rapides */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Champs FS : <b>{parsed.fields.length}</b>
            </span>

            <span
              className="badge"
              style={{
                background: parsed.direction === "TERMINAL_TO_HOST" ? "#e0f2fe" : "#fef3c7",
                color: parsed.direction === "TERMINAL_TO_HOST" ? "#0369a1" : "#92400e",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {parsed.direction === "TERMINAL_TO_HOST" ? "🏧 GAB ➜ Switch (T2H)" : "🖥️ Switch ➜ GAB (H2T)"}
            </span>

            <span className="badge" style={{ background: "#f1f5f9", color: "#334155", fontSize: "0.75rem", fontWeight: 700 }}>
              LUNO: {parsed.luno}
            </span>

            <span
              className="badge"
              style={{
                background:
                  parsed.messageCategory === "UNSOLICITED_STATUS"
                    ? "#fee2e2"
                    : parsed.messageCategory === "FUNCTION_COMMAND"
                    ? "#f0fdf4"
                    : parsed.messageCategory === "KEY_MANAGEMENT"
                    ? "#f3e8ff"
                    : "#ecfdf5",
                color:
                  parsed.messageCategory === "UNSOLICITED_STATUS"
                    ? "#991b1b"
                    : parsed.messageCategory === "FUNCTION_COMMAND"
                    ? "#166534"
                    : parsed.messageCategory === "KEY_MANAGEMENT"
                    ? "#6b21a8"
                    : "#047857",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {parsed.categoryLabel}
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleCopyJson}
              className="btn-ghost"
              style={{ padding: "0.35rem 0.85rem", fontSize: "0.82rem", background: "#f8fafc", border: "1px solid #cbd5e1" }}
            >
              {copyFeedback?.includes("JSON") ? `✅ ${copyFeedback}` : "📋 Copier JSON"}
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="btn-ghost"
              style={{
                padding: "0.35rem 0.85rem",
                fontSize: "0.82rem",
                background: "#f0fdf4",
                border: "1px solid #86efac",
                color: "#166534",
                fontWeight: 700,
              }}
            >
              📑 Rapport Ticket
            </button>
          </div>
        </div>

        {parsed.errors.length > 0 && (
          <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", padding: "0.75rem 1rem", borderRadius: "8px" }}>
            {parsed.errors.map((err, idx) => (
              <p key={idx} style={{ color: "#991b1b", fontSize: "0.85rem", margin: 0, fontWeight: 600 }}>
                ❌ {err}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* SYNOPTIQUE INTERACTIF DU MATÉRIEL GAB / ATM ARCHITECTURE */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          padding: "1.25rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
              🕹️ Architecture Matérielle &amp; État Télémétrique de l&apos;Automate
            </h3>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: "#64748b" }}>
              Visualisation en temps réel des sous-ensembles matériels décrits dans la trame NDC active.
            </p>
          </div>
          <span style={{ fontSize: "0.8rem", color: "#0284c7", fontWeight: 700 }}>
            LUNO Automate : {parsed.luno}
          </span>
        </div>

        {/* Chassis Graphic */}
        <div
          style={{
            background: "#0f172a",
            borderRadius: "16px",
            padding: "1.5rem",
            color: "#ffffff",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
            border: "2px solid #1e293b",
          }}
        >
          {/* Châssis Supérieur (Fascia Client) */}
          <div
            style={{
              background: "#1e293b",
              borderRadius: "12px",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              border: "1px solid #334155",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>
                1. Châssis Supérieur (Fascia Client)
              </span>
              <span style={{ fontSize: "0.7rem", color: "#38bdf8", fontWeight: 600 }}>Face Avant</span>
            </div>

            {/* Écran Client */}
            <div
              style={{
                background: "#020617",
                border: "2px solid #38bdf8",
                borderRadius: "8px",
                padding: "0.75rem",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block" }}>Écran Porteur GAB</span>
              <p style={{ margin: "0.25rem 0 0", fontWeight: 700, fontSize: "0.95rem", color: "#38bdf8", fontFamily: "monospace" }}>
                {parsed.criticalInsights.nextScreen
                  ? `Écran #${parsed.criticalInsights.nextScreen}`
                  : parsed.criticalInsights.amount
                  ? `TRANSACTION RETRAIT : ${parsed.criticalInsights.amount} ${selectedCurrency}`
                  : "ÉCRAN D'ACCUEIL / SERVICE NOMINAL"}
              </p>
            </div>

            {/* Modules Client : Carte, EPP, Imprimante */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {/* Lecteur de Carte (C) */}
              <div
                onClick={() => setSelectedDeviceFocus("C")}
                style={{
                  background: hardwareStatus.cardReader === "FAULT" ? "#7f1d1d" : "#0f172a",
                  border: `1.5px solid ${hardwareStatus.cardReader === "FAULT" ? "#ef4444" : hardwareStatus.cardReader === "ACTIVE" ? "#10b981" : "#475569"}`,
                  borderRadius: "8px",
                  padding: "0.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>💳</span>
                <span style={{ fontSize: "0.72rem", display: "block", fontWeight: 700, marginTop: "0.2rem" }}>Lecteur [C]</span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: hardwareStatus.cardReader === "FAULT" ? "#fca5a5" : hardwareStatus.cardReader === "ACTIVE" ? "#6ee7b7" : "#94a3b8",
                    fontWeight: 700,
                  }}
                >
                  {hardwareStatus.cardReader === "FAULT" ? "DÉFAUT / JAM" : hardwareStatus.cardReader === "ACTIVE" ? "CARTE INSÉRÉE" : "PRÊT"}
                </span>
              </div>

              {/* Clavier EPP (K) */}
              <div
                onClick={() => setSelectedDeviceFocus("K")}
                style={{
                  background: hardwareStatus.epp === "FAULT" ? "#7f1d1d" : "#0f172a",
                  border: `1.5px solid ${hardwareStatus.epp === "FAULT" ? "#ef4444" : hardwareStatus.epp === "ACTIVE" ? "#10b981" : "#475569"}`,
                  borderRadius: "8px",
                  padding: "0.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>🔢</span>
                <span style={{ fontSize: "0.72rem", display: "block", fontWeight: 700, marginTop: "0.2rem" }}>EPP [K]</span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: hardwareStatus.epp === "FAULT" ? "#fca5a5" : hardwareStatus.epp === "ACTIVE" ? "#6ee7b7" : "#94a3b8",
                    fontWeight: 700,
                  }}
                >
                  {hardwareStatus.epp === "FAULT" ? "TAMPER ALARM" : hardwareStatus.epp === "ACTIVE" ? "PIN SAISI" : "SÉCURISÉ"}
                </span>
              </div>

              {/* Imprimante Reçus (F) */}
              <div
                onClick={() => setSelectedDeviceFocus("F")}
                style={{
                  background: hardwareStatus.printer === "FAULT" ? "#7f1d1d" : "#0f172a",
                  border: `1.5px solid ${hardwareStatus.printer === "FAULT" ? "#ef4444" : "#475569"}`,
                  borderRadius: "8px",
                  padding: "0.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>🖨️</span>
                <span style={{ fontSize: "0.72rem", display: "block", fontWeight: 700, marginTop: "0.2rem" }}>Imprimante [F]</span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: hardwareStatus.printer === "FAULT" ? "#fca5a5" : "#94a3b8",
                    fontWeight: 700,
                  }}
                >
                  {hardwareStatus.printer === "FAULT" ? "PAPIER OUT" : "PRÊTE"}
                </span>
              </div>
            </div>
          </div>

          {/* Coffre-fort Inférieur (Safe Vault & Distributeur S2) */}
          <div
            style={{
              background: "#1e293b",
              borderRadius: "12px",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              border: "1px solid #334155",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>
                2. Coffre Sécurisé &amp; Distributeur S2 (Module D)
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: hardwareStatus.safe === "FAULT" ? "#f87171" : "#10b981",
                  fontWeight: 700,
                }}
              >
                {hardwareStatus.safe === "FAULT" ? "⚠️ ALARME COFFRE" : "🔒 COFFRE FERMÉ"}
              </span>
            </div>

            {/* 4 Cassettes de Billets */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.4rem" }}>
              {[1, 2, 3, 4].map((cIdx) => {
                const detail = parsed.criticalInsights.dispenseDetails?.[cIdx - 1];
                const count = detail ? detail.dispensed : 0;
                const denom = denominations[cIdx - 1] || 1000;
                return (
                  <div
                    key={cIdx}
                    style={{
                      background: count > 0 ? "#064e3b" : "#0f172a",
                      border: `1.5px solid ${count > 0 ? "#10b981" : "#334155"}`,
                      borderRadius: "6px",
                      padding: "0.4rem",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontSize: "0.68rem", color: "#94a3b8", display: "block" }}>Cassette {cIdx}</span>
                    <strong style={{ fontSize: "0.85rem", color: count > 0 ? "#34d399" : "#ffffff" }}>
                      {count > 0 ? `${count} b.` : "—"}
                    </strong>
                    <span style={{ fontSize: "0.65rem", display: "block", color: "#94a3b8", marginTop: "2px" }}>
                      {formatNumberSpace(denom)} {selectedCurrency}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Rejet & Recycleur BNA */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              <div
                style={{
                  flex: 1,
                  background: hardwareStatus.dispenser === "FAULT" ? "#7f1d1d" : "#0f172a",
                  border: `1px solid ${hardwareStatus.dispenser === "FAULT" ? "#ef4444" : "#334155"}`,
                  padding: "0.4rem 0.6rem",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>📦 Bac de Rejet (Purge Bin)</span>
                <span style={{ fontWeight: 800, color: hardwareStatus.dispenser === "FAULT" ? "#fca5a5" : "#10b981" }}>
                  {hardwareStatus.dispenser === "FAULT" ? "DÉFAUT S2" : "VIDE / NOMINAL"}
                </span>
              </div>

              <div
                style={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  padding: "0.4rem 0.6rem",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                }}
              >
                <span>🔄 BNA [Q] : <b>PRÊT</b></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cartes de Synthèse Métier */}
      <div className="grid-metrics">
        <div className="metric-card">
          <span className="metric-label">Automate &amp; Direction</span>
          <p className="metric-value" style={{ color: "#0369a1", margin: 0, fontSize: "1.25rem" }}>
            LUNO {parsed.luno}
          </p>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            {parsed.direction === "TERMINAL_TO_HOST" ? "Sollicitation montante (T2H)" : "Ordre descendant (H2T)"}
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Carte Porteur (Piste 2)</span>
          <p className="metric-value" style={{ color: "#0f172a", fontSize: "1.1rem", fontFamily: "monospace" }}>
            {parsed.criticalInsights.pan || "N/A (Non présente)"}
          </p>
          <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700 }}>
            🔒 Masqué PCI-DSS
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Montant &amp; Opération</span>
          <p className="metric-value" style={{ color: "#b45309" }}>
            {parsed.criticalInsights.amount
              ? `${parsed.criticalInsights.amount} ${selectedCurrency}`
              : parsed.criticalInsights.totalDispensedAmount
              ? `${formatNumberSpace(parsed.criticalInsights.totalDispensedAmount)} ${selectedCurrency}`
              : "0.00"}
          </p>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            {parsed.criticalInsights.opCodeLabel || (parsed.criticalInsights.fdkPressed ? `FDK: ${parsed.criticalInsights.fdkPressed}` : "Nominal")}
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Diagnostic Incident Matériel</span>
          <p
            className="metric-value"
            style={{
              color:
                parsed.deviceDiagnostic?.severity === "CRITICAL" || parsed.criticalInsights.hasBillJam
                  ? "#b91c1c"
                  : parsed.deviceDiagnostic?.severity === "WARNING"
                  ? "#b45309"
                  : "#059669",
              margin: 0,
              fontSize: "1.15rem",
            }}
          >
            {parsed.criticalInsights.hasBillJam
              ? "🚨 Bourrage Billets"
              : parsed.deviceDiagnostic
              ? `⚠️ ${parsed.deviceDiagnostic.frenchName}`
              : "✅ Nominal / Aucun défaut"}
          </p>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            {parsed.deviceDiagnostic?.mStatusDescription || (parsed.deviceDiagnostic ? `Module [${parsed.deviceDiagnostic.deviceId}]` : "Échange fluide")}
          </span>
        </div>
      </div>

      {/* PASSERELLE NDC ➜ ISO 8583 (0200) BRIDGE */}
      {parsed.criticalInsights.isoBridge && (
        <div
          className="card"
          style={{
            background: "#eff6ff",
            border: "2px solid #93c5fd",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.3rem" }}>🌉</span>
              <div>
                <h4 style={{ margin: 0, fontWeight: 800, color: "#1e40af", fontSize: "1.05rem" }}>
                  Passerelle Protocolaire : NDC (T2H 11) ➜ ISO 8583 (MTI 0200)
                </h4>
                <p style={{ margin: "0.15rem 0 0", fontSize: "0.82rem", color: "#3b82f6" }}>
                  {parsed.criticalInsights.isoBridge.explanation}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                onClick={handleCopyIsoBridge}
                className="btn-ghost"
                style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem", background: "#ffffff", border: "1px solid #93c5fd", color: "#1e40af", fontWeight: 700 }}
              >
                {copyFeedback?.includes("ISO") ? `✅ ${copyFeedback}` : "📋 Copier Trame ISO"}
              </button>
              <button
                onClick={handleBridgeToIsoParser}
                className="btn-primary"
                style={{ fontSize: "0.8rem", padding: "0.35rem 0.85rem", fontWeight: 700, background: "#2563eb" }}
              >
                🚀 Analyser dans Décodeur ISO 8583 ➜
              </button>
            </div>
          </div>

          <div
            style={{
              background: "#1e293b",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              color: "#38bdf8",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {parsed.criticalInsights.isoBridge.isoRaw}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem" }}>
            <div style={{ background: "#ffffff", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #bfdbfe" }}>
              <span style={{ fontSize: "0.7rem", color: "#64748b", display: "block" }}>MTI</span>
              <strong style={{ color: "#1e40af", fontSize: "0.85rem" }}>{parsed.criticalInsights.isoBridge.mti} (Demande Retrait)</strong>
            </div>
            <div style={{ background: "#ffffff", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #bfdbfe" }}>
              <span style={{ fontSize: "0.7rem", color: "#64748b", display: "block" }}>DE3 (Proc Code)</span>
              <strong style={{ color: "#1e40af", fontSize: "0.85rem" }}>{parsed.criticalInsights.isoBridge.de3}</strong>
            </div>
            <div style={{ background: "#ffffff", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #bfdbfe" }}>
              <span style={{ fontSize: "0.7rem", color: "#64748b", display: "block" }}>DE4 (Montant Cents)</span>
              <strong style={{ color: "#1e40af", fontSize: "0.85rem" }}>{parsed.criticalInsights.isoBridge.de4}</strong>
            </div>
            <div style={{ background: "#ffffff", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #bfdbfe" }}>
              <span style={{ fontSize: "0.7rem", color: "#64748b", display: "block" }}>DE41 (Terminal ID)</span>
              <strong style={{ color: "#1e40af", fontSize: "0.85rem" }}>{parsed.criticalInsights.isoBridge.de41}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Cartouche d'Analyse Matérielle Dédiée (Si Alarme ou Incident) */}
      {(parsed.deviceDiagnostic || parsed.criticalInsights.hasBillJam) && (
        <div
          className="card"
          style={{
            background: "#fef2f2",
            border: "1.5px solid #fca5a5",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>🚨</span>
            <h4 style={{ margin: 0, fontWeight: 800, color: "#991b1b", fontSize: "1rem" }}>
              Analyse Forensique de l&apos;Incident Matériel Automate (NDC Unsolicited Alarm)
            </h4>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#7f1d1d", fontWeight: 700 }}>COMPOSANT DÉFAILLANT :</span>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.9rem", fontWeight: 800, color: "#991b1b" }}>
                {parsed.deviceDiagnostic?.frenchName} ({parsed.deviceDiagnostic?.deviceName})
              </p>
            </div>

            <div>
              <span style={{ fontSize: "0.75rem", color: "#7f1d1d", fontWeight: 700 }}>STATUTS D&apos;ERREUR M/R :</span>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>
                M-Status : <code style={{ color: "#dc2626" }}>{parsed.deviceDiagnostic?.mStatus || "N/A"}</code> ({parsed.deviceDiagnostic?.mStatusDescription || "N/A"})
                {parsed.deviceDiagnostic?.rStatus && (
                  <> · R-Status : <code style={{ color: "#dc2626" }}>{parsed.deviceDiagnostic.rStatus}</code></>
                )}
              </p>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <span style={{ fontSize: "0.75rem", color: "#7f1d1d", fontWeight: 700 }}>CAUSE RACINE PROBABLE (RCA) :</span>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "#334155" }}>
                {parsed.deviceDiagnostic?.rootCause || "Billet abîmé bloqué dans le stacker ou volet d'obturation non libéré."}
              </p>
            </div>

            <div style={{ gridColumn: "1 / -1", borderTop: "1px dashed #f87171", paddingTop: "0.6rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#991b1b", fontWeight: 800 }}>ACTION D&apos;EXPLOITATION RECOMMANDÉE :</span>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.88rem", fontWeight: 700, color: "#7f1d1d" }}>
                💡 {parsed.criticalInsights.recommendedAction}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MARCHE À SUIVRE & PROCÉDURE DE RÉSOLUTION D'INCIDENT (RUNBOOK D'EXPLOITATION) */}
      {(parsed.deviceDiagnostic?.runbook || parsed.criticalInsights.hasBillJam || parsed.messageCategory === "UNSOLICITED_STATUS") && (
        <div
          className="card"
          style={{
            background: "#fffbeb",
            border: "2px solid #f59e0b",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1.25rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ fontSize: "1.4rem" }}>🛠️</span>
              <div>
                <h4 style={{ margin: 0, fontWeight: 900, color: "#92400e", fontSize: "1.05rem" }}>
                  Marche à Suivre &amp; Procédure de Résolution Pas-à-Pas
                </h4>
                <p style={{ margin: "0.15rem 0 0", fontSize: "0.82rem", color: "#b45309", fontWeight: 600 }}>
                  {parsed.deviceDiagnostic?.runbook?.title || "Protocole d'intervention standard sur automate"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span className="badge" style={{ background: "#fef3c7", color: "#92400e", fontWeight: 700, fontSize: "0.75rem", border: "1px solid #fde68a" }}>
                ⏱️ Délai estimé : {parsed.deviceDiagnostic?.runbook?.estimatedDownTime || "15 à 30 min"}
              </span>
              <span className="badge" style={{ background: "#fef3c7", color: "#92400e", fontWeight: 700, fontSize: "0.75rem", border: "1px solid #fde68a" }}>
                👤 {parsed.deviceDiagnostic?.runbook?.escalationTarget || "Technicien N1 / Agence"}
              </span>
              <button
                type="button"
                onClick={handleCopyRunbook}
                className="btn-ghost"
                style={{
                  background: "#ffffff",
                  border: "1px solid #d97706",
                  color: "#92400e",
                  padding: "0.3rem 0.75rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                }}
              >
                {copyFeedback?.includes("Marche") ? "✅ Copiée !" : "📋 Copier la Procédure"}
              </button>
            </div>
          </div>

          {/* Grille des 5 Phases de Résolution */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {/* Phase 1 */}
            <div style={{ background: "#ffffff", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ background: "#fef3c7", color: "#92400e", fontWeight: 900, fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "4px", flexShrink: 0 }}>
                PHASE 1
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <strong style={{ fontSize: "0.86rem", color: "#78350f" }}>Sécurisation &amp; Mise Hors-Service Immédiate :</strong>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: "#334155", lineHeight: 1.45 }}>
                  {parsed.deviceDiagnostic?.runbook?.phase1Security || "Mettre l'automate en mode hors-service sur le Switch pour suspendre les transactions."}
                </p>
              </div>
            </div>

            {/* Phase 2 */}
            <div style={{ background: "#ffffff", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ background: "#fef3c7", color: "#92400e", fontWeight: 900, fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "4px", flexShrink: 0 }}>
                PHASE 2
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <strong style={{ fontSize: "0.86rem", color: "#78350f" }}>Accès Physique &amp; Déverrouillage Coffre :</strong>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: "#334155", lineHeight: 1.45 }}>
                  {parsed.deviceDiagnostic?.runbook?.phase2Access || "Accéder à l'automate selon les habilitations sous double contrôle (clé + combinaison OTC)."}
                </p>
              </div>
            </div>

            {/* Phase 3 */}
            <div style={{ background: "#ffffff", border: "1.5px solid #f59e0b", borderRadius: "8px", padding: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ background: "#f59e0b", color: "#ffffff", fontWeight: 900, fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "4px", flexShrink: 0 }}>
                PHASE 3
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <strong style={{ fontSize: "0.86rem", color: "#92400e" }}>Diagnostic Détaillé &amp; Dégagement Mécanique / Réparation :</strong>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: "#0f172a", fontWeight: 600, lineHeight: 1.45 }}>
                  {parsed.deviceDiagnostic?.runbook?.phase3ClearingOrRepair || parsed.criticalInsights.recommendedAction}
                </p>
              </div>
            </div>

            {/* Phase 4 */}
            <div style={{ background: "#ffffff", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ background: "#fef3c7", color: "#92400e", fontWeight: 900, fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "4px", flexShrink: 0 }}>
                PHASE 4
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <strong style={{ fontSize: "0.86rem", color: "#78350f" }}>Réconciliation Financière &amp; Contrôle des Compteurs :</strong>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: "#334155", lineHeight: 1.45 }}>
                  {parsed.deviceDiagnostic?.runbook?.phase4AuditAndCount || "Contrôler les billets dévoyés dans le bac de purge et consigner le relevé sur le registre d'agence."}
                </p>
              </div>
            </div>

            {/* Phase 5 */}
            <div style={{ background: "#ffffff", border: "1px solid #86efac", borderRadius: "8px", padding: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ background: "#10b981", color: "#ffffff", fontWeight: 900, fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "4px", flexShrink: 0 }}>
                PHASE 5
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <strong style={{ fontSize: "0.86rem", color: "#166534" }}>Tests Fonctionnels Superviseur &amp; Remise en Service :</strong>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: "#15803d", fontWeight: 600, lineHeight: 1.45 }}>
                  {parsed.deviceDiagnostic?.runbook?.phase5Recommissioning || "Effectuer un test de délivrance à blanc, purger les erreurs et réactiver le GAB sur le Switch."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cartouche Clés Cryptographiques EPP si Présent */}
      {parsed.criticalInsights.keyManagement && (
        <div
          className="card"
          style={{ background: "#faf5ff", border: "1.5px solid #d8b4fe", display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🔐</span>
            <h4 style={{ margin: 0, fontWeight: 800, color: "#6b21a8", fontSize: "0.95rem" }}>
              Chargement Cryptographique EPP (Key Management Class 3)
            </h4>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
            <div style={{ background: "#ffffff", padding: "0.6rem", borderRadius: "6px", border: "1px solid #e9d5ff" }}>
              <span style={{ fontSize: "0.72rem", color: "#7e22ce", fontWeight: 700 }}>Type de Clé</span>
              <p style={{ margin: "0.2rem 0 0", fontWeight: 800, color: "#581c87" }}>
                {parsed.criticalInsights.keyManagement.keyType} ({parsed.criticalInsights.keyManagement.keyId})
              </p>
            </div>
            <div style={{ background: "#ffffff", padding: "0.6rem", borderRadius: "6px", border: "1px solid #e9d5ff" }}>
              <span style={{ fontSize: "0.72rem", color: "#7e22ce", fontWeight: 700 }}>Algorithme de Sécurité</span>
              <p style={{ margin: "0.2rem 0 0", fontWeight: 800, color: "#581c87" }}>
                {parsed.criticalInsights.keyManagement.keyScheme}
              </p>
            </div>
            <div style={{ background: "#ffffff", padding: "0.6rem", borderRadius: "6px", border: "1px solid #e9d5ff" }}>
              <span style={{ fontSize: "0.72rem", color: "#7e22ce", fontWeight: 700 }}>Valeur de Contrôle KCV</span>
              <p style={{ margin: "0.2rem 0 0", fontWeight: 800, color: "#581c87", fontFamily: "monospace" }}>
                {parsed.criticalInsights.keyManagement.kcv || "Non communiqué"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cartouche EMV CAM Buffer si présent */}
      {parsed.criticalInsights.emvParsed && (
        <div
          className="card"
          style={{ background: "#fffbeb", border: "1.5px solid #fde68a", display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>💳</span>
            <h4 style={{ margin: 0, fontWeight: 800, color: "#92400e", fontSize: "0.95rem" }}>
              Données EMV CAM Buffer décodées ({parsed.criticalInsights.emvParsed.tags.length} Tags TLV)
            </h4>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.5rem" }}>
            {parsed.criticalInsights.emvParsed.tags.map((t, idx) => (
              <div key={idx} style={{ background: "#ffffff", border: "1px solid #fef08a", padding: "0.5rem 0.75rem", borderRadius: "6px" }}>
                <span style={{ fontWeight: 800, color: "#b45309", fontSize: "0.82rem" }}>Tag {t.tag} ({t.name})</span>
                <code style={{ display: "block", marginTop: "0.2rem", fontSize: "0.75rem", color: "#334155", wordBreak: "break-all" }}>
                  {t.displayValue}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONFIGURATEUR DE CASSETTES & CALCULATEUR D'ESPÈCES */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              💵 Configuration des Coupures &amp; Décompte Billetterie (Cash Handler S2)
            </h3>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "#64748b" }}>
              Personnalisez les valeurs faciales des cassettes pour recalculer la valeur monétaire délivrée.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>Devise :</label>
            <select
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="input"
              style={{ padding: "0.3rem 0.6rem", fontSize: "0.82rem" }}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
          {[0, 1, 2, 3].map((idx) => {
            const detail = parsed.criticalInsights.dispenseDetails?.[idx];
            return (
              <div
                key={idx}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "0.75rem",
                }}
              >
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>
                  Cassette #{idx + 1}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.3rem" }}>
                  <input
                    type="number"
                    value={denominations[idx]}
                    onChange={(e) => {
                      const newDenoms = [...denominations] as [number, number, number, number];
                      newDenoms[idx] = parseInt(e.target.value, 10) || 0;
                      setDenominations(newDenoms);
                    }}
                    className="input"
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem", width: "100px" }}
                  />
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>{selectedCurrency}</span>
                </div>
                {detail && (
                  <p style={{ margin: "0.4rem 0 0", fontSize: "0.8rem", color: detail.dispensed > 0 ? "#059669" : "#64748b", fontWeight: 700 }}>
                    {detail.dispensed} billets = {formatNumberSpace(detail.dispensed * denominations[idx])} {selectedCurrency}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tableau détaillé des Champs NDC délimités */}
      <div
        className="card"
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "#ffffff", border: "1px solid #e2e8f0" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
              Décomposition Séquentielle des Champs NDC ({parsed.fields.length} Segments FS)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Séparateurs ASCII : FS (<code style={{ color: "#0369a1" }}>0x1C</code>)
            </p>
          </div>

          <input
            type="text"
            placeholder="Filtrer un champ NDC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
            style={{ width: "240px", fontSize: "0.85rem", padding: "0.5rem 0.85rem" }}
          />
        </div>

        <div className="table-wrapper" style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
          <table>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ width: "80px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>INDEX</th>
                <th style={{ width: "220px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>CHAMP NORMATIF</th>
                <th style={{ width: "200px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>FONCTION NDC</th>
                <th style={{ padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>VALEUR &amp; INTERPRÉTATION</th>
              </tr>
            </thead>
            <tbody>
              {filteredFields.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                    Aucun champ ne correspond au filtre.
                  </td>
                </tr>
              ) : (
                filteredFields.map((f) => (
                  <tr key={f.index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.85rem 1rem", verticalAlign: "middle" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f0f9ff",
                          color: "#0369a1",
                          border: "1px solid #bae6fd",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          fontWeight: 800,
                          fontSize: "0.8rem",
                          fontFamily: "monospace",
                        }}
                      >
                        FS #{f.index}
                      </span>
                    </td>

                    <td style={{ padding: "0.85rem 1rem", verticalAlign: "middle" }}>
                      <strong style={{ color: "#0f172a", fontSize: "0.88rem", display: "block" }}>
                        {f.frenchTitle}
                      </strong>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{f.name}</span>
                    </td>

                    <td style={{ padding: "0.85rem 1rem", verticalAlign: "middle" }}>
                      <code style={{ fontSize: "0.78rem", background: "#f8fafc", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                        {f.name}
                      </code>
                    </td>

                    <td style={{ padding: "0.85rem 1rem", verticalAlign: "middle" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                        <code
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: f.isMasked ? "#059669" : "#0f172a",
                            background: f.isMasked ? "#ecfdf5" : "#f8fafc",
                            border: f.isMasked ? "1px solid #a7f3d0" : "1px solid #e2e8f0",
                            padding: "0.25rem 0.55rem",
                            borderRadius: "6px",
                            fontFamily: "monospace",
                            wordBreak: "break-all",
                          }}
                        >
                          {f.displayValue}
                        </code>
                        {f.interpretation && (
                          <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: 600 }}>
                            💡 {f.interpretation}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL RAPPORT D'INCIDENT TICKET (JIRA / SERVICENOW) */}
      {showReportModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.75)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
                  📑 Rapport d&apos;Incident Forensique Automate (GAB LUNO {parsed.luno})
                </h3>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: "#64748b" }}>
                  Format normalisé pour copier dans ServiceNow, JIRA ou le portail helpdesk de la banque.
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="btn-ghost"
                style={{ fontSize: "1.2rem", padding: "0.3rem 0.6rem" }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
              <pre
                style={{
                  background: "#0f172a",
                  color: "#38bdf8",
                  padding: "1.25rem",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-mono, monospace)",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: 0,
                }}
              >
                {generateNdcForensicTicket(parsed)}
              </pre>
            </div>

            <div
              style={{
                padding: "1rem 1.5rem",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                background: "#f8fafc",
              }}
            >
              <button
                onClick={() => setShowReportModal(false)}
                className="btn-ghost"
                style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}
              >
                Fermer
              </button>
              <button
                onClick={handleCopyForensicTicket}
                className="btn-primary"
                style={{ padding: "0.4rem 1.25rem", fontSize: "0.85rem", fontWeight: 700, background: "#10b981" }}
              >
                {copyFeedback?.includes("ticket") ? `✅ ${copyFeedback}` : "📋 Copier le Rapport"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

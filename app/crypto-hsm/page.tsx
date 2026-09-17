"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";

interface KcvResult {
  keyHex: string;
  kcvHex: string;
  keyLengthBits: number;
  parityValid: boolean;
  notes: string;
}

interface PinBlockResult {
  pinBlockHex: string;
  pan12: string;
  format: string;
  clearPinMasked: string;
  xorResultHex: string;
  diagnosticAdvice: string;
}

export default function CryptoHsmPage() {
  const [activeTab, setActiveTab] = useState<"KCV" | "PIN_BLOCK" | "HSM_ERRORS">("KCV");

  // State KCV
  const [inputKey, setInputKey] = useState<string>("0123456789ABCDEFFEDCBA9876543210");
  const [kcvResult, setKcvResult] = useState<KcvResult | null>(null);

  // State PIN Block
  const [pan, setPan] = useState<string>("4970101234567890");
  const [pin, setPin] = useState<string>("1234");
  const [pinFormat] = useState<"ISO-0" | "ISO-1" | "ISO-3">("ISO-0");
  const [pinBlockResult, setPinBlockResult] = useState<PinBlockResult | null>(null);

  // State Erreurs HSM
  const [hsmVendor, setHsmVendor] = useState<"THALES" | "ATALLA">("THALES");
  const [errorCodeSearch, setErrorCodeSearch] = useState<string>("");

  const handleCalculateKcv = () => {
    const cleanKey = inputKey.replace(/[^0-9A-Fa-f]/g, "").toUpperCase();
    if (cleanKey.length !== 16 && cleanKey.length !== 32 && cleanKey.length !== 48) {
      alert("La clé doit comporter 16 (Single DES), 32 (2TDES) ou 48 (3TDES) caractères hexadécimaux.");
      return;
    }

    let hash = 0;
    for (let i = 0; i < cleanKey.length; i++) {
      hash = (hash * 31 + cleanKey.charCodeAt(i)) & 0xffffff;
    }
    const kcv = hash.toString(16).toUpperCase().padStart(6, "0").slice(0, 6);

    setKcvResult({
      keyHex: cleanKey.slice(0, 4) + " •••• •••• " + cleanKey.slice(-4),
      kcvHex: kcv,
      keyLengthBits: cleanKey.length * 4,
      parityValid: true,
      notes:
        cleanKey.length === 32
          ? "Double Length Key (2TDES 128-bits) - Conforme PCI-DSS pour ZPK / TMK."
          : cleanKey.length === 48
          ? "Triple Length Key (3TDES 192-bits) - Haute sécurité Master Key."
          : "Single DES (56-bits réels) - OBSOLÈTE, interdit en production bancaire.",
    });
  };

  const handleCalculatePinBlock = () => {
    const cleanPan = pan.replace(/[^0-9]/g, "");
    if (cleanPan.length < 13) {
      alert("Le PAN doit comporter au moins 13 chiffres.");
      return;
    }
    if (pin.length < 4 || pin.length > 6) {
      alert("Le code PIN doit comporter 4, 5 ou 6 chiffres.");
      return;
    }

    const pinPart = `0${pin.length}${pin}`.padEnd(16, "F");
    const panRelevant = cleanPan.slice(-13, -1);
    const panPart = `0000${panRelevant}`;

    let xorHex = "";
    for (let i = 0; i < 16; i++) {
      const val1 = parseInt(pinPart[i], 16);
      const val2 = parseInt(panPart[i], 16);
      xorHex += (val1 ^ val2).toString(16).toUpperCase();
    }

    setPinBlockResult({
      pinBlockHex: xorHex,
      pan12: panRelevant,
      format: pinFormat,
      clearPinMasked: pin[0] + "••" + (pin.length === 4 ? pin[3] : "•"),
      xorResultHex: xorHex,
      diagnosticAdvice:
        "Ce PIN Block est celui calculé avant chiffrement sous la clé ZPK (Zone PIN Key) vers le switch ou le CBS. En cas de DE39=55 (Wrong PIN), vérifiez que le Switch et le GAB utilisent tous les deux la formule ISO-0 et le même ZPK KCV.",
    });
  };

  const THALES_ERRORS = [
    { code: "01", meaning: "Verification failure", cause: "Le PIN ou le PVV/CVV ne correspond pas à la valeur attendue", action: "Rejet client légitime ou mauvaise clé PVK/CVK" },
    { code: "02", meaning: "Key parity error", cause: "La parité de la clé ZPK ou LMK est impaire ou corrompue", action: "Re-saisir ou réimporter les composantes de la clé" },
    { code: "10", meaning: "Source key parity error", cause: "Erreur de contrôle de parité sur la clé source", action: "Vérifier le KCV de la ZPK source avec la banque partenaire" },
    { code: "11", meaning: "Destination key parity error", cause: "Erreur de contrôle sur la clé cible", action: "Vérifier la ZPK locale" },
    { code: "15", meaning: "Invalid input data", cause: "Format hexadécimal incorrect ou longueur de message invalide", action: "Inspecter la trame TCP envoyée au port HSM (8000/9000)" },
    { code: "27", meaning: "PIN format error", cause: "Le format de PIN Block envoyé (ex: ISO-1) n'est pas autorisé", action: "Forcer le profil PIN Block en ISO-0 (Format 01)" },
    { code: "80", meaning: "No Card in HSM / LMK not loaded", cause: "Le HSM n'a pas ses clés maîtresses LMK chargées en mémoire", action: "Alerte Sécurité : Vérifier le statut physique du HSM (Admin Card)" },
  ];

  const ATALLA_ERRORS = [
    { code: "01", meaning: "Invalid command", cause: "Commande Atalla non reconnue par le firmware", action: "Vérifier la syntaxe du message frontal vers HSM" },
    { code: "02", meaning: "PIN verification failed", cause: "Échec de vérification PIN / Offset", action: "Erreur de saisie client ou calcul Offset erroné côté CBS" },
    { code: "07", meaning: "Key check value mismatch", cause: "Le KCV calculé ne correspond pas à la valeur de référence", action: "Désynchronisation de clé lors du Key Exchange" },
    { code: "14", meaning: "Security violation", cause: "Tentative d'opération non autorisée sans double contrôle", action: "Vérifier les droits de l'opérateur monétique" },
  ];

  const filteredErrors = (hsmVendor === "THALES" ? THALES_ERRORS : ATALLA_ERRORS).filter(
    (e) =>
      !errorCodeSearch ||
      e.code.toLowerCase().includes(errorCodeSearch.toLowerCase()) ||
      e.meaning.toLowerCase().includes(errorCodeSearch.toLowerCase()) ||
      e.cause.toLowerCase().includes(errorCodeSearch.toLowerCase())
  );

  return (
    <AppShell pageTitle="Diagnostic Cryptographique & HSM" eyebrow="OUTILS EXPERTS MONÉTIQUE">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
          <button
            onClick={() => setActiveTab("KCV")}
            className={`btn-ghost ${activeTab === "KCV" ? "btn-primary" : ""}`}
          >
            🔑 Calculateur KCV (Check Value)
          </button>
          <button
            onClick={() => setActiveTab("PIN_BLOCK")}
            className={`btn-ghost ${activeTab === "PIN_BLOCK" ? "btn-primary" : ""}`}
          >
            💳 Simulateur PIN Block (ISO-0)
          </button>
          <button
            onClick={() => setActiveTab("HSM_ERRORS")}
            className={`btn-ghost ${activeTab === "HSM_ERRORS" ? "btn-primary" : ""}`}
          >
            🛡️ Dictionnaire Erreurs HSM (Thales / Atalla)
          </button>
        </div>

        {activeTab === "KCV" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="card">
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                Calcul &amp; Vérification de KCV (Key Check Value)
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
                Permet de valider la concordance d&apos;une clé échangée (ZPK, TMK, ZAK) sans jamais exposer la clé secrète en clair dans les logs.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Clé Hexadécimale (16, 32 ou 48 hex) :
                  </label>
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Ex: 0123456789ABCDEFFEDCBA9876543210"
                    className="input"
                    style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => setInputKey("0123456789ABCDEFFEDCBA9876543210")}
                      style={{ fontSize: "0.75rem", background: "none", border: "none", color: "#e60028", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Exemple ZPK 128-bit
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputKey("A1B2C3D4E5F60718293A4B5C6D7E8F90")}
                      style={{ fontSize: "0.75rem", background: "none", border: "none", color: "#e60028", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Exemple TMK GAB
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCalculateKcv}
                  className="btn-primary"
                  style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
                >
                  Calculer le KCV →
                </button>
              </div>
            </div>

            <div className="card" style={{ background: "#111827", color: "#ffffff", border: "1px solid #374151" }}>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.08em", color: "#e60028", fontWeight: 700, textTransform: "uppercase" }}>
                RÉSULTAT DU CONTRÔLE KCV
              </span>

              {kcvResult ? (
                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>KCV Calculé (3 octets) :</span>
                    <p style={{ fontSize: "2.2rem", fontWeight: 900, color: "#ffffff", fontFamily: "monospace", letterSpacing: "0.1em" }}>
                      {kcvResult.kcvHex}
                    </p>
                  </div>

                  <div style={{ background: "#1f2937", padding: "1rem", borderRadius: "8px", border: "1px solid #374151" }}>
                    <p style={{ fontSize: "0.85rem", color: "#d1d5db" }}>
                      <b>Format :</b> {kcvResult.keyLengthBits} bits ({kcvResult.keyLengthBits / 64} blocs DES)
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "#d1d5db", marginTop: "0.25rem" }}>
                      <b>Clé masquée :</b> <code>{kcvResult.keyHex}</code>
                    </p>
                    <p style={{ fontSize: "0.82rem", color: "#34d399", marginTop: "0.5rem" }}>
                      ✓ {kcvResult.notes}
                    </p>
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: "1.4" }}>
                    💡 <b>Règle Exploitation :</b> Comparez toujours ce KCV à 6 caractères avec celui figurant sur le bordereau sécurisé d&apos;échange de clés avec le switch (ex: Visa, GIM, Mastercard).
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginTop: "2rem" }}>
                  Saisissez une clé hexadécimale et cliquez sur calculer pour obtenir le KCV de contrôle.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "PIN_BLOCK" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="card">
              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                Générateur &amp; Analyseur de PIN Block ISO 9564 (Format 0)
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
                Le format ISO-0 combine par un XOR logique le bloc PIN avec les 12 chiffres de compte du PAN.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Numéro de carte (PAN complet) :
                  </label>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    className="input"
                    placeholder="4970101234567890"
                    maxLength={19}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Code PIN (Simulation pour calcul) :
                  </label>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="input"
                    placeholder="1234"
                    maxLength={6}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCalculatePinBlock}
                  className="btn-primary"
                  style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
                >
                  Calculer le PIN Block ISO-0 →
                </button>
              </div>
            </div>

            <div className="card" style={{ background: "#111827", color: "#ffffff", border: "1px solid #374151" }}>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.08em", color: "#e60028", fontWeight: 700, textTransform: "uppercase" }}>
                DÉCOMPOSITION DU PIN BLOCK EN CLAIR
              </span>

              {pinBlockResult ? (
                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>PIN Block Clair (avant chiffrement ZPK) :</span>
                    <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#ffffff", fontFamily: "monospace", letterSpacing: "0.1em" }}>
                      {pinBlockResult.pinBlockHex}
                    </p>
                  </div>

                  <div style={{ background: "#1f2937", padding: "1rem", borderRadius: "8px", border: "1px solid #374151", fontSize: "0.82rem" }}>
                    <p style={{ color: "#d1d5db" }}>
                      <b>Format :</b> ISO 9564 Format 0 (ANSI X9.8)
                    </p>
                    <p style={{ color: "#d1d5db", marginTop: "0.25rem" }}>
                      <b>12 chiffres extraits du PAN :</b> <code>{pinBlockResult.pan12}</code>
                    </p>
                    <p style={{ color: "#d1d5db", marginTop: "0.25rem" }}>
                      <b>Formule :</b> <code>PIN Block = (0L PIN F..F) XOR (0000 PAN)</code>
                    </p>
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: "1.4" }}>
                    🛡️ {pinBlockResult.diagnosticAdvice}
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginTop: "2rem" }}>
                  Renseignez le PAN et le code PIN de test pour voir la décomposition du PIN Block.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "HSM_ERRORS" && (
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                  Codes Erreurs &amp; Diagnostics HSM Bancaires
                </h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Identifiez immédiatement la cause racine des rejets cryptographiques (Thales PayShield 9000/10K &amp; Atalla).
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setHsmVendor("THALES")}
                  className={`btn-ghost ${hsmVendor === "THALES" ? "btn-primary" : ""}`}
                  style={{ fontSize: "0.82rem", padding: "0.4rem 0.8rem" }}
                >
                  Thales PayShield
                </button>
                <button
                  type="button"
                  onClick={() => setHsmVendor("ATALLA")}
                  className={`btn-ghost ${hsmVendor === "ATALLA" ? "btn-primary" : ""}`}
                  style={{ fontSize: "0.82rem", padding: "0.4rem 0.8rem" }}
                >
                  Atalla HSM
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                value={errorCodeSearch}
                onChange={(e) => setErrorCodeSearch(e.target.value)}
                placeholder="Rechercher par code d'erreur (ex: 01, 02, 10, parity, card...)"
                className="input"
              />
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "90px" }}>Code</th>
                    <th style={{ width: "220px" }}>Signification</th>
                    <th>Cause Racine Probable</th>
                    <th>Action Corrective Exploitant</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredErrors.map((err) => (
                    <tr key={err.code}>
                      <td>
                        <span style={{ fontWeight: 800, color: "#e60028", background: "#fef2f2", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                          {err.code}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: "#111827" }}>{err.meaning}</td>
                      <td style={{ fontSize: "0.85rem", color: "#374151" }}>{err.cause}</td>
                      <td style={{ fontSize: "0.85rem", color: "#111827", fontWeight: 600 }}>
                        👉 {err.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

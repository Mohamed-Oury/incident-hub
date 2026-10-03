"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  MONETIQUE_CHEAT_CATEGORIES,
  MONETIQUE_CHEAT_SHEET,
} from "@/modules/training-monetique/cheat-sheet-index";

/* =========================================================================
   Petits composants de présentation (même charte que l'antisèche CBS)
   ========================================================================= */

const codeStyle: React.CSSProperties = {
  background: "#090d16",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  padding: "14px 16px",
  color: "#38bdf8",
  fontFamily: "monospace",
  fontSize: "0.83rem",
  lineHeight: "1.5",
  overflowX: "auto",
  margin: 0,
  whiteSpace: "pre",
};

function Code({ children }: { children: string }) {
  return <pre style={codeStyle}>{children}</pre>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600, marginBottom: "6px" }}>
      {children}
    </div>
  );
}

function Note({
  color = "#3b82f6",
  title,
  children,
}: {
  color?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.6)",
        border: `1px solid ${color}55`,
        borderLeft: `4px solid ${color}`,
        borderRadius: "8px",
        padding: "12px 16px",
      }}
    >
      <div style={{ color, fontWeight: 700, fontSize: "0.88rem", marginBottom: "6px" }}>{title}</div>
      <div style={{ color: "#cbd5e1", fontSize: "0.86rem", lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid #334155", borderRadius: "8px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
        <thead>
          <tr style={{ background: "#0f172a" }}>
            {headers.map((h, idx) => (
              <th
                key={`${h}-${idx}`}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  color: "#38bdf8",
                  fontWeight: 700,
                  borderBottom: "1px solid #334155",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#090d16" : "#111827" }}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "7px 12px",
                    color: j === 0 ? "#f8fafc" : "#cbd5e1",
                    fontWeight: j === 0 ? 700 : 400,
                    fontFamily: j === 0 ? "monospace" : "inherit",
                    borderBottom: "1px solid #1e293b",
                    verticalAlign: "top",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Flow({ steps, lastColor = "#10b981" }: { steps: string[]; lastColor?: string }) {
  return (
    <div
      style={{
        background: "#090d16",
        border: "1px solid #1e293b",
        borderRadius: "8px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
        fontSize: "0.86rem",
        fontWeight: 700,
        color: "#38bdf8",
      }}
    >
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          {i > 0 && <span style={{ color: "#64748b" }}>→</span>}
          <span style={{ color: i === steps.length - 1 ? lastColor : undefined }}>{s}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

function Bullets({ items, color = "#38bdf8" }: { items: React.ReactNode[]; color?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {items.map((it, i) => (
        <div key={i} style={{ fontSize: "0.86rem", color: "#e2e8f0", lineHeight: 1.5 }}>
          <span style={{ color, marginRight: "8px" }}>•</span>
          {it}
        </div>
      ))}
    </div>
  );
}

function ToolLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        alignSelf: "flex-start",
        fontSize: "0.8rem",
        fontWeight: 700,
        color: "#38bdf8",
        textDecoration: "none",
        background: "#0f172a",
        border: "1px solid #0284c7",
        padding: "6px 12px",
        borderRadius: "6px",
      }}
    >
      {children} →
    </Link>
  );
}

const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "14px" };
const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "14px",
};

/* =========================================================================
   Données interactives
   ========================================================================= */

const INCIDENT_CHECKLIST = [
  "Heure de début identifiée",
  "Canal concerné (GAB / TPE / e-commerce)",
  "BIN / émetteur concerné",
  "Réseau (GIM-UEMOA, Visa, Mastercard, UPI)",
  "MTI et DE39 relevés",
  "STAN / RRN d'une transaction exemple",
  "Taux d'échec comparé au nominal",
  "Logs switch consultés",
  "Statut HSM vérifié",
  "Sessions réseau OK (0800 / echo test)",
  "Impact client estimé",
  "Escalade & communication faites",
];

function computePinBlockIso0(pin: string, pan: string) {
  if (!/^\d{4,12}$/.test(pin)) return { error: "Le PIN doit contenir 4 à 12 chiffres." };
  if (!/^\d{13,19}$/.test(pan)) return { error: "Le PAN doit contenir 13 à 19 chiffres." };
  const pinField = ("0" + pin.length.toString(16).toUpperCase() + pin).padEnd(16, "F");
  const panField = "0000" + pan.slice(0, -1).slice(-12);
  let block = "";
  for (let i = 0; i < 16; i++) {
    block += (parseInt(pinField[i], 16) ^ parseInt(panField[i], 16)).toString(16).toUpperCase();
  }
  return { pinField, panField, block };
}

/* =========================================================================
   Composant principal
   ========================================================================= */

export function MonetiqueCheatSheet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [pinInput, setPinInput] = useState("1234");
  const [panInput, setPanInput] = useState("4970101234567890");

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const checkedCount = INCIDENT_CHECKLIST.filter((i) => checklist[i]).length;
  const pinResult = computePinBlockIso0(pinInput.trim(), panInput.replace(/\s/g, ""));

  const filteredSections = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return MONETIQUE_CHEAT_SHEET.filter((s) => {
      const matchCat = selectedCategory === "ALL" || s.category === selectedCategory;
      const matchSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.badge.toLowerCase().includes(q) ||
        s.rawText.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  /* ---------- Contenu riche de chaque fiche (par id) ---------- */
  const renderContent = (id: number): React.ReactNode => {
    switch (id) {
      case 1:
        return (
          <div style={col}>
            <div>
              <Label>Toujours dérouler cette séquence, dans cet ordre :</Label>
              <Flow
                steps={[
                  "Symptôme",
                  "Périmètre",
                  "Trame (MTI / DE39 / STAN / RRN)",
                  "Logs",
                  "Cause racine",
                  "Action / Escalade",
                  "Post-mortem",
                ]}
              />
            </div>
            <div style={grid2}>
              <Note title="❓ Les 6 questions immédiates" color="#3b82f6">
                <Bullets
                  items={[
                    "Depuis quand ? (horodatage précis)",
                    "Combien ? (volume, taux d'échec vs nominal)",
                    "Quel canal ? GAB, TPE, e-commerce",
                    "Quel BIN / émetteur / réseau ?",
                    "Un seul terminal ou tout le parc ?",
                    "Qui a répondu ? émetteur, stand-in, switch, acquéreur",
                  ]}
                />
              </Note>
              <Note title="📂 Où regarder" color="#10b981">
                <Bullets
                  color="#10b981"
                  items={[
                    "Logs switch : trame aller/retour, latence, DE39",
                    "Journal électronique GAB (EJ) : ce que le client a vécu",
                    "HSM : codes erreur, KCV des clés",
                    "Sessions réseau : 0800/0810 (sign-on, echo test)",
                    "Base d'incidents : un cas similaire déjà résolu ?",
                  ]}
                />
              </Note>
            </div>
            <ToolLink href="/diagnostic">Ouvrir le module Diagnostic</ToolLink>
          </div>
        );

      case 2:
        return (
          <div style={col}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1, height: "8px", background: "#090d16", borderRadius: "4px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${(checkedCount / INCIDENT_CHECKLIST.length) * 100}%`,
                    height: "100%",
                    background: checkedCount === INCIDENT_CHECKLIST.length ? "#10b981" : "#0284c7",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#e2e8f0" }}>
                {checkedCount} / {INCIDENT_CHECKLIST.length}
              </span>
              <button
                onClick={() => setChecklist({})}
                style={{
                  background: "#090d16",
                  border: "1px solid #475569",
                  color: "#cbd5e1",
                  fontSize: "0.75rem",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ↺ Réinitialiser
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "8px" }}>
              {INCIDENT_CHECKLIST.map((item) => {
                const checked = !!checklist[item];
                return (
                  <label
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: checked ? "rgba(16, 185, 129, 0.12)" : "#090d16",
                      border: `1px solid ${checked ? "#10b981" : "#1e293b"}`,
                      borderRadius: "6px",
                      padding: "8px 10px",
                      fontSize: "0.84rem",
                      color: checked ? "#a7f3d0" : "#e2e8f0",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setChecklist((prev) => ({ ...prev, [item]: !prev[item] }))}
                    />
                    {item}
                  </label>
                );
              })}
            </div>
            {checkedCount === INCIDENT_CHECKLIST.length && (
              <Note title="✅ Incident qualifié" color="#10b981">
                Toutes les informations sont réunies : tu peux ouvrir le ticket / escalader avec un dossier complet.
              </Note>
            )}
          </div>
        );

      case 3:
        return (
          <div style={col}>
            <Code>{`  0   2   1   0
  │   │   │   └── Origine  : 0 acquéreur · 1 acquéreur (répétition) · 2 émetteur · 3 émetteur (répétition)
  │   │   └────── Fonction : 0 requête · 1 réponse · 2 advice · 3 réponse à advice · 4 notification
  │   └────────── Classe   : 1 autorisation · 2 financier · 3 fichiers · 4 annulation · 5 réconciliation · 6 admin · 8 réseau
  └────────────── Version  : 0 = ISO 8583:1987 · 1 = 1993 · 2 = 2003`}</Code>
            <Table
              headers={["Paire", "Signification", "Usage typique"]}
              rows={[
                ["0100 / 0110", "Demande / réponse d'autorisation", "Achat TPE (double message), pré-autorisation"],
                ["0120 / 0130", "Advice d'autorisation", "Stand-in : le réseau informe l'émetteur après coup"],
                ["0200 / 0210", "Transaction financière", "Retrait GAB, achat débit immédiat (simple message)"],
                ["0220 / 0230", "Advice financier", "Complétion, transaction offline remontée"],
                ["0400 / 0410", "Demande d'annulation (reversal)", "Annulation avec attente de réponse"],
                ["0420 / 0430", "Advice d'annulation", "Time-out, non-distribution GAB (store & forward)"],
                ["0421", "Répétition de 0420", "Renvoyé tant que le 0430 n'est pas reçu"],
                ["0800 / 0810", "Gestion réseau (DE70)", "001 sign-on · 002 sign-off · 301 echo test · échange de clés (selon spec)"],
              ]}
            />
            <Note title="🎯 Réflexe" color="#8b5cf6">
              Une requête sans réponse (0100 sans 0110, 0200 sans 0210) = <strong>time-out</strong> → on doit trouver un 0400/0420 derrière.
            </Note>
            <ToolLink href="/mti">Référentiel MTI complet</ToolLink>
          </div>
        );

      case 4:
        return (
          <div style={col}>
            <Bullets
              items={[
                <>Bitmap primaire = <strong>64 bits = 16 caractères hexa</strong> (8 octets).</>,
                <>Chaque caractère hexa = 4 bits de poids <strong>8 · 4 · 2 · 1</strong>.</>,
                <>Le n-ième caractère couvre les champs <strong>4n-3 à 4n</strong>.</>,
                <>Bit 1 à 1 (premier hexa ≥ 8) ⇒ <strong>bitmap secondaire</strong> présent (champs 65 à 128).</>,
              ]}
            />
            <Label>Exemple : réponse 0210 avec bitmap 723804010A808000</Label>
            <Code>{`Hexa :   7    2    3    8    0    4    0    1    0    A    8    0    8    0    0    0
Bits : 0111 0010 0011 1000 0000 0100 0000 0001 0000 1010 1000 0000 1000 0000 0000 0000
Champs: 2,3,4  7  11,12 13       22        32      37,39  41        49

→ DE2 PAN · DE3 code traitement · DE4 montant · DE7 date/heure · DE11 STAN
  DE12/13 heure/date locales · DE22 mode de saisie · DE32 acquéreur
  DE37 RRN · DE39 code réponse · DE41 terminal · DE49 devise`}</Code>
            <Table
              headers={["Hexa", "Bits", "Hexa", "Bits"]}
              rows={[
                ["0", "0000", "8", "1000"],
                ["1", "0001", "9", "1001"],
                ["2", "0010", "A", "1010"],
                ["3", "0011", "B", "1011"],
                ["4", "0100", "C", "1100"],
                ["5", "0101", "D", "1101"],
                ["6", "0110", "E", "1110"],
                ["7", "0111", "F", "1111"],
              ]}
            />
            <ToolLink href="/bitmap">Décoder un bitmap automatiquement</ToolLink>
          </div>
        );

      case 5:
        return (
          <div style={col}>
            <Table
              headers={["DE", "Nom", "Format", "À retenir"]}
              rows={[
                ["DE2", "PAN", "n ..19 (LLVAR)", "Masquer en logs (PCI DSS) : 6 premiers + 4 derniers"],
                ["DE3", "Code traitement", "n 6", "00 achat · 01 retrait · 20 remboursement · 30 solde · 40 transfert (pos. 3-4 / 5-6 = comptes)"],
                ["DE4", "Montant transaction", "n 12", "En unités mineures : XOF/XAF sans décimale → 5 000 XOF = 000000005000"],
                ["DE7", "Date/heure transmission", "n 10", "MMJJhhmmss en GMT, clé de rapprochement"],
                ["DE11", "STAN", "n 6", "N° de trace système, unique par acquéreur/jour"],
                ["DE12 / DE13", "Heure / date locales", "n 6 / n 4", "Heure du terminal (≠ DE7)"],
                ["DE14", "Date d'expiration", "n 4", "AAMM"],
                ["DE18", "MCC", "n 4", "Catégorie commerçant (6011 = GAB, 5411 = supermarché)"],
                ["DE22", "Mode de saisie", "n 3", "05x puce · 07x sans contact · 90x piste · 01x manuel"],
                ["DE32", "Code acquéreur", "n ..11", "Identifie l'institution acquéreuse"],
                ["DE35", "Piste 2", "z ..37", "Données sensibles : jamais en clair dans les logs"],
                ["DE37", "RRN", "an 12", "Référence de recouvrement, clé litiges / compensation"],
                ["DE38", "Code d'autorisation", "an 6", "Fourni par l'émetteur si approuvé"],
                ["DE39", "Code réponse", "an 2", "Voir fiche 6"],
                ["DE41 / DE42", "TID / MID", "ans 8 / ans 15", "Terminal / commerçant (agence pour un GAB)"],
                ["DE43", "Nom & localisation", "ans 40", "Ce que le porteur voit sur son relevé"],
                ["DE49", "Devise", "n 3", "952 XOF · 950 XAF · 978 EUR · 840 USD"],
                ["DE52", "PIN block", "b 64", "PIN chiffré (voir fiche 14)"],
                ["DE55", "Données EMV", "b ..999", "Tags TLV (voir fiche 10)"],
                ["DE64 / DE128", "MAC", "b 64", "Rejet MAC = clé TAK/ZAK désynchronisée"],
                ["DE70", "Code gestion réseau", "n 3", "Uniquement en 0800/0810"],
                ["DE90", "Données originales", "n 42", "Dans un reversal : MTI + STAN + DE7 + acquéreur d'origine"],
                ["DE95", "Montants de remplacement", "an 42", "Reversal partiel (distribution partielle GAB)"],
              ]}
            />
          </div>
        );

      case 6:
        return (
          <div style={col}>
            <Table
              headers={["DE39", "Signification", "Origine", "Réflexe RUN"]}
              rows={[
                ["00", "Approuvée", "Émetteur", "—"],
                ["01", "Référer à l'émetteur", "Émetteur", "Porteur contacte sa banque"],
                ["03", "Commerçant invalide", "Acquéreur / réseau", "Vérifier paramétrage MID / affiliation"],
                ["04", "Capturer la carte", "Émetteur", "Carte en opposition, procédure de capture"],
                ["05", "Ne pas honorer", "Émetteur", "Isolé : porteur. En masse sur un BIN : paramétrage / stand-in"],
                ["12", "Transaction invalide", "Émetteur / switch", "DE3 ou type de transaction non supporté"],
                ["13", "Montant invalide", "Émetteur", "Contrôler DE4 / exposant devise"],
                ["14", "N° de carte invalide", "Émetteur", "BIN mal routé ? PAN tronqué ?"],
                ["30", "Erreur de format", "Switch / émetteur", "Comparer la trame à la spec (LLVAR, bitmap)"],
                ["41 / 43", "Carte perdue / volée", "Émetteur", "Opposition, capture"],
                ["51", "Provision insuffisante", "Émetteur", "Porteur"],
                ["54", "Carte expirée", "Émetteur", "Vérifier DE14 si en masse"],
                ["55", "PIN incorrect", "Émetteur", "En masse ⇒ clés TPK/ZPK (KCV), pas les porteurs !"],
                ["57 / 58", "Non autorisée porteur / terminal", "Émetteur / acquéreur", "Profil carte ou capacités terminal"],
                ["61 / 65", "Plafond montant / fréquence", "Émetteur", "Plafonds carte"],
                ["62", "Carte restreinte", "Émetteur", "Restriction géographique / canal"],
                ["75", "Essais PIN dépassés", "Émetteur", "Déblocage par l'émetteur"],
                ["91", "Émetteur indisponible", "Switch / réseau", "Sessions 0800, liens, time-outs, stand-in"],
                ["94", "Transmission en double", "Switch", "STAN rejoué ? Problème de répétition"],
                ["96", "Dysfonctionnement système", "Switch / émetteur", "Logs applicatifs, HSM, base de données"],
              ]}
            />
            <Note title="🧠 Règle d'or" color="#ef4444">
              <strong>Un code isolé = un porteur. Un code en masse = un système.</strong> Avant d&apos;accuser l&apos;émetteur, vérifie qui a réellement généré la réponse (émetteur, stand-in ou switch).
            </Note>
            <ToolLink href="/de39">Référentiel DE39 complet</ToolLink>
          </div>
        );

      case 7:
        return (
          <div style={col}>
            <Code>{`┌─────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐   ┌──────────────┐
│ Porteur │──▶│ GAB/TPE/Web  │──▶│  Acquéreur   │──▶│   Switch / Réseau    │──▶│   Émetteur   │
│ (carte) │   │ (accepteur)  │   │  (serveur    │   │ GIM-UEMOA · Visa ·   │   │  (serveur    │
└─────────┘   └──────────────┘   │ acquisition) │   │ Mastercard · UPI     │   │ autorisation)│
                                 └──────────────┘   └──────────────────────┘   └──────────────┘
              ◀──────────────── réponse (DE39, DE38, DE55 tag 91) ◀────────────────────────────`}</Code>
            <div style={grid2}>
              <Note title="⏱️ Autorisation" color="#f59e0b">
                Temps réel (0100/0200). L&apos;émetteur accepte ou refuse. Aucun argent ne bouge encore.
              </Note>
              <Note title="📦 Compensation" color="#a855f7">
                Fichiers d&apos;échange présentés par l&apos;acquéreur (J+1) : ce qui sera réellement débité.
              </Note>
              <Note title="💸 Règlement" color="#10b981">
                Mouvement de fonds net entre banques via la banque de règlement.
              </Note>
              <Note title="🛟 Stand-in (STIP)" color="#3b82f6">
                Émetteur injoignable ⇒ le réseau répond à sa place selon des règles (plafonds) puis lui envoie un <strong>advice 0120/0220</strong>.
              </Note>
            </div>
          </div>
        );

      case 8:
        return (
          <div style={col}>
            <Code>{` GAB                        Host / Acquéreur                 Émetteur
  │ Carte insérée, puce lue      │                                 │
  │ PIN chiffré par l'EPP (TPK)  │                                 │
  │── Transaction Request (11) ─▶│                                 │
  │                              │── 0200 (DE3=01xxxx, DE52) ─────▶│
  │                              │◀─ 0210 (DE39=00, DE38) ─────────│
  │◀─ Transaction Reply (4) ─────│  (ordre de distribution)        │
  │ Billets présentés / pris     │                                 │
  │── Solicited Status (22) ────▶│  OK  → fin                      │
  │                              │  KO / time-out → 0420 ─────────▶│ (annule le débit)`}</Code>
            <Label>Lire le journal électronique (libellés variables selon constructeur) :</Label>
            <Table
              headers={["Événement EJ", "Interprétation"]}
              rows={[
                ["CARD INSERTED", "Début de session porteur"],
                ["PIN ENTERED", "PIN saisi, requête partie vers l'hôte"],
                ["NOTES PRESENTED", "Billets présentés dans la fente"],
                ["NOTES TAKEN", "Le client a pris les billets ⇒ distribution effective"],
                ["NOTES RETRACTED", "Billets non pris, ravalés ⇒ reversal / recrédit attendu"],
                ["CARD RETAINED", "Carte capturée (DE39 04, oubli, incident)"],
                ["HARDWARE ERROR / JAM", "Incident matériel ⇒ vérifier compteurs cassettes"],
              ]}
            />
            <Note title="🧾 « Débité non servi »" color="#f59e0b">
              1) EJ : NOTES TAKEN ou RETRACTED ? 2) Un 0420 est-il parti et acquitté (0430) ? 3) Écart de comptage cassettes à l&apos;arrêté ? ⇒ Décision de recrédit documentée.
            </Note>
            <ToolLink href="/atm-ej">Analyser un journal GAB</ToolLink>
          </div>
        );

      case 9:
        return (
          <div style={col}>
            <Table
              headers={["Message", "Rôle", "Particularité"]}
              rows={[
                ["0400 → 0410", "Demande d'annulation", "Attend une réponse"],
                ["0420 → 0430", "Advice d'annulation", "Store & forward : stocké et renvoyé jusqu'à acquittement"],
                ["0421", "Répétition du 0420", "Envoyé si pas de 0430 reçu"],
              ]}
            />
            <div style={grid2}>
              <Note title="🚨 Quand l'acquéreur annule" color="#ef4444">
                <Bullets
                  color="#ef4444"
                  items={[
                    "Time-out : pas de réponse de l'émetteur",
                    "Réponse arrivée trop tard",
                    "Échec / distribution partielle GAB",
                    "Annulation commerçant",
                    "Réponse rejetée (MAC invalide, format)",
                  ]}
                />
              </Note>
              <Note title="🔗 Rapprocher un reversal" color="#3b82f6">
                <strong>DE90</strong> = MTI + STAN + DE7 + acquéreur d&apos;origine. Clés : <strong>STAN · RRN · DE7 · DE41 · PAN</strong>. <strong>DE95</strong> porte le montant réellement distribué en cas de reversal partiel.
              </Note>
            </div>
            <Label>Règle des time-outs (valeurs indicatives) :</Label>
            <Code>{`Terminal (45-60 s)  >  Acquéreur (30 s)  >  Réseau (20 s)  >  Émetteur (10-15 s)

Chaque maillon doit attendre PLUS longtemps que la somme des maillons en aval.
Sinon : l'émetteur approuve, l'amont a déjà abandonné ⇒ double débit / débité non servi.`}</Code>
            <ToolLink href="/timeout-matrix">Matrice des time-outs</ToolLink>
          </div>
        );

      case 10:
        return (
          <div style={col}>
            <Bullets
              items={[
                <><strong>Tag</strong> : 1 octet, ou 2 si les 5 bits bas du 1er octet valent 11111 (0x1F) ⇒ 9F.., 5F..</>,
                <><strong>Length</strong> : 1 octet si &lt; 0x80 ; 81 XX (128-255) ; 82 XXXX au-delà.</>,
                <><strong>Value</strong> : exactement Length octets (2 × Length caractères hexa).</>,
              ]}
            />
            <Label>Exemple de découpage :</Label>
            <Code>{`9F26 08 1122334455667788   → Cryptogramme d'application (ARQC)
9F27 01 80                 → CID : 80 = ARQC
95   05 0000008000         → TVR : montant > floor limit
9A   03 261003             → Date : 2026-10-03 (AAMMJJ)
9C   01 01                 → Type : 01 = retrait espèces`}</Code>
            <Table
              headers={["Tag", "Nom", "Tag", "Nom"]}
              rows={[
                ["4F", "AID (application)", "9A", "Date transaction"],
                ["57", "Équivalent piste 2", "9B", "TSI"],
                ["5A", "PAN", "9C", "Type de transaction"],
                ["5F24", "Date d'expiration", "9F02", "Montant autorisé"],
                ["5F2A", "Devise transaction", "9F03", "Autre montant (cashback)"],
                ["5F34", "PAN Sequence Number", "9F10", "Issuer Application Data (CVR, CVN)"],
                ["82", "AIP", "9F1A", "Pays du terminal"],
                ["84", "Dedicated File name", "9F26", "Cryptogramme (AC)"],
                ["8A", "Code réponse autorisation", "9F27", "CID (type de cryptogramme)"],
                ["91", "Issuer Auth. Data (ARPC)", "9F33", "Capacités terminal"],
                ["95", "TVR", "9F34", "CVM Results"],
                ["71 / 72", "Scripts émetteur", "9F36 / 9F37", "ATC / Nombre imprévisible"],
              ]}
            />
            <ToolLink href="/emv">Décoder un DE55 automatiquement</ToolLink>
          </div>
        );

      case 11:
        return (
          <div style={col}>
            <Table
              headers={["Octet", "b8", "b7", "b6", "b5", "b4", "b3"]}
              rows={[
                ["1 · Auth. offline", "ODA non effectuée", "SDA échouée", "Données ICC manquantes", "Carte en liste noire terminal", "DDA échouée", "CDA échouée"],
                ["2 · Restrictions", "Versions appli différentes", "Application expirée", "Pas encore active", "Service non autorisé", "Nouvelle carte", "—"],
                ["3 · Vérif. porteur", "CVM échouée", "CVM inconnue", "Essais PIN dépassés", "PIN requis, pad absent / HS", "PIN requis, non saisi", "PIN online saisi"],
                ["4 · Risques terminal", "Montant > floor limit", "Limite offline basse dépassée", "Limite offline haute dépassée", "Sélection aléatoire online", "Forcé online (commerçant)", "—"],
                ["5 · Auth. émetteur", "TDOL par défaut", "Auth. émetteur échouée", "Script KO avant 2nd GEN AC", "Script KO après 2nd GEN AC", "—", "—"],
              ]}
            />
            <Label>Lectures types :</Label>
            <Code>{`95 = 00 00 00 80 00  → octet 4 b8 : montant > floor limit ⇒ online normal, RAS
95 = 00 00 04 80 00  → PIN online saisi + floor limit ⇒ cas nominal GAB
95 = 80 00 00 00 00  → aucune authentification offline faite ⇒ à surveiller
95 = 00 00 00 00 40  → authentification émetteur échouée ⇒ ARPC refusé par la carte (clés EMV !)`}</Code>
            <Note title="🧾 TSI (Tag 9B), octet 1 : « ce qui a été fait »" color="#06b6d4">
              b8 auth. offline · b7 vérification porteur · b6 gestion risques carte · b5 auth. émetteur · b4 gestion risques terminal · b3 scripts. Le TVR dit <em>ce qui a échoué</em>, le TSI dit <em>ce qui a été exécuté</em>.
            </Note>
          </div>
        );

      case 12:
        return (
          <div style={col}>
            <Table
              headers={["Cryptogramme", "CID (9F27)", "Signification"]}
              rows={[
                ["AAC", "0x00", "Refus (offline ou final)"],
                ["TC", "0x40", "Acceptation (offline ou après online)"],
                ["ARQC", "0x80", "La carte demande une autorisation online"],
                ["ARPC", "tag 91", "Réponse de l'émetteur, vérifiée par la carte"],
              ]}
            />
            <Code>{`1st GENERATE AC ──▶ ARQC (clé de session = f(MK-AC, PAN, PSN, ATC))
   données : 9F02 9F03 9F1A 95 5F2A 9A 9C 9F37 82 9F36 9F10
        │
        ▼  0100/0200 avec DE55
HSM émetteur : vérifie l'ARQC ── génère l'ARPC
        │
        ▼  0110/0210 avec DE55 tag 91 (+ scripts 71/72)
Carte : vérifie l'ARPC ──▶ 2nd GENERATE AC ──▶ TC (OK) ou AAC (refus)`}</Code>
            <Note title="🔥 ARQC KO en masse : suspects" color="#ef4444">
              Mauvaise IMK / MK-AC chargée en HSM · mauvais schéma de dérivation ou CVN (9F10) · tags mal mappés dans le DE55 · PSN (5F34) absent ou erroné · ATC incohérent.
            </Note>
            <ToolLink href="/crypto-hsm">Diagnostic clés HSM</ToolLink>
          </div>
        );

      case 13:
        return (
          <div style={col}>
            <Code>{`                    LMK  (dans le HSM, chiffre toutes les clés stockées)
          ┌──────────┬──────┴──────┬──────────────┬─────────────┐
         ZMK        TMK           PVK            CVK          IMK / MK-AC
   (inter-banques) (terminal)  (PVV/offset)  (CVV/CVV2/iCVV)   (EMV)
      │     │        │
     ZPK   ZAK      TPK / TAK
   (PIN)  (MAC)   (PIN / MAC terminal)          TPE : BDK → IPEK (DUKPT)`}</Code>
            <div style={grid2}>
              <Note title="🔑 Cérémonie de clés" color="#ec4899">
                Composants (2 ou 3) combinés par XOR, chacun détenu par un gardien différent : <strong>double contrôle</strong> et <strong>connaissance partagée</strong>.
              </Note>
              <Note title="✔️ KCV (Key Check Value)" color="#10b981">
                Chiffrement d&apos;un bloc de zéros avec la clé, on garde les premiers caractères. <strong>Même KCV des deux côtés = même clé.</strong>
              </Note>
            </div>
            <Note title="🚨 Symptômes d'une clé désynchronisée" color="#ef4444">
              DE39 55 (PIN incorrect) en masse sur un réseau ou un parc · rejets MAC · erreurs HSM 01. ⇒ Comparer les KCV TPK / ZPK / ZAK avec le partenaire avant toute autre action.
            </Note>
          </div>
        );

      case 14:
        return (
          <div style={col}>
            <Code>{`Champ PIN : 0 | longueur | PIN | FFFF…   →  0 4 1 2 3 4 F F F F F F F F F F
Champ PAN : 0000 | 12 chiffres de droite du PAN hors clé de Luhn
            PAN 4970101234567890 → 010123456789 → 0 0 0 0 0 1 0 1 2 3 4 5 6 7 8 9
XOR       :                                    0 4 1 2 3 5 F E D C B A 9 8 7 6

PIN block clair = 041235FEDCBA9876 → chiffré 3DES par la TPK → DE52`}</Code>
            <div
              style={{
                background: "#090d16",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f472b6" }}>🧮 Calculateur ISO-0 (données de test uniquement)</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[
                  { label: "PIN", value: pinInput, set: setPinInput, width: "120px" },
                  { label: "PAN", value: panInput, set: setPanInput, width: "240px" },
                ].map((f) => (
                  <label key={f.label} style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.75rem", color: "#94a3b8" }}>
                    {f.label}
                    <input
                      value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                      style={{
                        width: f.width,
                        padding: "8px 10px",
                        background: "#0f172a",
                        border: "1px solid #475569",
                        borderRadius: "6px",
                        color: "#f8fafc",
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        outline: "none",
                      }}
                    />
                  </label>
                ))}
              </div>
              {"error" in pinResult ? (
                <div style={{ color: "#f87171", fontSize: "0.82rem" }}>{pinResult.error}</div>
              ) : (
                <div style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#e2e8f0", lineHeight: 1.7 }}>
                  <div>Champ PIN : <span style={{ color: "#38bdf8" }}>{pinResult.pinField}</span></div>
                  <div>Champ PAN : <span style={{ color: "#38bdf8" }}>{pinResult.panField}</span></div>
                  <div>PIN block : <span style={{ color: "#10b981", fontWeight: 700 }}>{pinResult.block}</span></div>
                </div>
              )}
            </div>
            <Table
              headers={["Format", "Particularité"]}
              rows={[
                ["ISO-0", "PIN XOR PAN (le plus répandu, GAB / TPE)"],
                ["ISO-1", "Sans PAN, remplissage aléatoire"],
                ["ISO-3", "Comme ISO-0 mais remplissage aléatoire A-F"],
                ["ISO-4", "Bloc AES 128 bits (32 hexa)"],
              ]}
            />
            <Note title="🔁 Parcours du PIN" color="#ec4899">
              Terminal (TPK) → HSM acquéreur : translation <strong>TPK → ZPK</strong> → réseau : <strong>ZPK → ZPK</strong> → émetteur : vérification (PVV / offset). Le PIN n&apos;est <strong>jamais</strong> en clair hors du HSM.
            </Note>
          </div>
        );

      case 15:
        return (
          <div style={col}>
            <Table
              headers={["Commande", "Rôle"]}
              rows={[
                ["NC", "Diagnostic : état du HSM, KCV de la LMK, version firmware"],
                ["A0 / A6 / A8", "Générer / importer / exporter une clé"],
                ["BU", "Calculer le KCV d'une clé"],
                ["FA", "Translater une ZPK de chiffrement ZMK vers LMK"],
                ["CA", "Translater un PIN block de TPK vers ZPK"],
                ["CC", "Translater un PIN block d'une ZPK vers une autre ZPK"],
                ["JE", "Translater un PIN de ZPK vers LMK"],
                ["DA / DC", "Vérifier un PIN terminal (offset IBM / PVV Visa)"],
                ["EA / EC", "Vérifier un PIN interchange (offset IBM / PVV Visa)"],
                ["CW / CY", "Générer / vérifier un CVV"],
                ["KQ", "Vérifier un ARQC et générer l'ARPC (selon version EMV)"],
              ]}
            />
            <Note title="📨 Lecture d'une réponse" color="#3b82f6">
              Code réponse = 2e lettre incrémentée (<strong>CA → CB</strong>, <strong>NC → ND</strong>) suivi du code erreur.
            </Note>
            <Table
              headers={["Erreur", "Signification"]}
              rows={[
                ["00", "Aucune erreur"],
                ["01", "Échec de vérification (PIN, CVV, ARQC…)"],
                ["10", "Erreur de parité de la clé source"],
                ["11", "Erreur de parité de la clé destination"],
                ["15", "Données d'entrée invalides"],
                ["20", "PIN block invalide"],
                ["68", "Commande désactivée dans la configuration"],
              ]}
            />
            <Note title="⚠️ À vérifier dans le manuel" color="#f59e0b">
              Les codes exacts dépendent du modèle (payShield 9000 / 10K) et de la licence : se référer au Host Command Reference Manual de la version installée.
            </Note>
          </div>
        );

      case 16:
        return (
          <div style={col}>
            <Flow steps={["Autorisation (temps réel)", "Compensation (fichiers J+1)", "Règlement (fonds)"]} />
            <div style={grid2}>
              <div>
                <Label>Visa Base II (Transaction Codes)</Label>
                <Table
                  headers={["TC", "Signification"]}
                  rows={[
                    ["TC05", "Achat (sales draft)"],
                    ["TC06", "Crédit / remboursement"],
                    ["TC07", "Retrait espèces"],
                    ["TC15 / 16 / 17", "Chargeback de TC05 / 06 / 07"],
                  ]}
                />
              </div>
              <div>
                <Label>Mastercard IPM (MTI + DE24)</Label>
                <Table
                  headers={["Message", "Signification"]}
                  rows={[
                    ["1240 / 200", "Première présentation"],
                    ["1240 / 205-282", "Seconde présentation (totale / partielle)"],
                    ["1442 / 450-453", "Chargeback (total / partiel)"],
                    ["1644", "Administratif (header / trailer de fichier)"],
                    ["1740", "Collecte de frais"],
                  ]}
                />
              </div>
            </div>
            <Note title="🔎 Rapprochement autorisation ↔ présentation" color="#a855f7">
              Clés : <strong>DE38 (code autorisation) · RRN · montant · PAN</strong>. Écarts classiques : présentation sans autorisation, autorisation jamais présentée, montant différent (pourboire, conversion de devise).
            </Note>
            <Note title="🌍 Zone UEMOA" color="#10b981">
              Pour GIM-UEMOA, le règlement net est effectué via la banque de règlement (BCEAO / STAR-UEMOA).
            </Note>
          </div>
        );

      case 17:
        return (
          <div style={col}>
            <Flow
              steps={[
                "Réclamation porteur",
                "Demande de copie",
                "Chargeback (émetteur)",
                "Représentation (acquéreur)",
                "Pré-arbitrage",
                "Arbitrage réseau",
              ]}
              lastColor="#a855f7"
            />
            <div style={grid2}>
              <div>
                <Label>Visa (Visa Claims Resolution)</Label>
                <Table
                  headers={["Catégorie", "Exemples"]}
                  rows={[
                    ["10", "Fraude (carte absente, contrefaçon)"],
                    ["11", "Autorisation (absente, refusée)"],
                    ["12", "Erreur de traitement (doublon, montant)"],
                    ["13", "Litige consommateur (non reçu, annulé)"],
                  ]}
                />
              </div>
              <div>
                <Label>Mastercard (codes motifs)</Label>
                <Table
                  headers={["Code", "Motif"]}
                  rows={[
                    ["4808", "Lié à l'autorisation"],
                    ["4834", "Erreur au point d'interaction (doublon, GAB)"],
                    ["4837", "Absence d'autorisation du porteur (fraude)"],
                    ["4853", "Litige porteur (marchandise / service)"],
                  ]}
                />
              </div>
            </div>
            <Note title="⏳ Délais (indicatifs)" color="#f59e0b">
              Chargeback : ~120 jours après la date de traitement. Représentation : ~30 à 45 jours. Toujours vérifier le règlement en vigueur du réseau concerné.
            </Note>
            <Note title="🏧 Dossier GAB « débité non servi »" color="#3b82f6">
              Joindre : extrait EJ (NOTES TAKEN / RETRACTED), compteurs cassettes à l&apos;arrêté, trace 0200/0210 et éventuel 0420/0430.
            </Note>
          </div>
        );

      case 18:
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" }}>
            {[
              "Toujours partir de la trame : MTI, DE39, STAN, RRN.",
              "Identifier qui a répondu : émetteur, stand-in, switch.",
              "Code isolé = porteur. Code en masse = système.",
              "Rapprocher par STAN + RRN + DE7 + DE41.",
              "Réponse non reçue ⇒ reversal envoyé ET acquitté.",
              "PIN incorrect en masse ⇒ clés (KCV TPK / ZPK).",
              "Lire le DE55 (CID, TVR, TSI) avant d'accuser l'émetteur.",
              "Vérifier les sessions réseau (0800 echo) avant le ticket.",
              "Autorisation ≠ compensation ≠ règlement.",
              "Documenter : horodatage, impact, cause, action, post-mortem.",
            ].map((rule, idx) => (
              <div
                key={idx}
                style={{
                  background: "#090d16",
                  border: "1px solid #1e293b",
                  borderLeft: "4px solid #eab308",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  fontSize: "0.86rem",
                  color: "#f1f5f9",
                  fontWeight: 600,
                  display: "flex",
                  gap: "10px",
                }}
              >
                <span style={{ color: "#eab308", fontWeight: 800 }}>{idx + 1}.</span>
                {rule}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* EN-TÊTE */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #064e3b 100%)",
          border: "1px solid #10b981",
          borderRadius: "14px",
          padding: "24px 28px",
          boxShadow: "0 8px 30px rgba(16, 185, 129, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ maxWidth: "800px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span
              style={{
                background: "#059669",
                color: "#ffffff",
                padding: "3px 10px",
                borderRadius: "6px",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              ANTISÈCHE OFFICIELLE DE L&apos;INGÉNIEUR MONÉTIQUE
            </span>
            <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>
              {MONETIQUE_CHEAT_SHEET.length} fiches • Du message ISO au litige
            </span>
          </div>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0" }}>
            🧠 Fiche Mémo — Monétique, ISO 8583, EMV &amp; HSM
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#cbd5e1", margin: 0, lineHeight: "1.5" }}>
            L&apos;antisèche opérationnelle du RUN monétique : dès qu&apos;un incident tombe, ouvre cette fiche pour dérouler{" "}
            <strong>Trame → DE39 → Flux → EMV → Clés &amp; HSM → Compensation</strong>.
          </p>
        </div>

        <button
          onClick={() => {
            const fullText = MONETIQUE_CHEAT_SHEET.map((s) => `${s.title}\n${s.rawText}`).join("\n\n");
            copyToClipboard(fullText, 9999);
          }}
          style={{
            background: copiedId === 9999 ? "#10b981" : "#1e293b",
            border: "1px solid #475569",
            color: "#ffffff",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "0.82rem",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {copiedId === 9999 ? "✓ Copiée !" : "📋 Copier l'intégrale"}
        </button>
      </div>

      {/* RECHERCHE ET FILTRES */}
      <div
        style={{
          background: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "14px", top: "12px", color: "#38bdf8", fontSize: "1rem" }}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher une notion (ex: 0420, STAN, DE39 55, TVR, ARQC, ZPK, KCV, PIN block, chargeback...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px 12px 42px",
              background: "#090d16",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#f8fafc",
              fontSize: "0.88rem",
              outline: "none",
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                position: "absolute",
                right: "12px",
                top: "10px",
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          {MONETIQUE_CHEAT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? "#059669" : "#0f172a",
                border: selectedCategory === cat.id ? "1px solid #10b981" : "1px solid #334155",
                color: selectedCategory === cat.id ? "#ffffff" : "#94a3b8",
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {cat.id === "ALL" ? `${cat.label} (${MONETIQUE_CHEAT_SHEET.length})` : cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* SOMMAIRE */}
      <div
        style={{
          background: "#090d16",
          border: "1px solid #1e293b",
          borderRadius: "10px",
          padding: "12px 16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
          Accès direct :
        </span>
        {MONETIQUE_CHEAT_SHEET.map((s) => (
          <a
            key={s.id}
            href={`#monetique-section-${s.id}`}
            style={{
              fontSize: "0.75rem",
              color: "#34d399",
              textDecoration: "none",
              background: "#1e293b",
              padding: "3px 8px",
              borderRadius: "4px",
              border: "1px solid #334155",
            }}
          >
            {s.id}. {s.short}
          </a>
        ))}
      </div>

      {/* FICHES */}
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {filteredSections.map((section) => (
          <div
            key={section.id}
            id={`monetique-section-${section.id}`}
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              scrollMarginTop: "80px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                borderBottom: "1px solid #334155",
                paddingBottom: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#f8fafc", margin: 0 }}>{section.title}</h3>
                <span
                  style={{
                    background: `${section.badgeColor}20`,
                    color: section.badgeColor,
                    border: `1px solid ${section.badgeColor}50`,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  {section.badge}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(section.rawText, section.id)}
                style={{
                  background: copiedId === section.id ? "#10b981" : "#090d16",
                  border: "1px solid #475569",
                  color: "#cbd5e1",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {copiedId === section.id ? "✓ Copié" : "📋 Copier"}
              </button>
            </div>
            <div>{renderContent(section.id)}</div>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              background: "#090d16",
              borderRadius: "12px",
              border: "1px solid #334155",
              color: "#94a3b8",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🔍</div>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#f1f5f9" }}>Aucun résultat pour « {searchTerm} »</div>
            <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
              Essayez un autre mot-clé comme MTI, STAN, RRN, DE39, TVR, ARQC, ZPK ou chargeback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

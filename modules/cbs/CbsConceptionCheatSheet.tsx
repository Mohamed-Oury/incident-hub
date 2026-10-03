"use client";

import React, { useState, useMemo } from "react";

interface SectionItem {
  id: number;
  category: "METHODE" | "IHM" | "GRID" | "TRAITEMENT" | "TRANSACTION";
  title: string;
  badge: string;
  badgeColor: string;
  content: React.ReactNode;
  rawText: string;
}

export function CbsConceptionCheatSheet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  // Checklist interactive pour Section 15 (GRID)
  const [gridChecklist, setGridChecklist] = useState<Record<string, boolean>>({
    "Quelle donnée ?": false,
    "Combien de lignes ?": false,
    "Pagination ?": false,
    "Tri ?": false,
    "Filtre ?": false,
    "Sélection d'une ligne ?": false,
    "Double clic ?": false,
    "Modification directe ?": false,
    "Suppression ?": false,
    "Rafraîchissement ?": false,
    "Cas 0 résultat ?": false,
    "Cas 1 résultat ?": false,
    "Cas N résultats ?": false,
  });

  const toggleChecklistItem = (item: string) => {
    setGridChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sections: SectionItem[] = useMemo(() => [
    {
      id: 1,
      category: "METHODE",
      title: "1. 🧩 Avant de coder : décomposer le besoin",
      badge: "Fondation",
      badgeColor: "#3b82f6",
      rawText: "Avant de coder décomposer le besoin métier fonction données traitements IHM contrôles tests rechercher client afficher comptes",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "6px", fontWeight: 600 }}>
              Toujours commencer par cette séquence ordonnée :
            </div>
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
                fontSize: "0.88rem",
                fontWeight: 700,
                color: "#38bdf8",
              }}
            >
              <span>Besoin métier</span>
              <span style={{ color: "#64748b" }}>→</span>
              <span>Fonction</span>
              <span style={{ color: "#64748b" }}>→</span>
              <span>Données</span>
              <span style={{ color: "#64748b" }}>→</span>
              <span>Traitements</span>
              <span style={{ color: "#64748b" }}>→</span>
              <span>IHM</span>
              <span style={{ color: "#64748b" }}>→</span>
              <span>Contrôles</span>
              <span style={{ color: "#64748b" }}>→</span>
              <span style={{ color: "#10b981" }}>Tests</span>
            </div>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "8px",
              padding: "14px 16px",
            }}
          >
            <div style={{ color: "#93c5fd", fontWeight: 700, fontSize: "0.9rem", marginBottom: "8px" }}>
              💡 Exemple concret :
            </div>
            <div style={{ fontStyle: "italic", color: "#cbd5e1", fontSize: "0.88rem", marginBottom: "12px" }}>
              « Permettre à l'utilisateur de rechercher un client et d'afficher ses comptes. »
            </div>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600, marginBottom: "8px" }}>
              Décomposition immédiate en 10 étapes :
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "8px",
              }}
            >
              {[
                "1. Identifier le client",
                "2. Rechercher dans la base",
                "3. Afficher les infos client",
                "4. Charger les comptes",
                "5. Afficher comptes en GRID",
                "6. Gérer aucun résultat",
                "7. Gérer plusieurs résultats",
                "8. Gérer les erreurs",
                "9. Ajouter les contrôles",
                "10. Tester",
              ].map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#090d16",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #1e293b",
                    fontSize: "0.82rem",
                    color: "#e2e8f0",
                    fontWeight: 600,
                  }}
                >
                  <span style={{ color: "#38bdf8", marginRight: "6px" }}>•</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      category: "METHODE",
      title: "2. ⚙️ Structure mentale d'un développement 4GL",
      badge: "Architecture cognitive",
      badgeColor: "#8b5cf6",
      rawText: "Structure mentale d'un développement 4GL BESOIN Analyse fonctionnelle Décomposition sous-tâches Données SQL Traitement 4GL IHM .PER Contrôles Tests RUN",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Enchaînement rigoureux du flux de conception :
          </div>
          <pre
            style={{
              background: "#090d16",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px",
              color: "#38bdf8",
              fontFamily: "monospace",
              fontSize: "0.83rem",
              lineHeight: "1.4",
              overflowX: "auto",
              margin: 0,
            }}
          >{`┌──────────────────────────┐
│          BESOIN          │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│   Analyse fonctionnelle  │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│      Décomposition       │
│      en sous-tâches      │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│       Données / SQL      │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│      Traitement 4GL      │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│         IHM .PER         │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│         Contrôles        │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│       Tests / RUN        │
└──────────────────────────┘`}</pre>
        </div>
      ),
    },
    {
      id: 3,
      category: "IHM",
      title: "3. 🧠 Anatomie d'un écran .PER",
      badge: "Hiérarchie .PER",
      badgeColor: "#10b981",
      rawText: "Anatomie d'un écran .PER SCREEN LAYOUT VBOX HBOX GRID LABEL INPUT BUTTON CHECKBOX RADIO COMBO GROUP FRAME TABLES TABLE",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Pense ton écran comme une hiérarchie stricte de composants emboîtés :
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            <pre
              style={{
                background: "#090d16",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "16px",
                color: "#10b981",
                fontFamily: "monospace",
                fontSize: "0.83rem",
                lineHeight: "1.5",
                margin: 0,
              }}
            >{`SCREEN
 │
 └── LAYOUT
      │
      ├── VBOX
      │    ├── HBOX
      │    │    ├── LABEL
      │    │    ├── INPUT
      │    │    └── BUTTON
      │    │
      │    └── GRID (ou TABLE)
      │
      └── HBOX
           ├── BUTTON
           └── BUTTON`}</pre>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.82rem",
                  color: "#cbd5e1",
                }}
              >
                <thead>
                  <tr style={{ background: "#1e293b", borderBottom: "2px solid #334155" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left", color: "#38bdf8" }}>Composant</th>
                    <th style={{ padding: "8px 12px", textAlign: "left", color: "#38bdf8" }}>Rôle</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["LAYOUT", "Organisation générale du masque"],
                    ["VBOX", "Organisation verticale (empilement en colonne)"],
                    ["HBOX", "Organisation horizontale (alignement en ligne)"],
                    ["GRID", "Tableau de données ou grille matricielle"],
                    ["TABLE", "Tableau défilant multi-lignes (DISPLAY ARRAY)"],
                    ["TABLES", "Section de déclaration des tables SGBD cibles"],
                    ["LABEL", "Texte / libellé fixe"],
                    ["INPUT", "Saisie utilisateur"],
                    ["BUTTON", "Action déclenchable"],
                    ["CHECKBOX", "Oui / Non"],
                    ["RADIO", "Choix unique"],
                    ["COMBO", "Liste déroulante"],
                    ["GROUP", "Regroupement logique"],
                    ["FRAME", "Encadrement visuel"],
                  ].map(([comp, role], i) => (
                    <tr
                      key={comp}
                      style={{
                        background: i % 2 === 0 ? "rgba(15, 23, 42, 0.4)" : "#090d16",
                        borderBottom: "1px solid #1e293b",
                      }}
                    >
                      <td style={{ padding: "6px 12px", fontFamily: "monospace", color: "#f8fafc", fontWeight: 700 }}>
                        {comp}
                      </td>
                      <td style={{ padding: "6px 12px" }}>{role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      category: "IHM",
      title: "4. 🗄️ Le bloc TABLES : rôle, liaison SGBD & alias",
      badge: "Liaison SGBD",
      badgeColor: "#0ea5e9",
      rawText: "TABLES rôle liaison SGBD alias schéma colonnes ATTRIBUTES DATABASE form4gl -4305 typage automatique dictionnaire bkcpt bkcli",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: "1.5" }}>
            La section <strong>TABLES</strong> est la passerelle obligatoire entre le formulaire d&apos;écran (<code>.per</code>) et le schéma de la base de données relationnelle (Informix / Oracle). Elle se situe juste après <code>SCREEN</code> (ou <code>DATABASE</code>) et avant <code>ATTRIBUTES</code>.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {/* Rôle & Fonctionnement */}
            <div
              style={{
                background: "#090d16",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ color: "#38bdf8", fontWeight: 700, fontSize: "0.88rem" }}>
                🎯 Rôles fondamentaux de TABLES :
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.82rem", color: "#cbd5e1", lineHeight: "1.6" }}>
                <li>
                  <strong style={{ color: "#f8fafc" }}>Déclarer les tables sources :</strong> Informe le compilateur (<code>form4gl</code>, <code>fglform</code>) quelles tables fournissent les champs de l&apos;écran.
                </li>
                <li>
                  <strong style={{ color: "#f8fafc" }}>Héritage automatique des types :</strong> Le compilateur extrait directement la taille, le type (<code>CHAR</code>, <code>DECIMAL</code>, <code>DATE</code>...) et les contraintes du SGBD sans devoir les redéclarer manuellement.
                </li>
                <li>
                  <strong style={{ color: "#f8fafc" }}>Évolutivité sans régression :</strong> Si une colonne passe de 8 à 10 caractères en base, une simple recompilation du <code>.per</code> met l&apos;IHM à jour.
                </li>
              </ul>
            </div>

            {/* Exemple .per concret */}
            <div
              style={{
                background: "#090d16",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <div style={{ color: "#10b981", fontWeight: 700, fontSize: "0.88rem", marginBottom: "6px" }}>
                📝 Syntaxe standard dans un .per :
              </div>
              <pre
                style={{
                  background: "#022416",
                  border: "1px solid #065f46",
                  borderRadius: "6px",
                  padding: "12px",
                  color: "#6ee7b7",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  lineHeight: "1.4",
                  margin: 0,
                }}
              >{`DATABASE amplitude
SCREEN
{
 Client : [f001    ] [f002               ]
 Compte : [f003       ] Devise : [f004]
}
TABLES
  bkcli
  bkcpt
ATTRIBUTES
  f001 = bkcli.cli;
  f002 = bkcli.nom;
  f003 = bkcpt.cpt;
  f004 = bkcpt.dev;`}</pre>
            </div>
          </div>

          {/* Alias et Distinction TABLES vs TABLE */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {/* Les Alias */}
            <div
              style={{
                background: "#090d16",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: "0.88rem", marginBottom: "6px" }}>
                🔁 Les Alias de tables (Cas multi-occurrences) :
              </div>
              <p style={{ fontSize: "0.82rem", color: "#cbd5e1", margin: "0 0 10px 0", lineHeight: "1.5" }}>
                Quand un écran manipule deux fois la même table (ex: virement de compte émetteur à compte récepteur), on déclare des alias dans <code>TABLES</code> :
              </p>
              <pre
                style={{
                  background: "#181206",
                  border: "1px solid #78350f",
                  borderRadius: "6px",
                  padding: "10px",
                  color: "#fde68a",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  lineHeight: "1.4",
                  margin: 0,
                }}
              >{`TABLES
  cpt_src = bkcpt,
  cpt_dst = bkcpt
ATTRIBUTES
  f_src = cpt_src.cpt;
  f_dst = cpt_dst.cpt;`}</pre>
            </div>

            {/* Distinction TABLES vs TABLE */}
            <div
              style={{
                background: "#090d16",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <div style={{ color: "#c084fc", fontWeight: 700, fontSize: "0.88rem", marginBottom: "6px" }}>
                ⚖️ Distinction clé : TABLES vs TABLE
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem" }}>
                <div style={{ background: "#1e1b4b", padding: "8px 10px", borderRadius: "6px", border: "1px solid #4338ca" }}>
                  <strong style={{ color: "#a5b4fc" }}>TABLES (avec un S) :</strong> Section déclarative au sommet du <code>.per</code> qui fait le lien avec les tables SGBD.
                </div>
                <div style={{ background: "#064e3b", padding: "8px 10px", borderRadius: "6px", border: "1px solid #059669" }}>
                  <strong style={{ color: "#6ee7b7" }}>TABLE (sans S) :</strong> Composant visuel Genero dans le <code>LAYOUT</code> pour afficher un tableau défilant (<code>DISPLAY ARRAY</code>).
                </div>
              </div>
            </div>
          </div>

          {/* Erreur classique */}
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "8px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>⚠️</span>
            <div style={{ fontSize: "0.85rem", color: "#fecaca" }}>
              <strong>Erreur fréquente (-4305) :</strong> Si tu utilises un champ <code>f010 = bkcom.com;</code> dans <code>ATTRIBUTES</code> sans avoir listé <code>bkcom</code> dans la section <code>TABLES</code>, le compilateur échoue immédiatement avec : <em>&quot;Table not in TABLES statement&quot;</em>.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      category: "IHM",
      title: "5. 📐 VBOX vs HBOX",
      badge: "Mise en page",
      badgeColor: "#0284c7",
      rawText: "VBOX vs HBOX empile composants verticalement place composants horizontalement colonne ligne Nom Prénom Téléphone Email Client Rechercher",
      content: (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {/* VBOX */}
          <div
            style={{
              background: "#090d16",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span
                style={{
                  background: "#0284c7",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                VBOX
              </span>
              <span style={{ fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600 }}>
                Empile verticalement
              </span>
            </div>
            <pre
              style={{
                color: "#38bdf8",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                lineHeight: "1.4",
                margin: "0 0 10px 0",
              }}
            >{`VBOX
 ├── Nom
 ├── Prénom
 ├── Téléphone
 └── Email`}</pre>
            <div
              style={{
                background: "#021327",
                border: "1px dashed #0284c7",
                borderRadius: "6px",
                padding: "10px",
                fontSize: "0.8rem",
                color: "#94a3b8",
                lineHeight: "1.6",
                fontFamily: "monospace",
              }}
            >
              Nom&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[____________]<br />
              Prénom&nbsp;&nbsp;&nbsp;&nbsp;[____________]<br />
              Téléphone&nbsp;[____________]<br />
              Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[____________]
            </div>
            <div style={{ marginTop: "8px", fontSize: "0.82rem", color: "#38bdf8", fontWeight: 700 }}>
              👉 À utiliser pour construire une colonne.
            </div>
          </div>

          {/* HBOX */}
          <div
            style={{
              background: "#090d16",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span
                style={{
                  background: "#10b981",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                HBOX
              </span>
              <span style={{ fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600 }}>
                Place horizontalement
              </span>
            </div>
            <pre
              style={{
                color: "#10b981",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                lineHeight: "1.4",
                margin: "0 0 10px 0",
              }}
            >{`HBOX
 ├── LABEL
 ├── INPUT
 └── BUTTON`}</pre>
            <div
              style={{
                background: "#022416",
                border: "1px dashed #10b981",
                borderRadius: "6px",
                padding: "14px 10px",
                fontSize: "0.8rem",
                color: "#94a3b8",
                lineHeight: "1.6",
                fontFamily: "monospace",
              }}
            >
              Client : [____________] [Rechercher]
            </div>
            <div style={{ marginTop: "8px", fontSize: "0.82rem", color: "#10b981", fontWeight: 700 }}>
              👉 À utiliser pour construire une ligne.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      category: "IHM",
      title: "6. 🏗️ Pattern d'écran classique",
      badge: "Standard CBS",
      badgeColor: "#f59e0b",
      rawText: "Pattern d'écran classique application CBS TITRE ÉCRAN CRITÈRES DE RECHERCHE RÉSULTATS Compte Devise Solde Valider Annuler VBOX HBOX GRID",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Pour une application CBS, garde constamment ce pattern en tête :
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "16px",
            }}
          >
            <pre
              style={{
                background: "#090d16",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "16px",
                color: "#fbbf24",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                lineHeight: "1.35",
                margin: 0,
              }}
            >{`┌──────────────────────────────────────────────┐
│              TITRE ÉCRAN                    │
├──────────────────────────────────────────────┤
│ CRITÈRES DE RECHERCHE                       │
│                                              │
│ Client : [____________] [Rechercher]         │
│                                              │
├──────────────────────────────────────────────┤
│ RÉSULTATS                                    │
│                                              │
│ ┌──────────┬──────────┬───────────────┐      │
│ │ Compte   │ Devise   │ Solde         │      │
│ ├──────────┼──────────┼───────────────┤      │
│ │ 001234   │ XOF      │ 500 000       │      │
│ │ 001235   │ XOF      │ 150 000       │      │
│ └──────────┴──────────┴───────────────┘      │
│                                              │
├──────────────────────────────────────────────┤
│              [Valider] [Annuler]             │
└──────────────────────────────────────────────┘`}</pre>

            <div
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <div style={{ color: "#38bdf8", fontWeight: 700, fontSize: "0.9rem" }}>
                Structure mentale de l'écran :
              </div>
              <pre
                style={{
                  background: "#090d16",
                  padding: "12px",
                  borderRadius: "6px",
                  color: "#cbd5e1",
                  fontFamily: "monospace",
                  fontSize: "0.84rem",
                  margin: 0,
                  lineHeight: "1.5",
                }}
              >{`VBOX
│
├── HBOX → Critères de recherche
│
├── GRID → Résultats (tableau)
│
└── HBOX → Boutons d'actions`}</pre>
              <div
                style={{
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  color: "#fde68a",
                  fontWeight: 600,
                }}
              >
                🔥 Ce pattern va te servir dans plus de 80% des écrans bancaires.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      category: "GRID",
      title: "7. 📊 GRID : le composant à maîtriser",
      badge: "Collection de données",
      badgeColor: "#ec4899",
      rawText: "GRID le composant à maîtriser collection de données comptes client numéro type devise solde statut répétitives tableau",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
            Une <strong>GRID</strong> représente une collection ordonnée de données.
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {/* Arborescence & Métier */}
            <div
              style={{
                background: "#090d16",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "#f472b6", fontWeight: 700, marginBottom: "8px" }}>
                Exemple métier : Comptes d'un client
              </div>
              <pre
                style={{
                  color: "#f472b6",
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  lineHeight: "1.4",
                  margin: "0 0 14px 0",
                }}
              >{`GRID
 ├── Numéro compte
 ├── Type compte
 ├── Devise
 ├── Solde
 └── Statut`}</pre>
              <div
                style={{
                  borderTop: "1px solid #1e293b",
                  paddingTop: "10px",
                  fontSize: "0.82rem",
                  color: "#94a3b8",
                  lineHeight: "1.6",
                }}
              >
                <div style={{ color: "#38bdf8", fontWeight: 700, marginBottom: "4px" }}>
                  MÉMO EXPRESS :
                </div>
                <div>• <strong>GRID</strong> = Données répétitives / Liste d'objets</div>
                <div>• <strong>INPUT</strong> = Une donnée unique</div>
                <div>• <strong>FORM</strong> = Données d'un seul objet</div>
              </div>
            </div>

            {/* Questions avant création */}
            <div
              style={{
                background: "#090d16",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "#38bdf8", fontWeight: 700, marginBottom: "8px" }}>
                Avant de créer la GRID, pose-toi ce tunnel de questions :
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  color: "#e2e8f0",
                }}
              >
                <div style={{ background: "#1e293b", padding: "4px 10px", borderRadius: "4px", width: "100%", textAlign: "center" }}>
                  Quelle source de données ?
                </div>
                <span style={{ color: "#64748b" }}>↓</span>
                <div style={{ background: "#1e293b", padding: "4px 10px", borderRadius: "4px", width: "100%", textAlign: "center" }}>
                  Quelle requête SQL ?
                </div>
                <span style={{ color: "#64748b" }}>↓</span>
                <div style={{ background: "#1e293b", padding: "4px 10px", borderRadius: "4px", width: "100%", textAlign: "center" }}>
                  Quel dataset / tableau dynamique ?
                </div>
                <span style={{ color: "#64748b" }}>↓</span>
                <div style={{ background: "#1e293b", padding: "4px 10px", borderRadius: "4px", width: "100%", textAlign: "center" }}>
                  Quelles colonnes afficher ?
                </div>
                <span style={{ color: "#64748b" }}>↓</span>
                <div style={{ background: "#1e293b", padding: "4px 10px", borderRadius: "4px", width: "100%", textAlign: "center" }}>
                  Quel format de masquage / monétaire ?
                </div>
                <span style={{ color: "#64748b" }}>↓</span>
                <div style={{ background: "#065f46", color: "#34d399", padding: "4px 10px", borderRadius: "4px", width: "100%", textAlign: "center", fontWeight: 700 }}>
                  Quelle sélection utilisateur ? (mono / multi)
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      category: "IHM",
      title: "8. 🧱 Pattern Recherche + GRID",
      badge: "Écran type par excellence",
      badgeColor: "#6366f1",
      rawText: "Pattern Recherche + GRID VBOX HBOX Client Rechercher GRID ID NOM TYPE STATUT Consulter Fermer",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            C'est probablement l'un des écrans que tu utiliseras et concevras le plus en CBS :
          </div>
          <pre
            style={{
              background: "#090d16",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px",
              color: "#a5b4fc",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              lineHeight: "1.5",
              margin: 0,
            }}
          >{`VBOX
│
├── HBOX
│    ├── LABEL "Client"
│    ├── INPUT
│    └── BUTTON "Rechercher"
│
├── GRID
│    ├── ID
│    ├── NOM
│    ├── TYPE
│    └── STATUT
│
└── HBOX
     ├── BUTTON "Consulter"
     └── BUTTON "Fermer"`}</pre>
        </div>
      ),
    },
    {
      id: 9,
      category: "TRAITEMENT",
      title: "9. 🧠 Séparer IHM et traitement",
      badge: "Architecture propre",
      badgeColor: "#14b8a6",
      rawText: "Séparer IHM et traitement erreur à éviter écran SQL directement partout traitement mélangé IHM action traitement 4GL SQL données résultat onSearch validateInput loadCustomer loadAccounts populateGrid",
      content: (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Mauvaise pratique */}
          <div
            style={{
              background: "#1c1117",
              border: "1px solid #7f1d1d",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div style={{ color: "#f87171", fontWeight: 700, fontSize: "0.88rem", marginBottom: "8px" }}>
              ❌ Erreur fatale à éviter :
            </div>
            <pre
              style={{
                color: "#fca5a5",
                fontFamily: "monospace",
                fontSize: "0.82rem",
                lineHeight: "1.4",
                margin: 0,
              }}
            >{`Écran
  ↓
SQL directement partout
  ↓
Traitement mélangé à l'IHM
  ↓
Code spaghetti & impossible à maintenir`}</pre>
          </div>

          {/* Bonne pratique */}
          <div
            style={{
              background: "#06221b",
              border: "1px solid #065f46",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div style={{ color: "#34d399", fontWeight: 700, fontSize: "0.88rem", marginBottom: "8px" }}>
              ✅ Préférer le découplage strict :
            </div>
            <pre
              style={{
                color: "#6ee7b7",
                fontFamily: "monospace",
                fontSize: "0.82rem",
                lineHeight: "1.4",
                margin: "0 0 10px 0",
              }}
            >{`IHM
  ↓
Action utilisateur
  ↓
Traitement 4GL (Contrôleur)
  ↓
SQL / Données (Persistance)
  ↓
Résultat structuré
  ↓
Mise à jour IHM`}</pre>
            <div
              style={{
                background: "#022c22",
                padding: "8px 10px",
                borderRadius: "6px",
                fontSize: "0.78rem",
                color: "#a7f3d0",
                fontFamily: "monospace",
              }}
            >
              [Rechercher] → onSearch() → validateInput() → loadCustomer() → loadAccounts() → populateGrid()
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      category: "TRAITEMENT",
      title: "10. 🔄 Cycle d'un écran",
      badge: "Cycle de vie",
      badgeColor: "#64748b",
      rawText: "Cycle d'un écran OPEN INITIALISATION SAISIE VALIDATION TRAITEMENT CHARGEMENT DONNEES AFFICHAGE ACTION UTILISATEUR VALIDATION MISE A JOUR REFRESH",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Retenir l'ordre séquentiel d'exécution d'un écran interactif 4GL / Genero :
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
              background: "#090d16",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px",
              fontFamily: "monospace",
              fontSize: "0.82rem",
              fontWeight: 700,
            }}
          >
            {[
              { label: "OPEN", color: "#38bdf8" },
              { label: "INITIALISATION", color: "#38bdf8" },
              { label: "SAISIE", color: "#facc15" },
              { label: "VALIDATION", color: "#facc15" },
              { label: "TRAITEMENT", color: "#c084fc" },
              { label: "CHARGEMENT DONNÉES", color: "#c084fc" },
              { label: "AFFICHAGE", color: "#34d399" },
              { label: "ACTION UTILISATEUR", color: "#facc15" },
              { label: "VALIDATION", color: "#facc15" },
              { label: "MISE À JOUR", color: "#fb923c" },
              { label: "REFRESH", color: "#38bdf8" },
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <span
                  style={{
                    background: "#1e293b",
                    color: step.color,
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: `1px solid ${step.color}40`,
                  }}
                >
                  {step.label}
                </span>
                {idx < arr.length - 1 && <span style={{ color: "#64748b" }}>→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 11,
      category: "METHODE",
      title: "11. 🧪 Contrôles IHM",
      badge: "Validation défensive",
      badgeColor: "#e11d48",
      rawText: "Contrôles IHM obligatoire format longueur domaine cohérence existence client montant date agence statut",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Pour chaque champ de l'écran, appliquer systématiquement cette grille de 6 contrôles :
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              { label: "Obligatoire ?", detail: "Client obligatoire", icon: "⚠️", bg: "rgba(225, 29, 72, 0.15)", border: "#e11d48" },
              { label: "Format ?", detail: "Date → jj/mm/aaaa, Montant → numérique, Compte → format compte (11 chiffres)", icon: "🔢", bg: "rgba(59, 130, 246, 0.15)", border: "#3b82f6" },
              { label: "Longueur ?", detail: "Code agence → X caractères stricts (ex: 5 char)", icon: "📏", bg: "rgba(234, 179, 8, 0.15)", border: "#eab308" },
              { label: "Domaine ?", detail: "Statut ∈ {ACTIF, BLOQUÉ, CLOS}", icon: "🎯", bg: "rgba(168, 85, 247, 0.15)", border: "#a855f7" },
              { label: "Cohérence ?", detail: "Date début <= Date fin, Montant débit <= Plafond", icon: "⚖️", bg: "rgba(16, 185, 129, 0.15)", border: "#10b981" },
              { label: "Existence ?", detail: "Le client existe-t-il dans BKCLI ? Le compte existe-t-il dans BKCPT ?", icon: "🔍", bg: "rgba(14, 165, 233, 0.15)", border: "#0ea5e9" },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  borderRadius: "8px",
                  padding: "12px 14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <span>{c.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#f8fafc" }}>
                    {c.label}
                  </span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: "1.4" }}>
                  {c.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 12,
      category: "TRAITEMENT",
      title: "12. 🗃️ Mémo SQL → 4GL",
      badge: "Requêtes & Logique",
      badgeColor: "#d97706",
      rawText: "Mémo SQL 4GL Quelles tables clé champs condition JOIN résultat sans résultat plusieurs résultats transaction rollback SELECT IF ELSE",
      content: (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {/* 10 questions */}
          <div
            style={{
              background: "#090d16",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div style={{ fontSize: "0.88rem", color: "#f59e0b", fontWeight: 700, marginBottom: "10px" }}>
              Quand tu dois développer un traitement :
            </div>
            <ol
              style={{
                margin: 0,
                paddingLeft: "20px",
                fontSize: "0.82rem",
                color: "#cbd5e1",
                lineHeight: "1.6",
              }}
            >
              <li>Quelles tables ? (BKCLI, BKCPT, BKSOL...)</li>
              <li>Quelle clé primaire / étrangère ?</li>
              <li>Quels champs nécessaires ?</li>
              <li>Quelle condition WHERE ?</li>
              <li>Quel JOIN ? (INNER vs LEFT)</li>
              <li>Quel résultat attendu ?</li>
              <li>Quel cas sans résultat ? (NOTFOUND / 100)</li>
              <li>Quel cas plusieurs résultats ? (Curseur FOREACH)</li>
              <li>Quelle transaction ? (BEGIN WORK)</li>
              <li>Quel rollback ? (Gestion ROLLBACK WORK)</li>
            </ol>
          </div>

          {/* Pattern mental */}
          <div
            style={{
              background: "#090d16",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "0.88rem", color: "#38bdf8", fontWeight: 700, marginBottom: "8px" }}>
              Pattern mental 4GL :
            </div>
            <pre
              style={{
                background: "#021327",
                border: "1px solid #0284c7",
                borderRadius: "6px",
                padding: "12px",
                color: "#7dd3fc",
                fontFamily: "monospace",
                fontSize: "0.83rem",
                lineHeight: "1.5",
                margin: 0,
              }}
            >{`INPUT (Saisie)
  ↓
VALIDATION (Contrôle)
  ↓
SELECT ... INTO ... FROM ...
  ↓
IF sqlca.sqlcode = 0 THEN
    traitement nominal
ELSE
    affichage message métier (ex: "Client non trouvé")
END IF`}</pre>
          </div>
        </div>
      ),
    },
    {
      id: 13,
      category: "TRANSACTION",
      title: "13. 🔐 Transaction",
      badge: "Intégrité financière",
      badgeColor: "#dc2626",
      rawText: "Transaction BEGIN UPDATE INSERT DELETE COMMIT ROLLBACK Qu'est-ce qui se passe si le traitement s'arrête juste avant le COMMIT intégrité bancaire",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "14px",
            }}
          >
            {/* Cas nominal */}
            <div
              style={{
                background: "#06221b",
                border: "1px solid #065f46",
                borderRadius: "8px",
                padding: "14px",
              }}
            >
              <div style={{ color: "#34d399", fontWeight: 700, fontSize: "0.85rem", marginBottom: "8px" }}>
                Pour une opération de mise à jour (Nominal) :
              </div>
              <pre
                style={{
                  color: "#a7f3d0",
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  lineHeight: "1.4",
                  margin: 0,
                }}
              >{`BEGIN WORK
   ↓
Validation des données
   ↓
UPDATE / INSERT / DELETE
   ↓
Contrôle sqlca.sqlcode = 0
   ↓
COMMIT WORK`}</pre>
            </div>

            {/* Cas erreur */}
            <div
              style={{
                background: "#200b0f",
                border: "1px solid #991b1b",
                borderRadius: "8px",
                padding: "14px",
              }}
            >
              <div style={{ color: "#f87171", fontWeight: 700, fontSize: "0.85rem", marginBottom: "8px" }}>
                En cas d'anomalie (Rollback) :
              </div>
              <pre
                style={{
                  color: "#fca5a5",
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  lineHeight: "1.4",
                  margin: 0,
                }}
              >{`BEGIN WORK
   ↓
UPDATE / INSERT
   ↓
ERREUR DÉTECTÉE (sqlcode != 0)
   ↓
ROLLBACK WORK`}</pre>
            </div>
          </div>

          <div
            style={{
              background: "rgba(220, 38, 38, 0.15)",
              border: "1px solid #ef4444",
              borderRadius: "8px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>🔥</span>
            <div style={{ fontSize: "0.9rem", color: "#fecaca" }}>
              <strong>Règle d'or CBS :</strong> Toujours se poser la question :{" "}
              <em>« Qu'est-ce qui se passe si le serveur crash ou si le traitement s'arrête brutalement juste avant le COMMIT ? »</em>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 14,
      category: "TRANSACTION",
      title: "14. 🧯 Gestion des erreurs",
      badge: "Résilience RUN",
      badgeColor: "#ea580c",
      rawText: "Gestion des erreurs technique fonctionnelle inexistante invalide droit insuffisant timeout DB indisponible interrompue TRY CATCH ROLLBACK LOG",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "8px" }}>
              Toujours prévoir et intercepter ces 8 familles d'incidents :
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "8px",
              }}
            >
              {[
                { name: "Erreur technique", icon: "⚙️" },
                { name: "Erreur fonctionnelle", icon: "📑" },
                { name: "Donnée inexistante", icon: "🔎" },
                { name: "Donnée invalide", icon: "🚫" },
                { name: "Droit insuffisant", icon: "🔒" },
                { name: "Timeout réseau / DB", icon: "⏱️" },
                { name: "DB indisponible", icon: "🗄️" },
                { name: "Transaction interrompue", icon: "⚡" },
              ].map((err, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#090d16",
                    border: "1px solid #1e293b",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "0.82rem",
                    color: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>{err.icon}</span>
                  <span>{err.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#090d16",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div style={{ fontSize: "0.88rem", color: "#fb923c", fontWeight: 700, marginBottom: "8px" }}>
              Pattern de résilience universel :
            </div>
            <pre
              style={{
                color: "#fed7aa",
                fontFamily: "monospace",
                fontSize: "0.83rem",
                lineHeight: "1.4",
                margin: 0,
              }}
            >{`WHENEVER ERROR CONTINUE   (ou bloc TRY)
   ↓
Traitement bancaire
   ↓
IF sqlca.sqlcode < 0 THEN
   ↓
   CALL log_system_error(sqlca.sqlcode)
   ↓
   ROLLBACK WORK (si transaction active)
   ↓
   CALL afficher_message_utilisateur("Anomalie rencontrée, rollback effectué")
   ↓
   EXIT / RETURN
END IF`}</pre>
          </div>
        </div>
      ),
    },
    {
      id: 15,
      category: "GRID",
      title: "15. 🧠 GRID : questions à se poser (Checklist)",
      badge: "Checklist interactive",
      badgeColor: "#06b6d4",
      rawText: "GRID questions à se poser checklist pagination tri filtre sélection double clic modification suppression rafraîchissement 0 1 N résultats",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Coche chaque point avant de valider la conception de ta GRID :
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "8px",
            }}
          >
            {Object.entries(gridChecklist).map(([question, isChecked]) => (
              <label
                key={question}
                onClick={() => toggleChecklistItem(question)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: isChecked ? "rgba(6, 182, 212, 0.15)" : "#090d16",
                  border: isChecked ? "1px solid #06b6d4" : "1px solid #1e293b",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  color: isChecked ? "#67e8f9" : "#cbd5e1",
                  transition: "all 0.15s ease",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  style={{ accentColor: "#06b6d4", cursor: "pointer" }}
                />
                <span style={{ fontWeight: isChecked ? 700 : 500 }}>{question}</span>
              </label>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 16,
      category: "METHODE",
      title: "16. 🖥️ Conception d'écran : méthode rapide",
      badge: "Cas pratique",
      badgeColor: "#a855f7",
      rawText: "Conception d'écran méthode rapide consulter comptes client Objet Entrées Actions Sorties Architecture IHM Traitement VBOX HBOX GRID",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              background: "rgba(168, 85, 247, 0.1)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "0.88rem",
              color: "#e9d5ff",
            }}
          >
            Quand on te donne le besoin : <em>« Ajouter un écran permettant de consulter les comptes d'un client »</em>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "10px",
            }}
          >
            {[
              { etape: "Étape 1 — Objet", desc: "Écran consultation comptes client" },
              { etape: "Étape 2 — Entrées", desc: "Numéro client (CLI)" },
              { etape: "Étape 3 — Actions", desc: "Rechercher, Consulter, Fermer" },
              { etape: "Étape 4 — Sorties", desc: "GRID comptes (CPT, SOLDE, DEV)" },
            ].map((e, i) => (
              <div
                key={i}
                style={{
                  background: "#090d16",
                  border: "1px solid #1e293b",
                  padding: "10px 12px",
                  borderRadius: "6px",
                }}
              >
                <div style={{ color: "#c084fc", fontWeight: 700, fontSize: "0.8rem", marginBottom: "2px" }}>
                  {e.etape}
                </div>
                <div style={{ color: "#f8fafc", fontSize: "0.82rem", fontWeight: 600 }}>
                  {e.desc}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "12px",
            }}
          >
            <div
              style={{
                background: "#090d16",
                border: "1px solid #1e293b",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div style={{ color: "#38bdf8", fontWeight: 700, fontSize: "0.82rem", marginBottom: "6px" }}>
                Étape 5 — Architecture IHM (.per) :
              </div>
              <pre
                style={{
                  color: "#93c5fd",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  margin: 0,
                  lineHeight: "1.4",
                }}
              >{`VBOX
│
├── HBOX (LABEL, INPUT, BUTTON)
│
├── GRID (ou TABLE)
│
└── HBOX (BUTTON, BUTTON)`}</pre>
            </div>

            <div
              style={{
                background: "#090d16",
                border: "1px solid #1e293b",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div style={{ color: "#34d399", fontWeight: 700, fontSize: "0.82rem", marginBottom: "6px" }}>
                Étape 6 — Flux de Traitement 4GL :
              </div>
              <pre
                style={{
                  color: "#6ee7b7",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  margin: 0,
                  lineHeight: "1.4",
                }}
              >{`INPUT (Numéro client)
  ↓
Validation (Vérifier format & non vide)
  ↓
SELECT client (Existence BKCLI)
  ↓
SELECT comptes (Curseur BKCPT)
  ↓
Populate GRID`}</pre>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 17,
      category: "IHM",
      title: "17. 🧩 Layout : règle d'or",
      badge: "Clarté structurelle",
      badgeColor: "#059669",
      rawText: "Layout règle d'or structure logique écran Layout principal VBox Header Recherche HBox Résultats Grid Actions HBox maintenable",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              background: "#090d16",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div style={{ color: "#f87171", fontSize: "0.85rem", textDecoration: "line-through" }}>
                « Où dois-je poser chaque champ et composant ? »
              </div>
              <div style={{ color: "#34d399", fontSize: "0.95rem", fontWeight: 700, marginTop: "4px" }}>
                👉 « Quelle est la structure logique emboîtée de mon écran ? »
              </div>
            </div>
          </div>

          <pre
            style={{
              background: "#090d16",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              padding: "16px",
              color: "#6ee7b7",
              fontFamily: "monospace",
              fontSize: "0.83rem",
              lineHeight: "1.45",
              margin: 0,
            }}
          >{`Écran
│
└── Layout principal
     │
     └── VBox
          │
          ├── Header (Informations synthétiques)
          │
          ├── Recherche (Zone de filtres)
          │    └── HBox
          │
          ├── Résultats (Collection)
          │    └── Grid (ou Table)
          │
          └── Actions (Boutons opérationnels)
               └── HBox`}</pre>
        </div>
      ),
    },
    {
      id: 18,
      category: "METHODE",
      title: "18. ⚡ LA MÉTHODE À RETENIR",
      badge: "Le Décalogue CBS",
      badgeColor: "#eab308",
      rawText: "LA MÉTHODE À RETENIR COMPRENDRE DÉCOMPOSER DONNÉES TRAITEMENT IHM STRUCTURE CONTRÔLES TRANSACTION ERREURS TEST modèle de données flux TABLES",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ fontSize: "0.85rem", color: "#fde047", fontWeight: 700 }}>
            Quand on te donne n'importe quel besoin 4GL / Amplitude, déroule les 10 commandements :
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "8px",
            }}
          >
            {[
              { num: "①", title: "COMPRENDRE", desc: "Quel est le besoin métier exact ?" },
              { num: "②", title: "DÉCOMPOSER", desc: "Quelles sous-tâches unitaires ?" },
              { num: "③", title: "DONNÉES", desc: "Tables / champs / relations / bloc TABLES ?" },
              { num: "④", title: "TRAITEMENT", desc: "Quel algorithme 4GL ?" },
              { num: "⑤", title: "IHM", desc: "Quels INPUT, BUTTON, GRID, TABLE ?" },
              { num: "⑥", title: "STRUCTURE", desc: "LAYOUT → VBOX, HBOX, GRID" },
              { num: "⑦", title: "CONTRÔLES", desc: "Validation / droits / formats" },
              { num: "⑧", title: "TRANSACTION", desc: "COMMIT / ROLLBACK" },
              { num: "⑨", title: "ERREURS", desc: "Technique / métier" },
              { num: "⑩", title: "TEST", desc: "Nominal / limite / concurrence" },
            ].map((cmd, i) => (
              <div
                key={i}
                style={{
                  background: "#090d16",
                  border: "1px solid #1e293b",
                  padding: "10px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <span style={{ color: "#facc15", fontWeight: 900, fontSize: "1rem" }}>{cmd.num}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#f8fafc" }}>
                    {cmd.title}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                    {cmd.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #1e1b4b, #0f172a)",
              border: "2px solid #6366f1",
              borderRadius: "10px",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#c7d2fe", fontWeight: 800, fontSize: "0.95rem" }}>
              <span>🧠</span>
              <span>ET SURTOUT, LA RÈGLE SUPRÊME :</span>
            </div>
            <div style={{ color: "#ef4444", fontWeight: 800, fontSize: "0.92rem" }}>
              Ne jamais commencer par écrire le code 4GL.
            </div>
            <div style={{ color: "#cbd5e1", fontSize: "0.88rem", lineHeight: "1.5" }}>
              Commence toujours par :{" "}
              <strong style={{ color: "#38bdf8" }}>
                Besoin → Modèle de données &amp; TABLES → Flux → Traitement → IHM → Code → Tests.
              </strong>
            </div>
            <div style={{ color: "#a5b4fc", fontSize: "0.82rem", fontStyle: "italic", marginTop: "4px" }}>
              « C'est exactement le réflexe qui va te faire passer de "je sais coder" à "je sais concevoir une évolution bancaire CBS". »
            </div>
          </div>
        </div>
      ),
    },
  ], [gridChecklist]);

  // Filtrage
  const filteredSections = useMemo(() => {
    return sections.filter((s) => {
      const matchCategory = selectedCategory === "ALL" || s.category === selectedCategory;
      const matchSearch =
        searchTerm === "" ||
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rawText.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [sections, selectedCategory, searchTerm]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* BANNIÈRE HERO ANTISÈCHE */}
      <div
        style={{
          background: "linear-gradient(135deg, #091328 0%, #0f172a 50%, #1e1b4b 100%)",
          border: "1px solid #38bdf8",
          borderRadius: "14px",
          padding: "24px 28px",
          boxShadow: "0 8px 30px rgba(56, 189, 248, 0.15)",
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
                background: "#0284c7",
                color: "#ffffff",
                padding: "3px 10px",
                borderRadius: "6px",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              ANTISÈCHE OFFICIELLE DU CONCEPTEUR
            </span>
            <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>
              18 Règles Pratiques • Du Besoin aux Tests
            </span>
          </div>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0" }}>
            🧠 Fiche Mémo — 4GL CBS &amp; IHM .PER
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#cbd5e1", margin: 0, lineHeight: "1.5" }}>
            L&apos;antisèche de conception opérationnelle : dès qu&apos;on te confie une évolution bancaire, ouvre cette fiche pour dérouler immédiatement <strong>Analyse → Données &amp; TABLES → 4GL → Écran .per → Contrôles → Tests</strong>.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              const fullText = sections.map((s) => `${s.title}\n${s.rawText}`).join("\n\n");
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
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.15s ease",
            }}
          >
            <span>{copiedId === 9999 ? "✓ Copiée !" : "📋 Copier l'intégrale"}</span>
          </button>
        </div>
      </div>

      {/* BARRE D'OUTILS : RECHERCHE ET FILTRES THÉMATIQUES */}
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
          <span style={{ position: "absolute", left: "14px", top: "12px", color: "#38bdf8", fontSize: "1rem" }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Rechercher une notion (ex: TABLES, TABLE, VBOX, HBOX, GRID, COMMIT, ROLLBACK, SELECT, onSearch...)"
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

        {/* Filtres thématiques */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          {[
            { id: "ALL", label: `Toutes les notions (${sections.length})` },
            { id: "METHODE", label: "🧩 Méthode & Décomposition" },
            { id: "IHM", label: "🖥️ Écrans .PER & Layout" },
            { id: "GRID", label: "📊 Composant GRID & TABLE" },
            { id: "TRAITEMENT", label: "⚙️ Traitement & SQL" },
            { id: "TRANSACTION", label: "🔐 Transactions & Erreurs" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? "#0284c7" : "#0f172a",
                border: selectedCategory === cat.id ? "1px solid #38bdf8" : "1px solid #334155",
                color: selectedCategory === cat.id ? "#ffffff" : "#94a3b8",
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* SOMMAIRE RAPIDE DE NAVIGATION */}
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
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#section-${s.id}`}
            suppressHydrationWarning
            style={{
              fontSize: "0.75rem",
              color: "#38bdf8",
              textDecoration: "none",
              background: "#1e293b",
              padding: "3px 8px",
              borderRadius: "4px",
              border: "1px solid #334155",
              display: "inline-block",
            }}
          >
            {s.id}. {s.title.split(":")[0].replace(/^\d+\.\s*/, "").replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu, "").trim()}
          </a>
        ))}
      </div>

      {/* LISTE DES SECTIONS AFFICHÉES */}
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {filteredSections.map((section) => (
          <div
            key={section.id}
            id={`section-${section.id}`}
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
            {/* Header de la section */}
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
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                  {section.title}
                </h3>
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

            {/* Contenu */}
            <div>{section.content}</div>
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
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#f1f5f9" }}>
              Aucun résultat pour « {searchTerm} »
            </div>
            <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
              Essayez un autre mot-clé comme TABLES, TABLE, VBOX, HBOX, GRID, COMMIT, ROLLBACK ou SELECT.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

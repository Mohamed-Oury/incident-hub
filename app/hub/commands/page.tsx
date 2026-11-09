"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/modules/layout/AppShell";
import {
  SERVER_COMMANDS_INTRO,
  SERVER_COMMAND_SECTIONS,
  PRACTICAL_CASE_KEY_SALT,
  PASSWORD_ENCRYPTION_JAR,
  ServerCommandItem,
  CommandSection,
} from "@/data/server-commands";
import {
  Terminal,
  Search,
  Copy,
  Check,
  ShieldAlert,
  KeyRound,
  FileCode,
  Sparkles,
  Server,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Lock,
  Download,
  CreditCard,
  Radio,
  FileCheck2,
  Clock,
  Flame,
} from "lucide-react";

export default function ServerCommandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<"ALL" | "MONETIQUE_EXPERT" | "SYSTEM_LINUX">("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Copie dans le presse-papier avec feedback
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Basculer l'état plié/déplié d'une section
  const toggleSection = (sectionNumber: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionNumber]: !prev[sectionNumber],
    }));
  };

  // Filtrage des commandes
  const filteredSections = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();

    return SERVER_COMMAND_SECTIONS.map((sec) => {
      // Filtrage par domaine
      if (selectedDomain !== "ALL" && sec.domainGroup !== selectedDomain) {
        return { ...sec, items: [] };
      }

      // Filtrage par catégorie
      const isCategoryMatch = selectedCategory === "ALL" || sec.categoryKey === selectedCategory;
      if (!isCategoryMatch) {
        return { ...sec, items: [] };
      }

      const filteredItems = sec.items.filter((item) => {
        if (!q) return true;
        return (
          item.command.toLowerCase().includes(q) ||
          item.utility.toLowerCase().includes(q) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(q))) ||
          (item.tips && item.tips.toLowerCase().includes(q)) ||
          item.sectionTitle.toLowerCase().includes(q)
        );
      });

      return { ...sec, items: filteredItems };
    }).filter((sec) => sec.items.length > 0);
  }, [searchTerm, selectedDomain, selectedCategory]);

  const totalCommandCount = useMemo(() => {
    return SERVER_COMMAND_SECTIONS.reduce((acc, s) => acc + s.items.length, 0);
  }, []);

  const monetiqueCount = useMemo(() => {
    return SERVER_COMMAND_SECTIONS.filter((s) => s.domainGroup === "MONETIQUE_EXPERT").reduce(
      (acc, s) => acc + s.items.length,
      0
    );
  }, []);

  const linuxCount = useMemo(() => {
    return SERVER_COMMAND_SECTIONS.filter((s) => s.domainGroup === "SYSTEM_LINUX").reduce(
      (acc, s) => acc + s.items.length,
      0
    );
  }, []);

  const showPracticalCase =
    (selectedDomain === "ALL" || selectedDomain === "SYSTEM_LINUX") &&
    (selectedCategory === "ALL" ||
      selectedCategory === "CAS_PRATIQUE" ||
      (searchTerm.length > 0 &&
        (PRACTICAL_CASE_KEY_SALT.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          PRACTICAL_CASE_KEY_SALT.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          PRACTICAL_CASE_KEY_SALT.recommendation.command.toLowerCase().includes(searchTerm.toLowerCase()))));

  const showJarSection =
    (selectedDomain === "ALL" || selectedDomain === "SYSTEM_LINUX") &&
    (selectedCategory === "ALL" ||
      selectedCategory === "ENCRYPTION" ||
      (searchTerm.length > 0 &&
        (PASSWORD_ENCRYPTION_JAR.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          PASSWORD_ENCRYPTION_JAR.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          PASSWORD_ENCRYPTION_JAR.command.toLowerCase().includes(searchTerm.toLowerCase()))));

  return (
    <AppShell
      pageTitle="Commandes Utiles & Runbook Monétique"
      eyebrow="CLI RUN & ANALYSE D'INCIDENTS"
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "4rem" }}>
        
        {/* HERO / BANNIÈRE D'INTRODUCTION */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            borderRadius: "16px",
            padding: "1.75rem 2rem",
            marginBottom: "1.75rem",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "180px",
              height: "180px",
              background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", position: "relative" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "12px",
                background: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#38bdf8",
                flexShrink: 0,
              }}
            >
              <Terminal size={26} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                <h1
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "#f8fafc",
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {SERVER_COMMANDS_INTRO.title}
                </h1>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#34d399",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  Boîte à Outils Expert Monétique &amp; Run
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#94a3b8",
                  }}
                >
                  {totalCommandCount} commandes de référence
                </span>
              </div>

              <p
                style={{
                  fontSize: "0.93rem",
                  color: "#cbd5e1",
                  lineHeight: 1.6,
                  margin: "0 0 0.85rem 0",
                  maxWidth: "980px",
                }}
              >
                {SERVER_COMMANDS_INTRO.description}
              </p>

              <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", fontSize: "0.82rem", color: "#94a3b8" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <CreditCard size={14} color="#38bdf8" />
                  <span>Switch ISO 8583 (STAN, MTI, DE39, Reversals)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Server size={14} color="#10b981" />
                  <span>Journaux GAB / ATM EJ (NCR &amp; Diebold)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Radio size={14} color="#f59e0b" />
                  <span>Clearing GIMAC, VISA &amp; Réseau tcpdump</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Lock size={14} color="#a855f7" />
                  <span>HSM Thales, PIN Block &amp; Comparaison SHA-256</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SÉLECTEUR DE DOMAINE MAJEUR (Toutes vs Expert Monétique vs Linux Système) */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "1rem" }}>
          <button
            type="button"
            onClick={() => {
              setSelectedDomain("ALL");
              setSelectedCategory("ALL");
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              border: selectedDomain === "ALL" ? "2px solid #0284c7" : "1px solid #334155",
              background: selectedDomain === "ALL" ? "rgba(2, 132, 199, 0.22)" : "rgba(15, 23, 42, 0.6)",
              color: selectedDomain === "ALL" ? "#ffffff" : "#94a3b8",
              fontSize: "0.85rem",
              fontWeight: selectedDomain === "ALL" ? 700 : 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease",
            }}
          >
            <span>⚡ Vue Complète</span>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "2px 7px",
                borderRadius: "10px",
                background: selectedDomain === "ALL" ? "#0284c7" : "#1e293b",
                color: "#f8fafc",
              }}
            >
              {totalCommandCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedDomain("MONETIQUE_EXPERT");
              setSelectedCategory("ALL");
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              border: selectedDomain === "MONETIQUE_EXPERT" ? "2px solid #10b981" : "1px solid #334155",
              background: selectedDomain === "MONETIQUE_EXPERT" ? "rgba(16, 185, 129, 0.22)" : "rgba(15, 23, 42, 0.6)",
              color: selectedDomain === "MONETIQUE_EXPERT" ? "#ffffff" : "#94a3b8",
              fontSize: "0.85rem",
              fontWeight: selectedDomain === "MONETIQUE_EXPERT" ? 700 : 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease",
            }}
          >
            <span>💳 Spécial Expert Monétique &amp; Logs</span>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "2px 7px",
                borderRadius: "10px",
                background: selectedDomain === "MONETIQUE_EXPERT" ? "#10b981" : "#1e293b",
                color: "#f8fafc",
              }}
            >
              {monetiqueCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedDomain("SYSTEM_LINUX");
              setSelectedCategory("ALL");
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              border: selectedDomain === "SYSTEM_LINUX" ? "2px solid #38bdf8" : "1px solid #334155",
              background: selectedDomain === "SYSTEM_LINUX" ? "rgba(56, 189, 248, 0.22)" : "rgba(15, 23, 42, 0.6)",
              color: selectedDomain === "SYSTEM_LINUX" ? "#ffffff" : "#94a3b8",
              fontSize: "0.85rem",
              fontWeight: selectedDomain === "SYSTEM_LINUX" ? 700 : 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease",
            }}
          >
            <span>🐧 Linux Standard &amp; Fichiers (PDF)</span>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "2px 7px",
                borderRadius: "10px",
                background: selectedDomain === "SYSTEM_LINUX" ? "#0284c7" : "#1e293b",
                color: "#f8fafc",
              }}
            >
              {linuxCount}
            </span>
          </button>
        </div>

        {/* BARRE D'OUTILS : RECHERCHE + FILTRES + VUES */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            border: "1px solid rgba(51, 65, 85, 0.6)",
            borderRadius: "14px",
            padding: "1.25rem",
            marginBottom: "1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            {/* Input de recherche */}
            <div style={{ position: "relative", flex: "1 1 320px", maxWidth: "600px" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type="text"
                placeholder="Rechercher (ex: STAN, DE39, 0420, tcpdump, HSM, salt, JAM, clearing, tail)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.85rem 0.6rem 2.4rem",
                  background: "#090d16",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f8fafc",
                  fontSize: "0.88rem",
                  outline: "none",
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Commutateur de vue */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.82rem", color: "#94a3b8", fontWeight: 600 }}>Affichage :</span>
              <div
                style={{
                  display: "flex",
                  background: "#090d16",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  padding: "2px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: viewMode === "table" ? "#0284c7" : "transparent",
                    color: viewMode === "table" ? "#ffffff" : "#94a3b8",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  📋 Tableaux Compacts
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "6px",
                    border: "none",
                    background: viewMode === "cards" ? "#0284c7" : "transparent",
                    color: viewMode === "cards" ? "#ffffff" : "#94a3b8",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  🗂️ Fiches Détaillées
                </button>
              </div>
            </div>
          </div>

          {/* Filtres par Catégorie (Pills) */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              style={{
                padding: "4px 10px",
                borderRadius: "16px",
                border: selectedCategory === "ALL" ? "1px solid #38bdf8" : "1px solid #334155",
                background: selectedCategory === "ALL" ? "rgba(56, 189, 248, 0.18)" : "rgba(15, 23, 42, 0.6)",
                color: selectedCategory === "ALL" ? "#38bdf8" : "#94a3b8",
                fontSize: "0.76rem",
                fontWeight: selectedCategory === "ALL" ? 700 : 500,
                cursor: "pointer",
              }}
            >
              Toutes les rubriques
            </button>

            {SERVER_COMMAND_SECTIONS.filter(
              (sec) => selectedDomain === "ALL" || sec.domainGroup === selectedDomain
            ).map((sec) => {
              const isSelected = selectedCategory === sec.categoryKey;
              return (
                <button
                  key={sec.categoryKey}
                  type="button"
                  onClick={() => setSelectedCategory(sec.categoryKey)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "16px",
                    border: isSelected ? "1px solid #38bdf8" : "1px solid #334155",
                    background: isSelected ? "rgba(56, 189, 248, 0.18)" : "rgba(15, 23, 42, 0.6)",
                    color: isSelected ? "#38bdf8" : "#94a3b8",
                    fontSize: "0.76rem",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span>{sec.icon}</span>
                  <span>{sec.title}</span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      background: isSelected ? "#0284c7" : "#1e293b",
                      color: "#f8fafc",
                      padding: "1px 5px",
                      borderRadius: "8px",
                    }}
                  >
                    {sec.items.length}
                  </span>
                </button>
              );
            })}

            {(selectedDomain === "ALL" || selectedDomain === "SYSTEM_LINUX") && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("CAS_PRATIQUE")}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "16px",
                    border: selectedCategory === "CAS_PRATIQUE" ? "1px solid #f59e0b" : "1px solid #334155",
                    background: selectedCategory === "CAS_PRATIQUE" ? "rgba(245, 158, 11, 0.18)" : "rgba(15, 23, 42, 0.6)",
                    color: selectedCategory === "CAS_PRATIQUE" ? "#f59e0b" : "#94a3b8",
                    fontSize: "0.76rem",
                    fontWeight: selectedCategory === "CAS_PRATIQUE" ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  🔐 1.6 Key/Salt SHA-256
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory("ENCRYPTION")}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "16px",
                    border: selectedCategory === "ENCRYPTION" ? "1px solid #a855f7" : "1px solid #334155",
                    background: selectedCategory === "ENCRYPTION" ? "rgba(168, 85, 247, 0.18)" : "rgba(15, 23, 42, 0.6)",
                    color: selectedCategory === "ENCRYPTION" ? "#c084fc" : "#94a3b8",
                    fontSize: "0.76rem",
                    fontWeight: selectedCategory === "ENCRYPTION" ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  ⚙️ 1.7 Encryption JAR
                </button>
              </>
            )}
          </div>
        </div>

        {/* CONTENU PRINCIPAL DES SECTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {filteredSections.map((section) => {
            const isCollapsed = collapsedSections[section.number];
            const isMonetique = section.domainGroup === "MONETIQUE_EXPERT";

            return (
              <div
                key={section.number}
                style={{
                  background: "rgba(15, 23, 42, 0.65)",
                  border: `1px solid ${isMonetique ? "rgba(16, 185, 129, 0.35)" : "rgba(51, 65, 85, 0.7)"}`,
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)",
                }}
              >
                {/* En-tête de la section */}
                <div
                  onClick={() => toggleSection(section.number)}
                  style={{
                    background: isMonetique
                      ? "linear-gradient(90deg, rgba(6, 78, 59, 0.35) 0%, rgba(15, 23, 42, 0.6) 100%)"
                      : "rgba(30, 41, 59, 0.6)",
                    padding: "1rem 1.5rem",
                    borderBottom: isCollapsed ? "none" : "1px solid rgba(51, 65, 85, 0.8)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.3rem" }}>{section.icon}</span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <h2 style={{ fontSize: "1.12rem", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
                          {section.number} {section.title}
                        </h2>
                        {section.badgeLabel && (
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "2px 7px",
                              borderRadius: "10px",
                              background: isMonetique ? "rgba(16, 185, 129, 0.2)" : "rgba(56, 189, 248, 0.15)",
                              color: isMonetique ? "#34d399" : "#38bdf8",
                              border: `1px solid ${isMonetique ? "rgba(16, 185, 129, 0.4)" : "rgba(56, 189, 248, 0.3)"}`,
                            }}
                          >
                            {section.badgeLabel}
                          </span>
                        )}
                      </div>
                      {section.description && (
                        <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "2px 0 0 0" }}>
                          {section.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: isMonetique ? "#34d399" : "#38bdf8",
                        background: isMonetique ? "rgba(16, 185, 129, 0.15)" : "rgba(56, 189, 248, 0.12)",
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      {section.items.length} commande{section.items.length > 1 ? "s" : ""}
                    </span>
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </button>
                  </div>
                </div>

                {/* Corps de la section */}
                {!isCollapsed && (
                  <div style={{ padding: viewMode === "table" ? "0" : "1.25rem" }}>
                    {viewMode === "table" ? (
                      /* VUE TABLEAU COMPACT */
                      <div style={{ overflowX: "auto" }}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "0.88rem",
                            textAlign: "left",
                          }}
                        >
                          <thead>
                            <tr
                              style={{
                                background: "#0b1220",
                                borderBottom: "2px solid #1e293b",
                              }}
                            >
                              <th
                                style={{
                                  padding: "12px 18px",
                                  color: "#38bdf8",
                                  fontWeight: 700,
                                  width: "50%",
                                  letterSpacing: "0.03em",
                                  fontSize: "0.82rem",
                                  textTransform: "uppercase",
                                }}
                              >
                                Commande Shell
                              </th>
                              <th
                                style={{
                                  padding: "12px 18px",
                                  color: "#38bdf8",
                                  fontWeight: 700,
                                  letterSpacing: "0.03em",
                                  fontSize: "0.82rem",
                                  textTransform: "uppercase",
                                }}
                              >
                                Utilité &amp; Contexte Monétique
                              </th>
                              <th
                                style={{
                                  padding: "12px 14px",
                                  width: "70px",
                                  textAlign: "center",
                                }}
                              ></th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.items.map((item, idx) => {
                              const isCopied = copiedId === item.id;
                              const isEven = idx % 2 === 0;

                              return (
                                <tr
                                  key={item.id}
                                  style={{
                                    background: isEven ? "rgba(15, 23, 42, 0.4)" : "rgba(30, 41, 59, 0.25)",
                                    borderBottom: "1px solid rgba(51, 65, 85, 0.4)",
                                    transition: "background 0.15s ease",
                                  }}
                                >
                                  {/* Colonne Commande */}
                                  <td
                                    style={{
                                      padding: "12px 18px",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "inline-block",
                                        fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
                                        fontSize: "0.86rem",
                                        color: item.danger ? "#f87171" : item.highlight ? "#38bdf8" : "#e2e8f0",
                                        background: "#090d16",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        border: `1px solid ${
                                          item.danger
                                            ? "rgba(239, 68, 68, 0.4)"
                                            : item.highlight
                                            ? "rgba(56, 189, 248, 0.4)"
                                            : "rgba(51, 65, 85, 0.6)"
                                        }`,
                                        wordBreak: "break-all",
                                      }}
                                    >
                                      {item.command}
                                    </div>
                                    {item.danger && (
                                      <span
                                        style={{
                                          marginLeft: "8px",
                                          fontSize: "0.7rem",
                                          color: "#ef4444",
                                          fontWeight: 700,
                                        }}
                                      >
                                        ⚠️ Risque
                                      </span>
                                    )}
                                  </td>

                                  {/* Colonne Utilité */}
                                  <td
                                    style={{
                                      padding: "12px 18px",
                                      color: "#cbd5e1",
                                      verticalAlign: "middle",
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    <div>{item.utility}</div>
                                    {item.tips && (
                                      <div
                                        style={{
                                          fontSize: "0.76rem",
                                          color: "#94a3b8",
                                          marginTop: "4px",
                                          lineHeight: 1.4,
                                        }}
                                      >
                                        💡 {item.tips}
                                      </div>
                                    )}
                                  </td>

                                  {/* Bouton Copier */}
                                  <td
                                    style={{
                                      padding: "12px 14px",
                                      textAlign: "center",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(item.command, item.id)}
                                      title="Copier la commande"
                                      style={{
                                        background: isCopied ? "rgba(16, 185, 129, 0.2)" : "rgba(30, 41, 59, 0.8)",
                                        border: `1px solid ${isCopied ? "#10b981" : "#475569"}`,
                                        color: isCopied ? "#34d399" : "#94a3b8",
                                        padding: "6px 8px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "all 0.15s ease",
                                      }}
                                    >
                                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* VUE CARTES DÉTAILLÉES */
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                          gap: "1rem",
                        }}
                      >
                        {section.items.map((item) => {
                          const isCopied = copiedId === item.id;

                          return (
                            <div
                              key={item.id}
                              style={{
                                background: "rgba(15, 23, 42, 0.8)",
                                border: `1px solid ${
                                  item.danger
                                    ? "rgba(239, 68, 68, 0.4)"
                                    : item.highlight
                                    ? "rgba(56, 189, 248, 0.4)"
                                    : "rgba(51, 65, 85, 0.6)"
                                }`,
                                borderRadius: "10px",
                                padding: "1rem",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: "0.75rem",
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: "0.5rem",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "0.86rem",
                                      fontWeight: 600,
                                      color: "#f1f5f9",
                                      lineHeight: 1.4,
                                    }}
                                  >
                                    {item.utility}
                                  </div>
                                  {item.danger && (
                                    <span
                                      style={{
                                        fontSize: "0.68rem",
                                        padding: "2px 6px",
                                        borderRadius: "4px",
                                        background: "rgba(239, 68, 68, 0.2)",
                                        color: "#f87171",
                                        fontWeight: 700,
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      Risque
                                    </span>
                                  )}
                                </div>

                                {item.tips && (
                                  <div
                                    style={{
                                      fontSize: "0.76rem",
                                      color: "#94a3b8",
                                      marginBottom: "0.6rem",
                                      lineHeight: 1.4,
                                    }}
                                  >
                                    💡 {item.tips}
                                  </div>
                                )}
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  background: "#090d16",
                                  border: "1px solid #1e293b",
                                  borderRadius: "6px",
                                  padding: "6px 10px",
                                  gap: "8px",
                                }}
                              >
                                <code
                                  style={{
                                    fontFamily: "'Fira Code', 'Consolas', monospace",
                                    fontSize: "0.82rem",
                                    color: item.danger ? "#f87171" : "#38bdf8",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {item.command}
                                </code>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(item.command, item.id)}
                                  style={{
                                    background: isCopied ? "rgba(16, 185, 129, 0.2)" : "rgba(30, 41, 59, 0.8)",
                                    border: `1px solid ${isCopied ? "#10b981" : "#475569"}`,
                                    color: isCopied ? "#34d399" : "#94a3b8",
                                    padding: "4px 6px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    flexShrink: 0,
                                  }}
                                  title="Copier"
                                >
                                  {isCopied ? <Check size={13} /> : <Copy size={13} />}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* SECTION 1.6 : CAS PRATIQUE KEY ET SALT (Fidèle au PDF) */}
          {showPracticalCase && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 30, 48, 0.9) 100%)",
                border: "2px solid rgba(245, 158, 11, 0.4)",
                borderRadius: "16px",
                padding: "1.75rem",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#f59e0b",
                    flexShrink: 0,
                  }}
                >
                  <Lock size={22} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                      {PRACTICAL_CASE_KEY_SALT.number} {PRACTICAL_CASE_KEY_SALT.title}
                    </h2>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: "rgba(245, 158, 11, 0.2)",
                        color: "#fbbf24",
                        border: "1px solid rgba(245, 158, 11, 0.4)",
                      }}
                    >
                      Audit Sécurité &amp; Déchiffrement
                    </span>
                  </div>

                  <p style={{ fontSize: "0.9rem", color: "#e2e8f0", lineHeight: 1.6, margin: "0 0 1rem 0" }}>
                    {PRACTICAL_CASE_KEY_SALT.explanation}
                  </p>
                </div>
              </div>

              {/* Bloc Recommandation */}
              <div
                style={{
                  background: "#090d16",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "10px",
                  padding: "1.25rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f59e0b", letterSpacing: "0.05em" }}>
                    {PRACTICAL_CASE_KEY_SALT.recommendation.label}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(PRACTICAL_CASE_KEY_SALT.recommendation.command, "key-salt-cmd")
                    }
                    style={{
                      background: copiedId === "key-salt-cmd" ? "rgba(16, 185, 129, 0.2)" : "rgba(30, 41, 59, 0.8)",
                      border: `1px solid ${copiedId === "key-salt-cmd" ? "#10b981" : "#475569"}`,
                      color: copiedId === "key-salt-cmd" ? "#34d399" : "#94a3b8",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                    }}
                  >
                    {copiedId === "key-salt-cmd" ? (
                      <>
                        <Check size={14} />
                        <span>Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copier la commande</span>
                      </>
                    )}
                  </button>
                </div>

                <div
                  style={{
                    fontFamily: "'Fira Code', 'Consolas', monospace",
                    fontSize: "0.95rem",
                    color: "#38bdf8",
                    background: "rgba(0, 0, 0, 0.4)",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #1e293b",
                    wordBreak: "break-all",
                    marginBottom: "0.6rem",
                  }}
                >
                  {PRACTICAL_CASE_KEY_SALT.recommendation.command}
                </div>

                <div style={{ fontSize: "0.82rem", color: "#94a3b8", fontStyle: "italic" }}>
                  💡 {PRACTICAL_CASE_KEY_SALT.recommendation.advice}
                </div>
              </div>

              {/* Exemple de sortie SHA-256 */}
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  padding: "0.85rem 1rem",
                  fontSize: "0.8rem",
                  color: "#cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <span>Exemple d&apos;empreinte résultante :</span>
                <code style={{ fontFamily: "monospace", color: "#10b981" }}>
                  {PRACTICAL_CASE_KEY_SALT.exampleOutput}
                </code>
              </div>

              {/* Avantages opérationnels */}
              <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.75rem" }}>
                {PRACTICAL_CASE_KEY_SALT.keyBenefits.map((b, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(30, 41, 59, 0.4)",
                      border: "1px solid rgba(51, 65, 85, 0.5)",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      fontSize: "0.78rem",
                      color: "#cbd5e1",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "6px",
                    }}
                  >
                    <span style={{ color: "#f59e0b", fontWeight: 700 }}>✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 1.7 : ENCRYPTION DU MOT DE PASSE (Fidèle au PDF) */}
          {showJarSection && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(28, 20, 45, 0.85) 100%)",
                border: "2px solid rgba(168, 85, 247, 0.4)",
                borderRadius: "16px",
                padding: "1.75rem",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: "rgba(168, 85, 247, 0.15)",
                    border: "1px solid rgba(168, 85, 247, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#c084fc",
                    flexShrink: 0,
                  }}
                >
                  <Cpu size={22} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                      {PASSWORD_ENCRYPTION_JAR.number} {PASSWORD_ENCRYPTION_JAR.title}
                    </h2>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: "rgba(168, 85, 247, 0.2)",
                        color: "#d8b4fe",
                        border: "1px solid rgba(168, 85, 247, 0.4)",
                      }}
                    >
                      Brique Java Sécurisée
                    </span>
                  </div>

                  <p style={{ fontSize: "0.9rem", color: "#e2e8f0", lineHeight: 1.6, margin: "0 0 1rem 0" }}>
                    {PASSWORD_ENCRYPTION_JAR.explanation}
                  </p>
                </div>
              </div>

              {/* Bloc Commande Java */}
              <div
                style={{
                  background: "#090d16",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  borderRadius: "10px",
                  padding: "1.25rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Fira Code', 'Consolas', monospace",
                    fontSize: "0.95rem",
                    color: "#d8b4fe",
                    wordBreak: "break-all",
                  }}
                >
                  {PASSWORD_ENCRYPTION_JAR.command}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(PASSWORD_ENCRYPTION_JAR.command, "jar-cmd")}
                  style={{
                    background: copiedId === "jar-cmd" ? "rgba(16, 185, 129, 0.2)" : "rgba(30, 41, 59, 0.8)",
                    border: `1px solid ${copiedId === "jar-cmd" ? "#10b981" : "#475569"}`,
                    color: copiedId === "jar-cmd" ? "#34d399" : "#94a3b8",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  {copiedId === "jar-cmd" ? (
                    <>
                      <Check size={14} />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copier la commande</span>
                    </>
                  )}
                </button>
              </div>

              <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.75rem", fontStyle: "italic" }}>
                💡 {PASSWORD_ENCRYPTION_JAR.tips}
              </div>
            </div>
          )}
        </div>

        {/* LIENS DE NAVIGATION RAPIDE VERS LES AUTRES OUTILS D'EXPLOITATION */}
        <div
          style={{
            marginTop: "3rem",
            background: "rgba(15, 23, 42, 0.5)",
            border: "1px solid #1e293b",
            borderRadius: "14px",
            padding: "1.25rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#f8fafc" }}>
              Besoin d&apos;analyser une trame brute ou un journal GAB ?
            </div>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              Utilise les décodeurs intégrés pour analyser les bitmaps, le journal électronique GAB ou les trames NDC.
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link
              href="/hub/parser"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(56, 189, 248, 0.12)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                color: "#38bdf8",
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <span>🔍 Parseur Trame ISO</span>
              <ArrowRight size={13} />
            </Link>

            <Link
              href="/hub/atm-ej"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#34d399",
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <span>🖨️ Journal GAB (ATM EJ)</span>
              <ArrowRight size={13} />
            </Link>

            <Link
              href="/hub/de39"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                color: "#f59e0b",
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <span>🏷️ Référentiel DE39</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

      </div>
    </AppShell>
  );
}

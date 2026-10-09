"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, Info, ChevronRight } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

/**
 * Enhanced syntax tokenization for code blocks
 */
function highlightCodeTokens(code: string, lang: string): React.ReactNode[] {
  const lines = code.split("\n");

  // Simple keyword matching list
  const keywords = new Set([
    "def", "return", "import", "from", "as", "class", "if", "else", "elif", "for", "while", "in", "try", "except", "with",
    "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "RIGHT", "INNER", "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "INSERT", "UPDATE", "DELETE",
    "FUNCTION", "DEFINE", "RECORD", "LET", "THEN", "END", "FOREACH", "WHILE", "WHENEVER", "ERROR", "CONTINUE", "CALL", "DISPLAY",
    "function", "const", "let", "var", "async", "await", "export", "default", "interface", "type", "struct", "void", "int", "char", "float", "double"
  ]);

  return lines.map((line, lineIdx) => {
    // Check if line is a comment
    const isComment = line.trim().startsWith("#") || line.trim().startsWith("//") || line.trim().startsWith("--");

    if (isComment) {
      return (
        <div key={lineIdx} className="table-row">
          <span className="table-cell text-gray-500 select-none pr-4 text-right text-xs opacity-50 w-8">{lineIdx + 1}</span>
          <span className="table-cell text-emerald-400/80 italic">{line}</span>
        </div>
      );
    }

    // Tokenize line words and strings
    const tokens = line.split(/(\s+|"[^"]*"|'[^']*'|`[^`]*`|[(),;:{}[\]])/);

    return (
      <div key={lineIdx} className="table-row">
        <span className="table-cell text-gray-500 select-none pr-4 text-right text-xs opacity-50 w-8">{lineIdx + 1}</span>
        <span className="table-cell">
          {tokens.map((token, tokIdx) => {
            if (!token) return null;

            // Strings
            if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
              return <span key={tokIdx} className="text-amber-300">{token}</span>;
            }

            // Keywords
            if (keywords.has(token.toUpperCase()) || keywords.has(token)) {
              return <span key={tokIdx} className="text-rose-400 font-bold">{token}</span>;
            }

            // Hex/Bitmaps/Numbers
            if (/^(0x[0-9A-Fa-f]+|\d+(\.\d+)?|[0-9A-FA-F]{8,})$/.test(token)) {
              return <span key={tokIdx} className="text-cyan-300 font-mono">{token}</span>;
            }

            // Function calls
            if (/^[a-zA-Z_]\w*(?=\()/.test(token)) {
              return <span key={tokIdx} className="text-blue-300">{token}</span>;
            }

            return <span key={tokIdx}>{token}</span>;
          })}
        </span>
      </div>
    );
  });
}

/**
 * Code Block Component with Header and One-Click Copy Button
 */
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang = (lang || "code").toUpperCase();

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-gray-800 shadow-xl bg-slate-950 text-gray-100 font-mono">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-semibold text-rose-300 tracking-wider">
          <Terminal className="w-4 h-4 text-rose-400" />
          <span>{displayLang}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white transition-colors border border-slate-700"
          title="Copier le code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copié !</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm leading-relaxed font-mono table min-w-full">
        {highlightCodeTokens(code, lang)}
      </div>
    </div>
  );
}

/**
 * Parse inline Markdown (bold, italic, code, math, links)
 */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const regex = /(!\[[^\]]*\]\([^)]+\)|\$[^$]+\$|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Image
    const imgMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const [, altText, imgSrc] = imgMatch;
      return (
        <span key={idx} className="block my-6 rounded-2xl overflow-hidden border border-gray-200/80 shadow-md bg-slate-950 group">
          <img
            src={imgSrc}
            alt={altText}
            className="w-full h-auto max-h-[480px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
            loading="lazy"
          />
          {altText && (
            <span className="block py-2.5 px-4 bg-slate-900 text-center border-t border-slate-800 text-xs text-rose-200/90 font-medium">
              📷 {altText}
            </span>
          )}
        </span>
      );
    }

    // Math inline
    if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
      const mathContent = part.slice(1, -1);
      return (
        <span
          key={idx}
          className="font-mono bg-rose-50 text-[#7d1538] px-2 py-0.5 rounded text-xs sm:text-sm font-semibold border border-rose-200/80 mx-0.5 shadow-2xs inline-block"
        >
          {mathContent}
        </span>
      );
    }

    // Code inline
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      const codeContent = part.slice(1, -1);
      return (
        <code
          key={idx}
          className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-xs sm:text-sm font-medium border border-slate-200 text-rose-900"
        >
          {codeContent}
        </code>
      );
    }

    // Bold
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      const boldContent = part.slice(2, -2);
      return <strong key={idx} className="font-bold text-gray-900">{renderInlineMarkdown(boldContent)}</strong>;
    }

    // Italic
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      const italicContent = part.slice(1, -1);
      return <em key={idx} className="italic text-gray-800">{renderInlineMarkdown(italicContent)}</em>;
    }

    // Link
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, linkText, linkUrl] = linkMatch;
      return (
        <a
          key={idx}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#7d1538] underline hover:text-[#63102c] font-semibold transition-colors"
        >
          {linkText}
        </a>
      );
    }

    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

/**
 * Main Markdown Parser & Renderer Component
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content by lines
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeLang = "";
  let codeBuffer: string[] = [];

  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = (keyPrefix: string) => {
    if (!currentList) return;
    const isUl = currentList.type === "ul";
    const ListTag = isUl ? "ul" : "ol";
    blocks.push(
      <ListTag
        key={`${keyPrefix}-list`}
        className={`my-5 space-y-2.5 pl-2 ${
          isUl ? "" : "list-decimal list-inside"
        }`}
      >
        {currentList.items.map((item, i) => (
          <li key={i} className="flex items-start text-gray-800 text-base leading-relaxed">
            {isUl && (
              <span className="w-2 h-2 rounded-full bg-[#7d1538] mt-2 mr-3 shrink-0" />
            )}
            <div>{renderInlineMarkdown(item)}</div>
          </li>
        ))}
      </ListTag>
    );
    currentList = null;
  };

  const flushTable = (keyPrefix: string) => {
    if (!inTable) return;
    blocks.push(
      <div key={`${keyPrefix}-table`} className="my-6 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-gray-900 font-bold">
            <tr>
              {tableHeader.map((th, idx) => (
                <th key={idx} className="px-4 py-3 border-b border-gray-200">
                  {renderInlineMarkdown(th.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {tableRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-rose-50/40 transition-colors odd:bg-white even:bg-gray-50/50">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-3 text-gray-700">
                    {renderInlineMarkdown(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    inTable = false;
    tableHeader = [];
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code block toggles
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        // Close code block
        blocks.push(<CodeBlock key={`code-${i}`} code={codeBuffer.join("\n")} lang={codeLang} />);
        inCodeBlock = false;
        codeBuffer = [];
        codeLang = "";
      } else {
        // Open code block
        flushList(`before-code-${i}`);
        flushTable(`before-code-${i}`);
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // 2. Table parsing
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList(`before-table-${i}`);
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());

      // Skip delimiter line like |---|---|
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable(`end-table-${i}`);
    }

    // 2.5 Image block
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      flushList(`before-img-${i}`);
      flushTable(`before-img-${i}`);
      const [, altText, imgSrc] = imgMatch;
      blocks.push(
        <div key={`img-${i}`} className="my-8 rounded-2xl overflow-hidden border border-gray-200/80 shadow-lg bg-slate-950 group">
          <img
            src={imgSrc}
            alt={altText}
            className="w-full h-auto max-h-[500px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
            loading="lazy"
          />
          {altText && (
            <div className="py-2.5 px-4 bg-slate-900 text-center border-t border-slate-800 text-xs text-rose-200/90 font-medium">
              📷 {altText}
            </div>
          )}
        </div>
      );
      continue;
    }

    // 3. Horizontal Rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      flushList(`before-hr-${i}`);
      blocks.push(<hr key={`hr-${i}`} className="my-8 border-t-2 border-gray-100" />);
      continue;
    }

    // 4. Headings
    if (trimmed.startsWith("# ")) {
      flushList(`before-h1-${i}`);
      const text = trimmed.slice(2);
      blocks.push(
        <h1 key={`h1-${i}`} className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-10 mb-4 pb-3 border-b border-gray-200">
          {renderInlineMarkdown(text)}
        </h1>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList(`before-h2-${i}`);
      const text = trimmed.slice(3);
      blocks.push(
        <h2 key={`h2-${i}`} className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4 pl-3.5 border-l-4 border-[#7d1538] flex items-center">
          {renderInlineMarkdown(text)}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushList(`before-h3-${i}`);
      const text = trimmed.slice(4);
      blocks.push(
        <h3 key={`h3-${i}`} className="text-lg sm:text-xl font-bold text-gray-900 mt-6 mb-3 flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-[#7d1538] shrink-0" />
          <span>{renderInlineMarkdown(text)}</span>
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("#### ")) {
      flushList(`before-h4-${i}`);
      const text = trimmed.slice(5);
      blocks.push(
        <h4 key={`h4-${i}`} className="text-base font-semibold text-gray-800 mt-4 mb-2">
          {renderInlineMarkdown(text)}
        </h4>
      );
      continue;
    }

    // 5. Math Block ($$ ... $$)
    if (trimmed.startsWith("$$") && trimmed.endsWith("$$") && trimmed.length > 4) {
      flushList(`before-math-${i}`);
      const formula = trimmed.slice(2, -2).trim();
      blocks.push(
        <div key={`math-${i}`} className="my-6 p-5 bg-slate-950 text-rose-300 rounded-2xl border border-slate-800 shadow-inner font-mono text-center overflow-x-auto text-sm sm:text-base leading-relaxed">
          {formula}
        </div>
      );
      continue;
    }

    // 6. Blockquote / Callout
    if (trimmed.startsWith("> ")) {
      flushList(`before-quote-${i}`);
      const quoteText = trimmed.slice(2);
      blocks.push(
        <blockquote key={`quote-${i}`} className="my-6 p-4 sm:p-5 bg-rose-50/70 border-l-4 border-[#7d1538] rounded-r-2xl text-gray-800 font-medium leading-relaxed italic flex items-start space-x-3">
          <Info className="w-5 h-5 text-[#7d1538] shrink-0 mt-0.5" />
          <div className="flex-1">{renderInlineMarkdown(quoteText)}</div>
        </blockquote>
      );
      continue;
    }

    // 7. Unordered List (- or *)
    const ulMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (ulMatch) {
      if (!currentList || currentList.type !== "ul") {
        flushList(`before-ul-${i}`);
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    // 8. Ordered List (1. 2. etc.)
    const olMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList(`before-ol-${i}`);
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(olMatch[1]);
      continue;
    }

    // Empty line flushes lists
    if (!trimmed) {
      flushList(`empty-${i}`);
      continue;
    }

    // 9. Standard Paragraph
    flushList(`before-p-${i}`);
    blocks.push(
      <p key={`p-${i}`} className="mb-4 text-gray-800 leading-relaxed text-base sm:text-lg">
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  // Final flush for list or table
  flushList("final");
  flushTable("final");

  return <div className="space-y-2">{blocks}</div>;
}

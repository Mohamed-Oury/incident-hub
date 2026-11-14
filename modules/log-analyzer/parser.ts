import {
  LogEvent,
  HexDumpDecoded,
  ResponseCodeConversion,
  ParseStatus,
} from "./types";

/**
 * Nettoyage et masquage PCI-DSS sur les données sensibles.
 */
export function maskSensitiveData(pan?: string): string {
  if (!pan) return "";
  const clean = pan.replace(/\D/g, "");
  if (clean.length < 10) return "****";
  const first6 = clean.substring(0, 6);
  const last4 = clean.substring(clean.length - 4);
  return `${first6}${"*".repeat(clean.length - 10)}${last4}`;
}

/**
 * Parse un timestamp jPOS ou texte plat/TRC tel que :
 * - "Mon Nov 02 00:01:55 GMT 2026.152"
 * - "2026-11-02 00:01:55.152"
 * - "2026-11-02T00:01:55.152Z"
 * - "02/11/2026 00:01:55"
 */
export function parseJposTimestamp(rawTimestamp: string): {
  iso: string;
  epochMs: number;
} {
  try {
    const trimmed = rawTimestamp.trim();

    // Format jPOS: "Mon Nov 02 00:01:55 GMT 2026.152"
    const jposRegex =
      /^[A-Za-z]{3}\s+([A-Za-z]{3})\s+(\d{1,2})\s+(\d{2}):(\d{2}):(\d{2})\s+([A-Z]{3,4})\s+(\d{4})\.(\d{1,3})$/;
    const matchJpos = trimmed.match(jposRegex);

    if (matchJpos) {
      const [, monthStr, dayStr, hourStr, minStr, secStr, , yearStr, msStr] = matchJpos;
      const months: Record<string, number> = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      };
      const month = months[monthStr] ?? 0;
      const day = parseInt(dayStr, 10);
      const year = parseInt(yearStr, 10);
      const hours = parseInt(hourStr, 10);
      const minutes = parseInt(minStr, 10);
      const seconds = parseInt(secStr, 10);
      const ms = parseInt(msStr.padEnd(3, "0"), 10);

      const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds, ms));
      return { iso: date.toISOString(), epochMs: date.getTime() };
    }

    // Format ISO ou standard TRC: "2026-11-02 00:01:55.152" ou "2026-11-02T00:01:55"
    const isoStandardRegex =
      /^(\d{4})[-/](\d{2})[-/](\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?/;
    const matchIso = trimmed.match(isoStandardRegex);
    if (matchIso) {
      const [, y, m, d, hh, mm, ss, sMs] = matchIso;
      const ms = sMs ? parseInt(sMs.padEnd(3, "0"), 10) : 0;
      const date = new Date(
        Date.UTC(
          parseInt(y, 10),
          parseInt(m, 10) - 1,
          parseInt(d, 10),
          parseInt(hh, 10),
          parseInt(mm, 10),
          parseInt(ss, 10),
          ms
        )
      );
      return { iso: date.toISOString(), epochMs: date.getTime() };
    }

    // Format français TRC: "02/11/2026 00:01:55"
    const frRegex =
      /^(\d{2})[-/](\d{2})[-/](\d{4})[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?/;
    const matchFr = trimmed.match(frRegex);
    if (matchFr) {
      const [, d, m, y, hh, mm, ss, sMs] = matchFr;
      const ms = sMs ? parseInt(sMs.padEnd(3, "0"), 10) : 0;
      const date = new Date(
        Date.UTC(
          parseInt(y, 10),
          parseInt(m, 10) - 1,
          parseInt(d, 10),
          parseInt(hh, 10),
          parseInt(mm, 10),
          parseInt(ss, 10),
          ms
        )
      );
      return { iso: date.toISOString(), epochMs: date.getTime() };
    }

    const fallbackDate = new Date(trimmed);
    if (!isNaN(fallbackDate.getTime())) {
      return { iso: fallbackDate.toISOString(), epochMs: fallbackDate.getTime() };
    }
  } catch (_) {}

  const now = new Date();
  return { iso: now.toISOString(), epochMs: now.getTime() };
}

/**
 * Analyse et extrait les données d'un dump hexadécimal jPOS / TRC.
 */
export function parseHexDump(rawContent: string): HexDumpDecoded | undefined {
  const lineRegex = /^[0-9a-fA-F]{4}\s+((?:[0-9a-fA-F]{2}\s*)+)(?:\s{2,}(.*))?$/gm;
  const hexBytes: string[] = [];
  let asciiChars = "";
  let match: RegExpExecArray | null;

  while ((match = lineRegex.exec(rawContent)) !== null) {
    const bytesPart = match[1].trim().split(/\s+/);
    for (const b of bytesPart) {
      if (/^[0-9a-fA-F]{2}$/.test(b)) {
        hexBytes.push(b.toUpperCase());
        const code = parseInt(b, 16);
        if (code >= 32 && code <= 126) {
          asciiChars += String.fromCharCode(code);
        } else {
          asciiChars += ".";
        }
      }
    }
  }

  if (hexBytes.length === 0) return undefined;

  let detectedMti: string | undefined;
  if (hexBytes.length >= 4) {
    const first4Ascii = hexBytes
      .slice(0, 4)
      .map((b) => String.fromCharCode(parseInt(b, 16)))
      .join("");
    if (/^\d{4}$/.test(first4Ascii)) {
      detectedMti = first4Ascii;
    }
  }

  // Détection d'un RRN potentiel (12 chiffres consécutifs en ASCII après transition non-numérique ou début)
  let detectedRrn: string | undefined;
  const rrnMatch = asciiChars.match(/(?:^|[^\d])(\d{12})/);
  if (rrnMatch) {
    detectedRrn = rrnMatch[1];
  }

  // Détection du texte commerçant ou nom terminal (ex: "GOOGLE", "ATM", etc.)
  let detectedText: string | undefined;
  const textMatches = asciiChars.match(/[A-Z0-9\*\.\s\/\#]{8,}/g);
  if (textMatches && textMatches.length > 0) {
    detectedText = textMatches.filter((t) => t.trim().length > 7).join(" | ").trim();
  }

  return {
    rawHex: hexBytes.join(" "),
    asciiText: asciiChars,
    detectedMti,
    detectedRrn,
    detectedText,
  };
}

/**
 * Extrait les champs ISO d'un bloc XML jPOS.
 */
function extractIsoFieldsFromXml(xmlSnippet: string): {
  fields: Record<string, string>;
  nested: Record<string, Record<string, string>>;
  direction?: "incoming" | "outgoing";
  mti?: string;
} {
  const fields: Record<string, string> = {};
  const nested: Record<string, Record<string, string>> = {};

  let direction: "incoming" | "outgoing" | undefined;
  const dirMatch = xmlSnippet.match(/direction=["'](incoming|outgoing)["']/i);
  if (dirMatch) {
    direction = dirMatch[1].toLowerCase() as "incoming" | "outgoing";
  }

  const nestedRegex = /<isomsg\s+id=["'](\d+)["']>([\s\S]*?)<\/isomsg>/g;
  let nMatch: RegExpExecArray | null;
  while ((nMatch = nestedRegex.exec(xmlSnippet)) !== null) {
    const subId = nMatch[1];
    const subContent = nMatch[2];
    const subFields: Record<string, string> = {};
    const fieldRegex = /<field\s+id=["'](\d+)["']\s+value=["'](.*?)["']/g;
    let fMatch: RegExpExecArray | null;
    while ((fMatch = fieldRegex.exec(subContent)) !== null) {
      subFields[fMatch[1]] = fMatch[2];
    }
    nested[subId] = subFields;
  }

  const rootSnippet = xmlSnippet.replace(/<isomsg\s+id=["']\d+["']>[\s\S]*?<\/isomsg>/g, "");
  const rootFieldRegex = /<field\s+id=["'](\d+)["']\s+value=["'](.*?)["']/g;
  let rMatch: RegExpExecArray | null;
  while ((rMatch = rootFieldRegex.exec(rootSnippet)) !== null) {
    fields[rMatch[1]] = rMatch[2];
  }

  if (fields["2"] && fields["2"] !== "xxxxxxxxxx") {
    fields["2"] = maskSensitiveData(fields["2"]);
  }
  if (fields["52"]) {
    fields["52"] = "****************";
  }

  return { fields, nested, direction, mti: fields["0"] };
}

/**
 * Extrait la conversion de code réponse (Received / Send).
 */
function extractResponseCodeConversion(
  rawContent: string
): ResponseCodeConversion | undefined {
  const respRegex = /(?:Received|Recv)\s*[:=]\s*(\w+)[\r\n\s]+(?:Send|Sent)\s*[:=]\s*(\w+)/i;
  const match = rawContent.match(respRegex);
  if (match) {
    return {
      receivedCode: match[1].trim(),
      sendCode: match[2].trim(),
      rawText: match[0].trim(),
    };
  }
  return undefined;
}

/**
 * Parse un bloc individuel XML jPOS <log ...> ... </log>.
 */
export function parseLogBlock(
  blockRaw: string,
  fileId: string,
  eventIndex: number,
  sourceStart: number,
  sourceEnd: number
): LogEvent {
  const eventId = `evt_${fileId}_${String(eventIndex).padStart(5, "0")}`;

  const logTagMatch = blockRaw.match(/<log\s+([^>]+)>/);
  let realm = "UnknownRealm";
  let timestampRaw = "";

  if (logTagMatch) {
    const attrsStr = logTagMatch[1];
    const realmMatch = attrsStr.match(/realm=["']([^"']+)["']/);
    if (realmMatch) realm = realmMatch[1];

    const atMatch = attrsStr.match(/at=["']([^"']+)["']/);
    if (atMatch) timestampRaw = atMatch[1];
  }

  const { iso: timestampIso, epochMs } = parseJposTimestamp(timestampRaw);

  let eventType = "UNKNOWN_EVENT";
  const innerContent = blockRaw.replace(/<\/?log[^>]*>/g, "").trim();

  const firstTagMatch = innerContent.match(/<([A-Za-z0-9_\-\s]+)[^>]*>/);
  if (firstTagMatch) {
    eventType = firstTagMatch[1].trim();
  }

  const { fields, nested, direction: isoDir, mti } = extractIsoFieldsFromXml(innerContent);
  const responseCodeConversion = extractResponseCodeConversion(innerContent);
  const hexDump = parseHexDump(innerContent);

  let direction: "incoming" | "outgoing" | "unknown" = "unknown";
  if (isoDir) {
    direction = isoDir;
  } else if (
    eventType.includes("receive") ||
    eventType.includes("Recu") ||
    eventType.includes("From")
  ) {
    direction = "incoming";
  } else if (
    eventType.includes("send") ||
    eventType.includes("sendMessage") ||
    eventType.includes("To") ||
    eventType.includes("request")
  ) {
    direction = "outgoing";
  }

  const finalMti = mti || hexDump?.detectedMti;
  if (!fields["37"] && hexDump?.detectedRrn) {
    fields["37"] = hexDump.detectedRrn;
  }

  return {
    eventId,
    fileId,
    timestampRaw,
    timestampIso,
    epochMs,
    realm,
    eventType,
    direction,
    mti: finalMti,
    isoFields: fields,
    nestedIsoFields: Object.keys(nested).length > 0 ? nested : undefined,
    responseCodeConversion,
    hexDump,
    rawContent: blockRaw,
    sourceStart,
    sourceEnd,
    parseStatus: "success",
  };
}

/**
 * Parse un bloc de trace plat ou transaction.TRC.
 */
export function parseFlatOrTrcBlock(
  blockRaw: string,
  fileId: string,
  eventIndex: number,
  sourceStart: number,
  sourceEnd: number
): LogEvent {
  const eventId = `evt_${fileId}_${String(eventIndex).padStart(5, "0")}`;

  // 1. Horodatage
  let timestampRaw = "";
  const timeMatch = blockRaw.match(
    /(\d{4}[-/]\d{2}[-/]\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?|[A-Za-z]{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?|\d{2}[-/]\d{2}[-/]\d{4}[ T]\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?)/
  );
  if (timeMatch) {
    timestampRaw = timeMatch[1];
  }
  const { iso: timestampIso, epochMs } = parseJposTimestamp(timestampRaw);

  // 2. Realm / Canal
  let realm = "SwitchChannel";
  const realmMatch = blockRaw.match(
    /(?:Channel|Realm|Port|Device|Gateway|Host|Module|Interface)\s*[:=]\s*([^\s,;\]]+)|\[([A-Za-z0-9_\-\./:]+)\]/i
  );
  if (realmMatch) {
    realm = realmMatch[1] || realmMatch[2];
  }

  // 3. Direction & Type d'événement
  let direction: "incoming" | "outgoing" | "unknown" = "unknown";
  if (/\b(?:RECV|RECEIVE|INCOMING|FROM|IN\b|<-)\b/i.test(blockRaw)) {
    direction = "incoming";
  } else if (/\b(?:SEND|SENT|OUTGOING|TO|OUT\b|->)\b/i.test(blockRaw)) {
    direction = "outgoing";
  }

  let eventType = direction === "incoming" ? "TRC - RECV" : (direction === "outgoing" ? "TRC - SEND" : "TRC - EVENT");
  const eventTypeMatch = blockRaw.match(/(?:EVENT|TYPE|FLOW|MSG)\s*[:=]\s*([^\r\n,;]+)/i);
  if (eventTypeMatch) {
    eventType = eventTypeMatch[1].trim();
  }

  // 4. Extraction des champs ISO 8583
  const fields: Record<string, string> = {};

  // Détection MTI
  const mtiMatch = blockRaw.match(/\b(?:MTI|MsgType|Msg Type)\s*[:=]?\s*([0-2]\d{3})\b/i) ||
                   blockRaw.match(/\b(0100|0110|0200|0210|0400|0410|0420|0430|0800|0810|1100|1110)\b/);
  if (mtiMatch) {
    fields["0"] = mtiMatch[1];
  }

  // Extraction champs explicites: DE 37 : 123456789012 ou [037] 123456789012
  const fieldRegex = /(?:DE|Field|F)\s*0*(\d{1,3})\s*[:=]\s*([^\r\n,;]+)|\[0*(\d{1,3})\]\s*(?:[A-Za-z0-9_]+\s*[:=]\s*)?([^\r\n,;]+)/gi;
  let fMatch: RegExpExecArray | null;
  while ((fMatch = fieldRegex.exec(blockRaw)) !== null) {
    const fNum = fMatch[1] || fMatch[3];
    const fVal = (fMatch[2] || fMatch[4]).trim();
    if (fNum && fVal) {
      fields[fNum] = fVal;
    }
  }

  // Mot-clés spécialisés courants dans les fichiers .TRC
  if (!fields["37"]) {
    const rrnMatch = blockRaw.match(/\b(?:RRN|RetrievalRef|RefNum)\s*[:=]?\s*(\w{8,16})\b/i);
    if (rrnMatch) fields["37"] = rrnMatch[1];
  }

  if (!fields["11"]) {
    const stanMatch = blockRaw.match(/\b(?:STAN|Trace|AuditNum|SeqNum)\s*[:=]?\s*(\d{4,8})\b/i);
    if (stanMatch) fields["11"] = stanMatch[1];
  }

  if (!fields["41"]) {
    const tidMatch = blockRaw.match(/\b(?:TID|TerminalId|TermId|Terminal)\s*[:=]?\s*([A-Za-z0-9_\-]{4,16})\b/i);
    if (tidMatch) fields["41"] = tidMatch[1];
  }

  if (!fields["39"]) {
    const rcMatch = blockRaw.match(/\b(?:DE39|RespCode|ResponseCode|RC)\s*[:=]?\s*(\w{2,3})\b/i);
    if (rcMatch) fields["39"] = rcMatch[1];
  }

  if (!fields["4"]) {
    const amtMatch = blockRaw.match(/\b(?:Amount|Montant)\s*[:=]?\s*(\d+(?:\.\d{2})?)\b/i);
    if (amtMatch) fields["4"] = amtMatch[1];
  }

  if (!fields["49"]) {
    const curMatch = blockRaw.match(/\b(?:Currency|Devise|Cur)\s*[:=]?\s*(\d{3}|[A-Z]{3})\b/i);
    if (curMatch) fields["49"] = curMatch[1];
  }

  // Masquage PAN DE2 si présent
  if (fields["2"]) {
    fields["2"] = maskSensitiveData(fields["2"]);
  }
  const rawPanMatch = blockRaw.match(/\b(4\d{15}|5[1-5]\d{14}|6\d{15})\b/);
  if (rawPanMatch && !fields["2"]) {
    fields["2"] = maskSensitiveData(rawPanMatch[1]);
  }

  // Dumps hexadécimaux
  const hexDump = parseHexDump(blockRaw);
  if (!fields["37"] && hexDump?.detectedRrn) {
    fields["37"] = hexDump.detectedRrn;
  }

  // Conversion de code réponse
  const responseCodeConversion = extractResponseCodeConversion(blockRaw);

  return {
    eventId,
    fileId,
    timestampRaw: timestampRaw || new Date().toISOString(),
    timestampIso,
    epochMs,
    realm,
    eventType,
    direction,
    mti: fields["0"] || hexDump?.detectedMti,
    isoFields: fields,
    responseCodeConversion,
    hexDump,
    rawContent: blockRaw,
    sourceStart,
    sourceEnd,
    parseStatus: "success",
  };
}

/**
 * Détecte si le fichier est un log jPOS/XML ou un fichier plat / trace TRC.
 */
export function detectLogFormat(content: string): "JPOS_XML" | "FLAT_OR_TRC" {
  if (/<log\b/i.test(content) && /<\/log>/i.test(content)) {
    return "JPOS_XML";
  }
  return "FLAT_OR_TRC";
}

/**
 * Parseur universel de logs monétiques :
 * - Format A : jPOS / ISOChannel XML (<log realm="...">...</log>)
 * - Format B : Fichiers plats, traces transaction.TRC, logs textuels de switch
 */
export function parseLogFileContent(
  content: string,
  fileId: string,
  maxEvents: number = 30000
): {
  events: LogEvent[];
  rrnIndex: Map<string, string[]>;
  stanIndex: Map<string, string[]>;
  parseErrors: number;
} {
  const events: LogEvent[] = [];
  const rrnIndex = new Map<string, string[]>();
  const stanIndex = new Map<string, string[]>();
  let parseErrors = 0;

  const format = detectLogFormat(content);

  if (format === "JPOS_XML") {
    // Mode 1 : jPOS XML
    const logBlockRegex = /<log\b[\s\S]*?<\/log>/g;
    let match: RegExpExecArray | null;
    let eventIndex = 0;

    while ((match = logBlockRegex.exec(content)) !== null) {
      if (eventIndex >= maxEvents) break;
      const blockRaw = match[0];
      const sourceStart = match.index;
      const sourceEnd = sourceStart + blockRaw.length;

      try {
        const event = parseLogBlock(
          blockRaw,
          fileId,
          eventIndex + 1,
          sourceStart,
          sourceEnd
        );
        events.push(event);

        const rrn = event.isoFields["37"] || event.hexDump?.detectedRrn;
        if (rrn && rrn !== "xxxxxxxxxx") {
          const existing = rrnIndex.get(rrn) ?? [];
          existing.push(event.eventId);
          rrnIndex.set(rrn, existing);
        }

        const stan = event.isoFields["11"] || event.hexDump?.detectedStan;
        if (stan && stan !== "xxxxxxxxxx") {
          const existingStan = stanIndex.get(stan) ?? [];
          existingStan.push(event.eventId);
          stanIndex.set(stan, existingStan);
        }

        eventIndex++;
      } catch (_) {
        parseErrors++;
      }
    }
  } else {
    // Mode 2 : Fichier plat ou trace transaction.TRC
    // Détection de délimiteurs de traces structurés (ex: === START, === NEXT, --- TRACE, *** TRANS)
    let rawBlocks: string[] = [];
    if (/(?:===|\*\*\*|---)\s*(?:START|NEXT|EVENT|TRANS|TRACE|HOP)\b/i.test(content)) {
      rawBlocks = content
        .split(/(?=(?:===|\*\*\*|---)\s*(?:START|NEXT|EVENT|TRANS|TRACE|HOP)\b)/gi)
        .map((b) => b.trim())
        .filter((b) => b.length > 8 && !/^(?:===|\*\*\*|---)\s*END/i.test(b));
    } else {
      // Découpage par timestamps en début de ligne ou blocs délimités
      rawBlocks = content.split(
        /\n(?=(?:\[?\d{4}[-/]\d{2}[-/]\d{2}|\d{2}[-/]\d{2}[-/]\d{2,4}|[A-Za-z]{3}\s+\d{1,2})[ T]\d{2}:\d{2}:\d{2})/gi
      );
    }

    let currentOffset = 0;
    let eventIndex = 0;

    for (const b of rawBlocks) {
      if (eventIndex >= maxEvents) break;
      const trimmed = b.trim();
      if (!trimmed || trimmed.length < 5) {
        currentOffset += b.length + 1;
        continue;
      }

      const sourceStart = currentOffset;
      const sourceEnd = sourceStart + b.length;
      currentOffset = sourceEnd + 1;

      try {
        const event = parseFlatOrTrcBlock(
          trimmed,
          fileId,
          eventIndex + 1,
          sourceStart,
          sourceEnd
        );
        events.push(event);

        const rrn = event.isoFields["37"] || event.hexDump?.detectedRrn;
        if (rrn && rrn !== "xxxxxxxxxx") {
          const existing = rrnIndex.get(rrn) ?? [];
          existing.push(event.eventId);
          rrnIndex.set(rrn, existing);
        }

        const stan = event.isoFields["11"] || event.hexDump?.detectedStan;
        if (stan && stan !== "xxxxxxxxxx") {
          const existingStan = stanIndex.get(stan) ?? [];
          existingStan.push(event.eventId);
          stanIndex.set(stan, existingStan);
        }

        eventIndex++;
      } catch (_) {
        parseErrors++;
      }
    }
  }

  return { events, rrnIndex, stanIndex, parseErrors };
}

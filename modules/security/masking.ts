/**
 * Sécurité et conformité Monétique :
 * Masquage obligatoire des données sensibles (PAN, PIN blocks, Cryptogrammes)
 */

export function maskPAN(pan?: string | null): string {
  if (!pan) return "";
  const cleaned = pan.replace(/\s+/g, "");
  if (cleaned.length < 10) return "************";
  const first6 = cleaned.slice(0, 6);
  const last4 = cleaned.slice(-4);
  return `${first6}${"*".repeat(cleaned.length - 10)}${last4}`;
}

export function maskPinBlock(pinBlock?: string | null): string {
  if (!pinBlock) return "";
  return "**************** (PIN MASQUÉ)";
}

export function maskSensitiveFields(message: string): string {
  if (!message) return "";
  // Masque les numéros de carte (13 à 19 chiffres)
  let masked = message.replace(/\b([3-6]\d{5})(\d{4,10})(\d{4})\b/g, (_m, p1, p2, p3) => {
    return `${p1}${"*".repeat(p2.length)}${p3}`;
  });

  // Masque les CVV / CVC
  masked = masked.replace(/(CVV|CVC|CID|CVV2)[:=]\s*(\d{3,4})/gi, "$1=***");

  // Masque les blocs PIN
  masked = masked.replace(/(PIN|PINBLOCK)[:=]\s*([0-9A-Fa-f]{16})/gi, "$1=[MASQUÉ]");

  return masked;
}

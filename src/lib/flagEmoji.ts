export function iso2ToFlagEmoji(iso2: string): string {
  if (!iso2 || iso2.length !== 2) return "";
  const code = iso2.toUpperCase();
  const A = 0x1f1e6;
  const base = "A".charCodeAt(0);
  const first = code.charCodeAt(0) - base + A;
  const second = code.charCodeAt(1) - base + A;
  // validar A-Z
  if (code.charCodeAt(0) < 65 || code.charCodeAt(0) > 90) return "";
  if (code.charCodeAt(1) < 65 || code.charCodeAt(1) > 90) return "";
  return String.fromCodePoint(first, second);
}

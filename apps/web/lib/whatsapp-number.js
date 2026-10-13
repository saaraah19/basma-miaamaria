// WhatsApp's wa.me link needs ONE number, digits only, with the country code
// and no leading 0 (e.g. 213770123456). The "phone" field in the admin is free
// text, so it may hold two numbers ("0562 58 09 95 / 0770 12 34 56") or even
// two numbers glued together. Stripping non-digits, as this used to do, then
// produced a single 20-digit number that WhatsApp rejects.
//
// This finds every Algerian mobile number in the text (05/06/07..., with or
// without +213), and returns ONE of them, preferring a 07 number.
const DEFAULT_NUMBER = "213793368389";

// 0 5/6/7 + 8 digits, or +213 5/6/7 + 8 digits.
const MOBILE = /(?:\+?213|0)[567]\d{8}/g;

export function pickWhatsAppNumber(raw, fallback = DEFAULT_NUMBER) {
  const text = String(raw ?? "");

  // Remove the spaces, dots, dashes and brackets people type INSIDE a number.
  // Slashes, commas and "+" stay: they are what separates two numbers.
  const squashed = text.replace(/[\s.\-()]/g, "");

  const numbers = (squashed.match(MOBILE) ?? []).map((n) => {
    const digits = n.replace("+", "");
    return digits.startsWith("213") ? digits : `213${digits.slice(1)}`;
  });

  if (numbers.length > 0) {
    // 07 numbers are 2137xxxxxxxx once the country code is added.
    return numbers.find((n) => n.startsWith("2137")) ?? numbers[0];
  }

  // Not an Algerian mobile (e.g. a foreign number): keep the old behaviour.
  return text.replace(/\D/g, "") || fallback;
}

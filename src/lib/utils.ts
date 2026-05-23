/**
 * Class names utility — gộp nhiều className strings, lọc falsy values.
 */
export function cn(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format số điện thoại Việt Nam: 0985350570 → 0985.350.570
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 4)}.${digits.slice(4, 7)}.${digits.slice(7)}`;
  }
  return phone;
}

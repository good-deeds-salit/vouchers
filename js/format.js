// Formatting helpers for prices, dates and phone numbers.

export function formatShekel(amount) {
  return `${new Intl.NumberFormat("he-IL").format(amount)} ₪`;
}

// "2027-02-28" -> "28.02.2027"
export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

// "054-456-4602" -> "tel:0544564602"
export function phoneHref(phone) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

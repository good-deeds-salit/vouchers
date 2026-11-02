// Loading, validating and filtering voucher data. All data comes from data/vouchers.json.
const DATA_URL = "data/vouchers.json";
const ISRAEL_TIME_ZONE = "Asia/Jerusalem";
const REQUIRED_FIELDS = [
  "id",
  "businessId",
  "businessName",
  "offer",
  "voucherValue",
  "discountedPrice",
  "description",
  "category",
  "expirationDate",
];
const WHATSAPP_URL = /^https:\/\/(chat\.whatsapp\.com\/[A-Za-z0-9]+|wa\.me\/\S+)$/;

export async function loadVouchers() {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`Failed to load ${DATA_URL}: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data.vouchers) ? data.vouchers : [];
}

// Today's date in Israel as "YYYY-MM-DD".
function todayInIsrael() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ISRAEL_TIME_ZONE }).format(new Date());
}

// A voucher is valid through the end of its expiration date (Israel time).
export function isExpired(voucher, today = todayInIsrael()) {
  return voucher.expirationDate < today;
}

function isValid(voucher) {
  const missing = REQUIRED_FIELDS.filter((field) => voucher[field] === undefined || voucher[field] === "");
  if (missing.length > 0) {
    console.warn(`Skipping voucher ${voucher.id ?? "(no id)"}: missing ${missing.join(", ")}`);
    return false;
  }
  return true;
}

// Only published, valid, non-expired vouchers are shown. Expired records stay in the data file.
export function getVisibleVouchers(vouchers) {
  const today = todayInIsrael();
  return vouchers.filter((voucher) => voucher.published === true && isValid(voucher) && !isExpired(voucher, today));
}

export function isValidWhatsAppUrl(url) {
  return typeof url === "string" && WHATSAPP_URL.test(url);
}

export function isValidWebsiteUrl(url) {
  return typeof url === "string" && url.startsWith("https://");
}

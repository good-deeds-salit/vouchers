// Site-level "שתפו בוואטסאפ" button: shares the website URL. Unrelated to business WhatsApp group links.
const SHARE_MESSAGE =
  "השוברים השווים של דוכן המעשים הטובים – כל ההכנסות לתרומה! 27.11.26 בשעה 15:00, ברחבת המועדון.";

export function initShareButton(button) {
  if (!button) return;
  const pageUrl = window.location.href.split("#")[0];
  const text = `${SHARE_MESSAGE}\n${pageUrl}`;
  button.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
}

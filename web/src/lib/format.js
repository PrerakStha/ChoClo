

export function formatPrice (paisa, currency="NPR") {
const amount = paisa/100;
const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits:2,
    maximumFractionDigits:2,
});
return `${currency} ${formatted}`;
}
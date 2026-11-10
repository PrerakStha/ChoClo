

export function formatPrice (paisa, currency="NPR") {
const amount = paisa/100;
const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits:2,
    maximumFractionDigits:2,
});
return `${currency} ${formatted}`;
}

const STATUS_LABELS = {
  PENDING: "Order received",
  CONFIRMED: "Confirmed",
  SHIPPED: "On the way",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function formatStatus(status){
    return STATUS_LABELS[status] || status;

}

export function formatDate(value){
    return new Date(value).toLocaleDateString("en-GB",{
        day: "numeric",
        month: "short",
        year: "numeric"
    })
}
const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatCOP(value: string | number): string {
  const amount = typeof value === "number" ? value : parseFloat(value);
  return Number.isNaN(amount) ? "" : copFormatter.format(amount);
}

export function parseCOP(text: string): string {
  return text.replace(/\D/g, "");
}

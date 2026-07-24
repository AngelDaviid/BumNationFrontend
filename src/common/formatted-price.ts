export const formattedPrice = (price: string) => {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
  }).format(parseFloat(price));
}

  
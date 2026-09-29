export const formattedDate = (date: string | null | undefined) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

// Fecha en formato YYYY-MM-DD para inputs de tipo date
export const toDateInput = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
};

export const addMonths = (date: Date | string, months: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

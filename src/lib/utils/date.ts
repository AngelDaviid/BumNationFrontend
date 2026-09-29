export function formatDateOnly(isoString: string | null | undefined, fallBack: "No inscrito") {
    if (!isoString) return fallBack;

    const [yera, month, day] = isoString.split("T")[0].split("-");
    return `${day}/${month}/${yera}`;
}
export function formatDate(date: string | Date | null | undefined) {
    if (!date) return "—";
    return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}

// Fecha de hoy en formato YYYY-MM-DD para inputs de tipo date
export function todayInputValue() {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// Mismo cálculo que el backend (addOneMonth): si el día no existe, usa el último del mes
export function addOneMonth(date: string | Date) {
    const result = new Date(date);
    const originalDay = result.getDate();
    result.setMonth(result.getMonth() + 1);
    if (result.getDate() !== originalDay) result.setDate(0);
    return result;
}

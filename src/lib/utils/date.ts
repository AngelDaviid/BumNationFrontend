export function formatDateOnly(isoString: string | null | undefined, fallBack: "No inscrito") {
    if (!isoString) return fallBack;

    const [yera, month, day] = isoString.split("T")[0].split("-");
    return `${day}/${month}/${yera}`;
}
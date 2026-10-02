export function getApiErrorMessage(error: unknown, fallback = "Ocurrió un error inesperado") {
  if (!error) return fallback;
  if (error instanceof Error) return error.message || fallback;
  if (typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}

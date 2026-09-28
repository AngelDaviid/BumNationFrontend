import { Suspense } from "react";
import { notFound } from "next/navigation";
import { UiTest } from "./ui-test";

export const metadata = {
  title: "UI Test",
};

// Página de pruebas visuales: solo disponible en desarrollo
export default function UiTestPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <Suspense>
      <UiTest />
    </Suspense>
  );
}

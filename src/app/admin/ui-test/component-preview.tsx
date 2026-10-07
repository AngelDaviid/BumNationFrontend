"use client";

import {
  Component,
  createContext,
  CSSProperties,
  ErrorInfo,
  ReactNode,
  useContext,
} from "react";

export type ComponentOrigin = "propio" | "shadcn";

interface UiTestContextValue {
  reportError: (id: string, error: Error) => void;
  originOf: (id: string) => ComponentOrigin;
}

export const UiTestContext = createContext<UiTestContextValue>({
  reportError: () => {},
  originOf: () => "propio",
});

export function OriginBadge({ origin }: { origin: ComponentOrigin }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        origin === "shadcn" ? "bg-zinc-900 text-white" : "bg-neon/20 text-brand-text"
      }`}
    >
      {origin === "shadcn" ? "shadcn" : "Propio"}
    </span>
  );
}

interface BoundaryProps {
  id: string;
  onError: (id: string, error: Error) => void;
  children: ReactNode;
}

interface BoundaryState {
  error: Error | null;
}

class PreviewErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ui-test] ${this.props.id}`, error, info.componentStack);
    this.props.onError(this.props.id, error);
  }

  render() {
    const { error } = this.state;

    if (error) {
      return (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">El componente lanzó un error al renderizar</p>
          <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-xs">
            {error.message}
          </pre>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="mt-3 rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-medium hover:bg-red-100"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ComponentPreviewProps {
  id: string;
  title: string;
  file: string;
  notes?: string[];
  dark?: boolean;
  children: ReactNode;
}

export function ComponentPreview({
  id,
  title,
  file,
  notes,
  dark = false,
  children,
}: ComponentPreviewProps) {
  const { reportError, originOf } = useContext(UiTestContext);

  return (
    <section id={id} className="scroll-mt-6 rounded-xl border border-zinc-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-5 py-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-zinc-900">{title}</h3>
          <OriginBadge origin={originOf(id)} />
        </div>
        <code className="text-xs text-zinc-500">{file}</code>
      </header>

      {notes && notes.length > 0 && (
        <ul className="space-y-1 border-b border-amber-200 bg-amber-50 px-5 py-2 text-xs text-amber-800">
          {notes.map((note) => (
            <li key={note}>⚠ {note}</li>
          ))}
        </ul>
      )}

      <div className={`p-5 ${dark ? "bg-zinc-950" : ""}`}>
        <PreviewErrorBoundary id={id} onError={reportError}>
          {children}
        </PreviewErrorBoundary>
      </div>
    </section>
  );
}

// Los componentes con `position: fixed` (navbars, sidebar, menús) se
// posicionan respecto a este marco gracias al transform, no a la ventana.
export function FixedFrame({
  height,
  children,
}: {
  height: number;
  children: ReactNode;
}) {
  const style: CSSProperties = { height, transform: "translateZ(0)" };

  return (
    <div
      style={style}
      className="relative overflow-hidden rounded-lg border border-dashed border-zinc-400 bg-zinc-100"
    >
      {children}
    </div>
  );
}

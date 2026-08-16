import React from "react";
import i18n from "@/i18n";

type Props = {
  children: React.ReactNode;
  fallback?: (error: unknown) => React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: unknown;
};

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: unknown) {
    // Technical detail stays in the console; users never see a stack trace.
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error);
  }

  override render() {
    if (this.state.hasError) {
      const fallback = this.props.fallback?.(this.state.error);
      if (fallback) return fallback;

      return (
        <div className="p-6" role="alert">
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <h2 className="text-lg font-semibold text-destructive">
              {i18n.t("components.misc.errorBoundary.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {i18n.t("components.misc.errorBoundary.description")}
            </p>
            {import.meta.env.DEV && (
              <pre className="mt-3 max-h-48 overflow-auto rounded bg-background/60 p-3 text-xs text-foreground">
                {String(this.state.error)}
              </pre>
            )}
            <button
              type="button"
              onClick={() => window.location.assign("/")}
              className="mt-4 inline-flex min-h-[44px] items-center rounded-md border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {i18n.t("pages.notFound.backHome")}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: (error: unknown) => React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: unknown;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown) {
    // Surface errors in console for debugging
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      const fallback = this.props.fallback?.(this.state.error);
      if (fallback) return fallback;

      return (
        <div className="p-6">
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <h2 className="text-lg font-semibold text-destructive">Map failed to render</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A runtime error occurred while loading the map view.
            </p>
            <pre className="mt-3 max-h-48 overflow-auto rounded bg-background/60 p-3 text-xs text-foreground">
              {String(this.state.error)}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

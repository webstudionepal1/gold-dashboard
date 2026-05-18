import React from "react";

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<object>,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const err =
      error instanceof Error ? error : new Error(String(error));
    return { hasError: true, error: err };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      const message =
        this.state.error?.message ||
        "An unexpected error occurred. Open the browser console (F12) for details.";
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-b from-purple-500 to-blue-700 px-4">
          <h2 className="text-xl uppercase tracking-wide opacity-75">
            Something went wrong
          </h2>
          <h1 className="text-3xl sm:text-5xl font-bold mt-3 text-center">
            App error
          </h1>
          <p className="text-lg mt-4 opacity-90 max-w-xl text-center">
            This is not a missing page — a runtime error occurred. Check the
            browser console for details, or try again after a refresh.
          </p>
          <p className="text-sm mt-4 opacity-80 max-w-2xl text-center font-mono break-words">
            {message}
          </p>
          <p className="text-lg mt-6 opacity-80">
            Need help? +977 9819682900
          </p>

          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-100 transition"
          >
            Go to home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

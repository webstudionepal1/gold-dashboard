import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
    window.location.replace('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-b from-purple-500 to-blue-700">
          <h2 className="text-xl uppercase tracking-wide opacity-75">
            Page Under Construction
          </h2>
          <h1 className="text-5xl font-bold mt-3">404 error page</h1>
          <p className="text-lg mt-2 opacity-80">Expected soon to be working</p>
          <p className="text-lg mt-2 opacity-80">
            Hit a quick call to get respond quickly : +977 9819682900
          </p>

          <button
            onClick={this.handleReload}
            className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-100 transition"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

export default ErrorBoundary;

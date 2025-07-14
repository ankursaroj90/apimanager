import React from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">
              <FiAlertTriangle />
            </div>
            
            <div className="error-content">
              <h1>Oops! Something went wrong</h1>
              <p>We're sorry, but something unexpected happened.</p>
              
              <div className="error-actions">
                <button 
                  className="btn btn-primary"
                  onClick={this.handleReload}
                >
                  <FiRefreshCw />
                  Reload Page
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={this.handleGoHome}
                >
                  <FiHome />
                  Go Home
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="error-details">
                  <summary>Error Details (Development Only)</summary>
                  <div className="error-stack">
                    <h4>Error:</h4>
                    <pre>{this.state.error && this.state.error.toString()}</pre>
                    
                    <h4>Component Stack:</h4>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
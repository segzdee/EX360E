// EXTRASTAFF360 Platform Core Implementation
// Version: 2.0.0
// Environment: Production

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Core Application Components
import { AppRouter } from './routing/AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingProvider } from './contexts/LoadingContext';
import { theme } from './theme/customTheme';

// Service Worker Registration
import { registerServiceWorker } from './serviceWorker';

// Analytics and Monitoring
import { initializeAnalytics } from './services/analytics';
import { setupErrorTracking } from './services/errorTracking';

// API and WebSocket Configuration
import { setupAxiosInterceptors } from './services/api';
import { initializeWebSocket } from './services/websocket';

// Configuration Constants
const CONFIG = {
  API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT || 'https://api.extrastaff360.com',
  WEBSOCKET_URL: process.env.REACT_APP_WEBSOCKET_URL || 'wss://realtime.extrastaff360.com',
  ENVIRONMENT: process.env.NODE_ENV || 'production',
  VERSION: '2.0.0',
};

// Initialize QueryClient with optimal configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
      cacheTime: 3600000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Performance Monitoring
const performanceMonitor = {
  markInitialLoad: () => {
    if (window.performance && window.performance.mark) {
      window.performance.mark('appInitialLoad');
    }
  },
  measureLoadTime: () => {
    if (window.performance && window.performance.measure) {
      window.performance.measure('appLoadTime', 'appInitialLoad');
    }
  },
};

// Application Initialization
class ApplicationInitializer {
  static async initialize() {
    try {
      // Initialize core services
      await Promise.all([
        setupAxiosInterceptors(),
        initializeAnalytics(),
        setupErrorTracking(),
        initializeWebSocket(CONFIG.WEBSOCKET_URL),
      ]);

      // Mark initial load for performance tracking
      performanceMonitor.markInitialLoad();

      return true;
    } catch (error) {
      console.error('Application initialization failed:', error);
      return false;
    }
  }
}

// Root Component Implementation
const RootComponent = () => {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    ApplicationInitializer.initialize()
      .then((success) => {
        setIsInitialized(success);
        performanceMonitor.measureLoadTime();
      })
      .catch((err) => {
        setError(err);
        console.error('Initialization error:', err);
      });
  }, []);

  if (error) {
    return (
      <div className="error-container">
        <h1>Application Initialization Failed</h1>
        <p>Please refresh the page or contact support.</p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="loading-container">
        <h1>Initializing EXTRASTAFF360 Platform</h1>
        <p>Please wait while we configure your experience...</p>
      </div>
    );
  }

  return (
    <StrictMode>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorBoundary>
              <LoadingProvider>
                <AuthProvider>
                  <WebSocketProvider url={CONFIG.WEBSOCKET_URL}>
                    <AppRouter />
                  </WebSocketProvider>
                </AuthProvider>
              </LoadingProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </QueryClientProvider>
      </RecoilRoot>
    </StrictMode>
  );
};

// Application Bootstrap
const container = document.getElementById('root');
const root = createRoot(container);

root.render(<RootComponent />);

// Register Service Worker for PWA Support
registerServiceWorker();

// Export Configuration for External Access
export { CONFIG };

// Development Environment Utilities
if (CONFIG.ENVIRONMENT === 'development') {
  window.__EXTRASTAFF360_CONFIG__ = CONFIG;
  window.__EXTRASTAFF360_VERSION__ = CONFIG.VERSION;
  
  console.info(`
    EXTRASTAFF360 Platform
    Version: ${CONFIG.VERSION}
    Environment: ${CONFIG.ENVIRONMENT}
    API Endpoint: ${CONFIG.API_ENDPOINT}
    WebSocket URL: ${CONFIG.WEBSOCKET_URL}
  `);
}

// Error Handling for Uncaught Exceptions
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error });
  // Implement error reporting logic here
};

// Performance Metrics Collection
if (window.performance) {
  window.addEventListener('load', () => {
    const timing = window.performance.timing;
    const pageLoad = timing.loadEventEnd - timing.navigationStart;
    console.info(`Page Load Time: ${pageLoad}ms`);
    
    // Send metrics to analytics service
    if (pageLoad > 3000) {
      console.warn('Page load time exceeded threshold');
    }
  });
}

export const environment = {
  production: false,
  staging: false,
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 30000,
  enableLogging: true,
  enableDebugMode: true,
  bankName: 'Bank Masr',
  version: '1.0.0',
  features: {
    enablePwaFeatures: false,
    enableAnalytics: false,
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
  },
  auth: {
    tokenExpirationTime: 3600000, // 1 hour
    refreshTokenExpirationTime: 604800000, // 7 days
    enableRememberMe: true,
  },
  ui: {
    theme: 'default',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'ar'],
    enableRTL: true,
  },
};

export const environment = {
  production: true,
  staging: false,
  apiUrl: 'https://api.bankmasr.com/api',
  apiTimeout: 10000,
  enableLogging: false,
  enableDebugMode: false,
  bankName: 'Bank Masr',
  version: '1.0.0',
  features: {
    enablePwaFeatures: true,
    enableAnalytics: true,
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
  },
  auth: {
    tokenExpirationTime: 1800000, // 30 minutes
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

export const environment = {
  production: false,
  staging: true,
  apiUrl: 'https://staging-api.bankmasr.com/api',
  apiTimeout: 15000,
  enableLogging: true,
  enableDebugMode: true,
  bankName: 'Bank Masr (Staging)',
  version: '1.0.0-staging',
  features: {
    enablePwaFeatures: true,
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

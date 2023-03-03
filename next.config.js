/** @type {import("next").NextConfig} */

module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  webpack: (config) => {
    // Fixes yarn packages that depend on `fs` module
    config.resolve.fallback = { fs: false };
    config.experiments = {
      topLevelAwait: true, // Fix top-level-await experiment enable
      layers: true, // Fix layers experiment enable
    };
    return config;
  },
  images: {
    domains: ["dev-qrco.s3.amazonaws.com"],
  },
  env: {
    // ADD ALL APPLICATION ENVIRONMENT VARIABLES HERE IN ALPHABETICAL ORDER

    AMZ_WS_ACCESS_KEY_ID: process.env.AMZ_WS_ACCESS_KEY_ID || process.env.REACT_AWS_ACCESS_KEY_ID,
    AMZ_WS_ACCOUNT_ID: process.env.AMZ_WS_ACCOUNT_ID,
    AMZ_WS_BUCKET_NAME: process.env.AMZ_WS_BUCKET_NAME || process.env.REACT_AWS_BUCKET_NAME,
    AMZ_WS_COGNITO_CLIENT_ID: process.env.AMZ_WS_COGNITO_CLIENT_ID || process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
    AMZ_WS_COGNITO_INDETITY_POOL_ID: process.env.AMZ_WS_COGNITO_INDETITY_POOL_ID,
    AMZ_WS_COGNITO_USER_POOL_ID: process.env.AMZ_WS_COGNITO_USER_POOL_ID || process.env.REACT_AWS_COGNITO_POOL_ID,
    AMZ_WS_DYNAMODB_URL: process.env.AMZ_WS_DYNAMODB_URL || process.env.REACT_AWS_DYNAMODB_URL,
    AMZ_WS_EBANUX_ADMIN_ROLE: process.env.AMZ_WS_EBANUX_ADMIN_ROLE || 'ebanux-admin',
    AMZ_WS_EBANUX_USER_ROLE: process.env.AMZ_WS_EBANUX_USER_ROLE || 'ebanux-user',
    AMZ_WS_REGION: process.env.AMZ_WS_REGION || process.env.REACT_AWS_REGION || 'us-east-1',
    AMZ_WS_SECRET_ACCESS_KEY: process.env.AMZ_WS_SECRET_ACCESS_KEY || process.env.REACT_AWS_SECRET_ACCESS_KEY,

    API_BASE_PATH: process.env.API_BASE_PATH || process.env.REACT_APP_API_BASE_PATH,
    APP_ENV: process.env.APP_ENV || process.env.REACT_NODE_ENV,

    CURRENT_USER_SERVICE_PATH: process.env.CURRENT_USER_SERVICE_PATH || process.env.REACT_APP_CURRENT_USER_SERVICE_PATH,
    DEFAULT_MAX_STATS_PER_LINK: process.env.DEFAULT_MAX_STATS_PER_LINK,

    GOOGLE_SAFE_BROWSING_KEY: process.env.GOOGLE_SAFE_BROWSING_KEY,

    LINK_LENGTH: process.env.LINK_LENGTH || process.env.REACT_APP_LINK_LENGTH,

    LINK_CODE_ALPHABET: process.env.LINK_CODE_ALPHABET || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    LOGOUT_REDIRECT_URI: process.env.LOGOUT_REDIRECT_URI || process.env.REACT_APP_LOGOUT_REDIRECT_URI,
    LOGOUT_URL: process.env.LOGOUT_URL || process.env.REACT_APP_LOGOUT_URL,

    MAX_ALLOW_COLLISIONS: process.env.MAX_ALLOW_COLLISIONS || '25',
    MICRO_SITES_BASE_URL: process.env.MICRO_SITES_BASE_URL || process.env.REACT_MICROSITES_ROUTE || 'http://localhost:3001',

    NON_USER_COOLDOWN: process.env.NON_USER_COOLDOWN || process.env.REACT_APP_NON_USER_COOLDOWN,

    OAUTH_REDIRECT_URI: process.env.OAUTH_REDIRECT_URI || process.env.REACT_APP_OAUTH_REDIRECT_URI,
    OAUTH_SCOPE: process.env.OAUTH_SCOPE || process.env.REACT_APP_OAUTH_SCOPE,
    OAUTH_TOKEN_URL: process.env.OAUTH_TOKEN_URL || process.env.REACT_APP_OAUTH_TOKEN_URL,
    OAUTH_URL: process.env.OAUTH_URL || process.env.REACT_APP_OAUTH_URL,

    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || 'ebanux-qrco-app',
    SESSION_SECRET: process.env.SESSION_SECRET,
    SERVER_BASE_URL: process.env.SERVER_BASE_URL || process.env.REACT_APP_SERVER_BASE_URL,
    SHORT_URL_DOMAIN: process.env.SHORT_URL_DOMAIN || process.env.REACT_APP_SHORT_URL_DOMAIN,
    SITE_NAME: process.env.SITE_NAME || process.env.REACT_APP_SITE_NAME,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || process.env.REACT_STRIPE_SECRET_KEY,
    STRIPE_EVENTS_SECRET: process.env.STRIPE_EVENTS_SECRET || process.env.REACT_STRIPE_WEBHOOK_SECRET,

    USER_LIMIT_PER_DAY: process.USER_LIMIT_PER_DAY || process.env.REACT_APP_USER_LIMIT_PER_DAY,

    FREE_DYNAMIC_QRS: process.env.FREE_DYNAMIC_QRS ? parseInt(process.env.FREE_DYNAMIC_QRS, 10) : 1,
  },
};

/** @type {import("next").NextConfig} */

module.exports = {
  reactStrictMode: false,
  swcMinify: true,
  webpack: (config) => {
    // Fixes yarn packages that depend on `fs` module
    config.resolve.fallback = {fs: false};
    config.experiments = {
      topLevelAwait: true, // Fix top-level-await experiment enable
      layers: true // Fix layers experiment enable
    };
    return config;
  },
  env: {
    REACT_APP_COOKIES_DOMAIN: process.env.REACT_APP_COOKIES_DOMAIN,
    REACT_AWS_COGNITO_CLIENT_ID: process.env.REACT_AWS_COGNITO_CLIENT_ID,
    REACT_AWS_COGNITO_DOMAIN: process.env.REACT_AWS_COGNITO_DOMAIN,
    REACT_AWS_COGNITO_LOGOUT_REDIRECT_URI: process.env.REACT_AWS_COGNITO_LOGOUT_REDIRECT_URI,
    REACT_AWS_COGNITO_POOL_ID: process.env.REACT_AWS_COGNITO_POOL_ID,
    REACT_AWS_COGNITO_REGION: process.env.REACT_AWS_COGNITO_REGION,
    REACT_AWS_ACCESS_KEY_ID: process.env.REACT_AWS_ACCESS_KEY_ID,
    REACT_AWS_DYNAMODB_URL: process.env.REACT_AWS_DYNAMODB_URL,
    REACT_AWS_REGION: process.env.REACT_AWS_REGION,
    REACT_AWS_SECRET_ACCESS_KEY: process.env.REACT_AWS_SECRET_ACCESS_KEY,
    REACT_APP_CUSTOM_DOMAIN_USE_HTTPS: process.env.REACT_APP_CUSTOM_DOMAIN_USE_HTTPS,
    REACT_APP_DEFAULT_DOMAIN: process.env.REACT_APP_DEFAULT_DOMAIN,
    REACT_APP_PORT: process.env.REACT_APP_PORT,
    REACT_APP_SITE_NAME: process.env.REACT_APP_SITE_NAME,
    REACT_APP_LINK_LENGTH: process.env.REACT_APP_LINK_LENGTH,
    REACT_APP_NON_USER_COOLDOWN: process.env.REACT_APP_NON_USER_COOLDOWN,
    REACT_APP_USER_LIMIT_PER_DAY: process.env.REACT_APP_USER_LIMIT_PER_DAY,
    REACT_APP_SHORT_URL_DOMAIN: process.env.REACT_APP_SHORT_URL_DOMAIN,
    REACT_AWS_BUCKET_NAME: process.env.REACT_AWS_BUCKET_NAME,
    REACT_NODE_ENV: process.env.REACT_NODE_ENV,
    REACT_STRIPE_WEBHOOK_SECRET: process.env.REACT_STRIPE_WEBHOOK_SECRET,
    REACT_STRIPE_SECRET_KEY: process.env.REACT_STRIPE_SECRET_KEY
  }
};

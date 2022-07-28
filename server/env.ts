import { cleanEnv, num, str, bool } from "envalid";

const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  SITE_NAME: str({ example: "Kutt" }),
  DEFAULT_DOMAIN: str({ example: "kutt.it" }),
  LINK_LENGTH: num({ default: 6 }),
  NEO4J_DB_URI: str({ default: "" }),
  NEO4J_DB_USERNAME: str({ default: "" }),
  NEO4J_DB_PASSWORD: str({ default: "" }),
  REDIS_HOST: str({ default: "127.0.0.1" }),
  REDIS_PORT: num({ default: 6379 }),
  REDIS_PASSWORD: str({ default: "" }),
  USER_LIMIT_PER_DAY: num({ default: 50 }),
  NON_USER_COOLDOWN: num({ default: 10 }),
  DEFAULT_MAX_STATS_PER_LINK: num({ default: 5000 }),
  DISALLOW_ANONYMOUS_LINKS: bool({ default: false }),
  DISALLOW_REGISTRATION: bool({ default: false }),
  CUSTOM_DOMAIN_USE_HTTPS: bool({ default: false }),
  ADMIN_EMAILS: str({ default: "" }),
  RECAPTCHA_SITE_KEY: str({ default: "" }),
  RECAPTCHA_SECRET_KEY: str({ default: "" }),
  GOOGLE_SAFE_BROWSING_KEY: str({ default: "" }),
  GOOGLE_ANALYTICS: str({ default: "" }),
  GOOGLE_ANALYTICS_UNIVERSAL: str({ default: "" }),
  MAIL_FROM: str({ default: "", example: "Ebanux Team <info@ebanux.com>" }),
  REPORT_EMAIL: str({ default: "" }),
  CONTACT_EMAIL: str({ default: "" }),
  SENTRY_PRIVATE_DSN: str({ default: "" }),
  SENTRY_PUBLIC_DSN: str({ default: "" })
});

export default env;

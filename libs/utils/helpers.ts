export const isProductionMode = process.env.APP_ENV === 'production';
export const microSitesBaseUrl = process.env.MICRO_SITES_BASE_URL || `https://${isProductionMode ? 'a' : 'dev.a'}-qr.link`;

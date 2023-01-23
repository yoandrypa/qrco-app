export const LANGUAGES = ["en", "es"];
export const THEMES_VARIANTS = { light: "light", dark: "dark" };
export const HEADER_HEIGHT = 60;
export const PRIMARY_LIGHT_COLOR = "#3f51b5";
export const PRIMARY_DARK_COLOR = "#272727";
export const MAIN_CONFIG = {
  locale: LANGUAGES[0],
  theme: THEMES_VARIANTS.light
};
export const PLAN_TEST_MODE_PRICES = {
  basic: "price_1MTXM3CHh3XhfaZrMhHGCiwH",
  business: "price_1MPLAcCHh3XhfaZrawQADusR",
  premium: "price_1MTXgACHh3XhfaZruWt2MiiM",
  basicAnnual: "price_1MPL1ZCHh3XhfaZrIS02aX7P",
  businessAnnual: "price_1MTXHaCHh3XhfaZrLKixYUQB",
  premiumAnnual: "price_1MTXgACHh3XhfaZrSRIk99mC"
};
export const PLAN_LIVE_MODE_PRICES = {
  basic: "price_1MTXQwCHh3XhfaZrhi0si85x",
  business: "price_1MPLBbCHh3XhfaZrkoH8mVtS",
  premium: "price_1MTXgICHh3XhfaZr7x3VO2Rl",
  basicAnnual: "price_1MTXQwCHh3XhfaZrUV2ru1LG",
  businessAnnual: "price_1MPLBbCHh3XhfaZrroLJFfFP",
  premiumAnnual: "price_1MTXgICHh3XhfaZrLJdZN2QW"
};
export const ALLOWED_FILE_EXTENSIONS = {
  pdf: ".pdf",
  gallery: [".jpg", ".jpeg", ".png", ".svg", ".gif"],
  audio: ".mp3",
  video: ".mp4"
};
export const FILE_LIMITS = {
  pdf: { totalFiles: 1, totalMbPerFile: 200 },
  gallery: { totalFiles: 25, totalMbPerFile: 20 },
  audio: { totalFiles: 1, totalMbPerFile: 30 },
  video: { totalFiles: 4, totalMbPerFile: 300 },
};

export const MEDIA = ['media', 'gallery', 'video'];
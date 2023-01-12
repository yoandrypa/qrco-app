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
  basic: "price_1MPKgZCHh3XhfaZr0TqlLqG5",
  business: "price_1MPLAcCHh3XhfaZrawQADusR",
  premium: "price_1MPLFYCHh3XhfaZrWh5DXZPR",
  basicAnnual: "price_1MPLAcCHh3XhfaZrF2OFNWnm",
  businessAnnual: "price_1Lf9DaCHh3XhfaZro7S6wRVr",
  premiumAnnual: "price_1MPLFYCHh3XhfaZrHdyDr93R"
};
export const PLAN_LIVE_MODE_PRICES = {
  basic: "price_1MPL3lCHh3XhfaZrYpbpbZxn",
  business: "price_1MPLBbCHh3XhfaZrkoH8mVtS",
  premium: "price_1MPLGWCHh3XhfaZrOU7pYjwf",
  basicAnnual: "price_1MPL3lCHh3XhfaZrXb4Szob3",
  businessAnnual: "price_1MPLBbCHh3XhfaZrroLJFfFP",
  premiumAnnual: "price_1MPLGWCHh3XhfaZrIFhzO0OO"
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
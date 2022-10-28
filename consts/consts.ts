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
  basic: "price_1LecysCHh3XhfaZr0xh4P1JM",
  business: "price_1LedMoCHh3XhfaZrTSi8Z5Bb",
  premium: "price_1LectfCHh3XhfaZr9k2POClc",
  basicAnnual: "price_1Lf9EoCHh3XhfaZra11UYGgn",
  businessAnnual: "price_1Lf9DaCHh3XhfaZro7S6wRVr",
  premiumAnnual: "price_1Lf9A1CHh3XhfaZr1k1ZJUu8"
};
export const PLAN_LIVE_MODE_PRICES = {
  basic: "price_1Lh8QICHh3XhfaZr1kwU4rc7",
  business: "price_1Lh8Q5CHh3XhfaZruiDFYMB7",
  premium: "price_1Lh8QRCHh3XhfaZrjAFxzmvL",
  basicAnnual: "price_1Lh8QICHh3XhfaZrJ1FCs2k1",
  businessAnnual: "price_1Lh8Q5CHh3XhfaZrG91l2Q66",
  premiumAnnual: "price_1Lh8QRCHh3XhfaZrjhtNHx2F"
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

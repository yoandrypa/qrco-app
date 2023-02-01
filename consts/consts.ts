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
  basic: "price_1MW7e3CHh3XhfaZrmbwkowKM",
  business: "price_1MW7zlCHh3XhfaZrLZt73L1S",
  premium: "price_1MWDH7CHh3XhfaZrLC8oWN0v",
  basicAnnual: "price_1MW7geCHh3XhfaZrpkSUolFd",
  businessAnnual: "price_1MW7zlCHh3XhfaZrlsF9vsw5",
  premiumAnnual: "price_1MWDH7CHh3XhfaZrFR42Ax1o"
};
export const PLAN_LIVE_MODE_PRICES = {
  basic: "price_1MW7mACHh3XhfaZrU2nwdQKe",
  business: "price_1MW809CHh3XhfaZrfwW8Whqo",
  premium: "price_1MWDIDCHh3XhfaZrjFNN7nR6",
  basicAnnual: "price_1MW7mACHh3XhfaZrZQ98fOAP",
  businessAnnual: "price_1MW809CHh3XhfaZrCpd7zl41",
  premiumAnnual: "price_1MWDIDCHh3XhfaZraAkO80iv"
};

export const PLAN_TEST_METERED_PRICES = {
  basic: "price_1MW7e3CHh3XhfaZrjOnpM5dj",
  business: "price_1MW7zlCHh3XhfaZrNL4jyCHq",
  premium: "price_1MWDH7CHh3XhfaZrYXWg1RYv",
  basicAnnual: "price_1MW7lxCHh3XhfaZrKb52XQcY",
  businessAnnual: "price_1MW7zlCHh3XhfaZrjM685Ouh",
  premiumAnnual: "price_1MWDH7CHh3XhfaZrGulKZjjZ"
}
export const PLAN_LIVE_METERED_PRICES = {
  basic: "price_1MW7mACHh3XhfaZrgyxBwFbN",
  business: "price_1MW809CHh3XhfaZrXHZ2SAfC",
  premium: "price_1MWDIDCHh3XhfaZroO33JooE",
  basicAnnual: "price_1MW7mACHh3XhfaZrOswgb4c3",
  businessAnnual: "price_1MW809CHh3XhfaZrLyTBnITt",
  premiumAnnual: "price_1MWDIDCHh3XhfaZr55RWy0D4"

}
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
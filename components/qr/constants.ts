import { ColorTypes, FontTypes } from "./types/types";

export const QR_TYPE_ROUTE = "/qr/type" as string;
export const QR_CONTENT_ROUTE = "/qr/content" as string;
export const QR_DESIGN_ROUTE = "/qr/design" as string;
export const QR_DETAILS_ROUTE = "/qr/[id]/details" as string;
export const QR_PLAN_ROUTE = "/plans/buy/[plan]" as string;
export const PLANS_ACCOUNT_PORTAL = "/plans/account" as string;

export const PRIVATE_ROUTES = [
  QR_TYPE_ROUTE,
  QR_CONTENT_ROUTE,
  QR_DESIGN_ROUTE,
  QR_DETAILS_ROUTE,
  PLANS_ACCOUNT_PORTAL,
  "/plans/buy/*",
  "/links/*",
  "/auth_callback"
];

export const DEFAULT_DYNAMIC_SELECTED = 'vcard+';
export const DEFAULT_STATIC_SELECTED = 'vcard';

export const PARAM_QR_TEXT = "qr_text" as string;

export const NO_MICROSITE = ["facebook", "twitter", "whatsapp", "paylink", "fundme"];
export const ONLY_QR = ["fundme", "paylink"];

export const PROFILE_IMAGE = ['vcard+', 'link', 'business', 'social', 'donation', 'petId', 'linkedLabel', 'custom', 'findMe'];

export const EMAIL = new RegExp("^\\w+(\\.\\w+)*(\\+\\w+(\\.\\w+)*)?@\\w+(\\.\\w+)+$", "i");
export const PHONE = new RegExp("^(\\+\\d{1,3}\\s?)?((\\(\\d{1,3}\\))|\\d{1,3})(\\s|\\-)?(\\d+((\\s|\\-)\\d+)*)$");
export const ZIP = new RegExp("^\\d{5}(-\\d{4})?$");
export const YEAR = new RegExp('^\\d{4}$');

export const EBANUX_PLATFORM_FEE = 0.04;

export const IS_DEV_ENV = process.env.REACT_NODE_ENV === "develop";

export const QRCODE_PLANS = {
  BASIC: {
    MONTHLY_PRICE: 9,
    YEARLY_PRICE: 90,
    DYNAMIC_QR_LIMIT: 50,
    EXTRA_QR_PRICE: 1.0
  },
  BUSINESS: {
    MONTHLY_PRICE: 15,
    YEARLY_PRICE: 135,
    DYNAMIC_QR_LIMIT: 100,
    EXTRA_QR_PRICE: 0.90
  },
  PREMIUM: {
    MONTHLY_PRICE: 45,
    YEARLY_PRICE: 360,
    DYNAMIC_QR_LIMIT: 500,
    EXTRA_QR_PRICE: 0.80
  }
}

export const DAYS = {
  sun: "Sunday",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday"
} as object;

export const FRAMES_LENGTH = 10 as number;

export const MAIN_ORANGE = '#fc4c02';

export const DEFAULT_COLORS = { p: '#0f4d8c', s: '#99c4f0' } as ColorTypes;

export const COLORS = [
  DEFAULT_COLORS,
  { p: "#1b5e20", s: "#c8e6c9" },
  { p: "#004d40", s: "#b2dfdb" },
  { p: "#827717", s: "#f0f4c3" },
  { p: "#e65100", s: "#ffe0b2" },
  { p: "#d50000", s: "#ffcdd2" },
  { p: "#4a148c", s: "#e1bee7" },
  { p: "#3e2723", s: "#d7ccc8" },
  { p: "#37474f", s: "#cfd8dc" },
  { p: "#006064", s: "#e6ee9c" },
  { p: "#880e4f", s: "#9fa8da" },
  { p: "#bf360c", s: "#a8a19b" },
  { p: "#212121", s: "#b0bec5" }
] as ColorTypes[];

export const FONTS = [
  { type: 'unset', name: 'Default' },
  { type: 'arial, sans-serif', name: 'Arial' },
  { type: 'arial black, sans-serif', name: 'Arial Black' },
  { type: 'verdana, sans-serif', name: 'Verdana' },
  { type: 'trebuchet ms, sans-serif', name: 'Trebuchet' },
  { type: 'impact, sans-serif', name: 'Impact' },
  { type: 'gill sans, sans-serif', name: 'Gill Sans' },
  { type: 'times new roman, serif', name: 'Times New Roman' },
  { type: 'georgia, serif', name: 'Georgia' },
  { type: 'courier, monospace', name: 'Courier' },
  { type: 'monaco, monospace', name: 'Monaco' },
  { type: 'comic sans ms, cursive', name: 'Comic Sans' }] as FontTypes[];

export const FONT_SIZES = ["default", "small", "medium", "large"] as string[];

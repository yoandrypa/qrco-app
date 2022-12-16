import { ColorTypes } from "./types/types";

export const QR_TYPE_ROUTE = '/qr/type' as string;
export const QR_CONTENT_ROUTE = '/qr/content' as string;
export const QR_DESIGN_ROUTE = '/qr/design' as string;
export const QR_DETAILS_ROUTE = '/qr/[id]/details' as string;
export const QR_PLAN_ROUTE = '/plans/buy/[plan]' as string;

export const PARAM_QR_TEXT = 'qr_text' as string;

export const NO_MICROSITE = ['facebook', 'twitter', 'whatsapp', 'paylink', 'fundme'];
export const ONLY_QR = ['fundme', 'paylink'];

export const EMAIL = new RegExp('^\\w+(\\.\\w+)*(\\+\\w+(\\.\\w+)*)?@\\w+(\\.\\w+)+$', 'i');
export const PHONE = new RegExp('^(\\+\\d{1,3}\\s?)?((\\(\\d{1,3}\\))|\\d{1,3})(\\s|\\-)?(\\d+((\\s|\\-)\\d+)*)$');
export const ZIP = new RegExp('^\\d{5}(-\\d{4})?$');

export const EBANUX_PLATFORM_FEE = 0.04;

export const IS_DEV_ENV = process.env.REACT_NODE_ENV === 'develop';

export const QRCODE_PLANS = {
  BASIC: {
    MONTHLY_PRICE: 9,
    YEARLY_PRICE: 90,
    DYNAMIC_QR_LIMIT: 5,
    EXTRA_QR_PRICE: 0.10
  },
  BUSINESS: {
    MONTHLY_PRICE: 15,
    YEARLY_PRICE: 135,
    DYNAMIC_QR_LIMIT: 100,
    EXTRA_QR_PRICE: 0.10
  },
  PREMIUM: {
    MONTHLY_PRICE: 45,
    YEARLY_PRICE: 360,
    DYNAMIC_QR_LIMIT: 1000,
    EXTRA_QR_PRICE: 0.10
  }
}

export const DAYS = {
  sun: 'Sunday',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday'
} as object;

export const FRAMES_LENGTH = 10 as number;

export const DEFAULT_COLORS = { p: '#0f4d8c', s: '#99c4f0' } as ColorTypes;

export const COLORS = [DEFAULT_COLORS, {p: '#187510', s: '#9ece99'}, {p: '#aa8412', s: '#d7c89a'},
  {p: '#b30909', s: '#dba8a8'}, {p: '#8c0f4a', s: '#dd9ebc'}, {p: '#40310f', s: '#a8a6a1'},
  {p: '#f704ce', s: '#f7ac04'}, {p: '#5473b7', s: '#5dc37c'}, {p: '#2d3a2c', s: '#ca9f2a'},
  {p: '#25877f', s: '#d71818'}, {p: '#f0d629', s: '#445b97'}, {p: '#f0630c', s: '#adb6cc'}, {p: '#0cd8f0', s: '#d8da07'}
] as ColorTypes[];


import { ColorTypes } from "./types/types";

export const QR_TYPE_ROUTE = '/qr/type' as string;
export const QR_CONTENT_ROUTE = '/qr/content' as string;
export const QR_DESIGN_ROUTE = '/qr/design' as string;
export const QR_PLAN_ROUTE = '/plans/buy/basic' as string;

export const PARAM_QR_TEXT = 'qr_text' as string;

export const NO_MICROSITE = ['web', 'facebook', 'twitter', 'whatsapp'];

export const EMAIL = new RegExp('^\\w+(\\.\\w+)*(\\+\\w+(\\.\\w+)*)?@\\w+(\\.\\w+)+$', 'i');
export const PHONE = new RegExp('^(\\+\\d{1,3}\\s?)?((\\(\\d{1,3}\\))|\\d{1,3})(\\s|\\-)?(\\d+((\\s|\\-)\\d+)*)$');
export const ZIP = new RegExp('^\\d{5}(-\\d{4})?$');

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

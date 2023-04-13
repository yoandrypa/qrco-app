import { isEmpty, isObject } from "@ebanux/ebanux-utils/utils";

export type FormatType = any[] | RegExp | Function | null;
export type KlassType = string | Function | null;

function checkRequired(value: any, required: boolean) {
  return !required || !isEmpty(value);
}

function checkType(value: any, type?: KlassType) {
  if (isEmpty(type) || isEmpty(value)) return true;
  if (type === 'array' && Array.isArray(value)) return true;
  if (type === 'object' && isObject(value)) return true;
  if (typeof type === 'string' && typeof value === type) return true;
  if (typeof type === 'function' && value instanceof type) return true;

  return false;
}

function checkFormat(value: any, format?: FormatType) {
  if (isEmpty(format) || isEmpty(value)) return true;
  if (Array.isArray(format)) return format.indexOf(value) !== -1;
  if (format instanceof RegExp) return format.test(value);
  if (typeof format === 'function') return format(value) === true;

  return false;
}

export function checkValidity(value: any, required?: boolean, type?: KlassType, format?: FormatType) {
  return checkRequired(value, !!required)
    && checkType(value, type)
    && checkFormat(value, format)
}

export const UrlFormat = /^https?:\/\/[^.]+(.[^.]+)+.*/
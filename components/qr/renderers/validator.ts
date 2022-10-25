import {PHONE, SOCIALS} from "../constants";
import {DataType} from "../types/types";

export default function socialsAreValid(data: DataType) {
  let result = true;
  SOCIALS.every((x: string) => {
    // @ts-ignore
    if (data[x] !== undefined && (!data[x].trim().length || (x === 'whatsapp' && !PHONE.test(data[x])))) {
      result = false;
      return false;
    }
    return true;
  });
  return result;
}

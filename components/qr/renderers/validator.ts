import {PHONE} from "../constants";
import {DataType, Type, SocialNetworksType} from "../types/types";

export default function socialsAreValid(data: DataType | Type) {
  let result = true;
  if (data?.socials?.length) {
    data.socials.every((x: SocialNetworksType) => {
      if ((x.value !== undefined && x.value.trim().length === 0) ||
        (x.network === 'whatsapp' && !PHONE.test(x.value || ''))) {
        result = false;
        return false;
      }
      return true;
    });
  }
  return result;
}

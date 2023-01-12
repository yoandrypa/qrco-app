import {DataType} from "../../types/types";
import {EMAIL, PHONE, ZIP} from "../../constants";
import {isValidUrl} from "../../../../utils";
import socialsAreValid from "../validator";

export const components = [
  {type: 'address', name: 'Address'}, {type: 'company', name: 'Company'}, {type: 'date', name: 'Date'},
  {type: 'email', name: 'Email and web'}, {type: 'easiness', name: 'Easiness'}, {type: 'links', name: 'Links'},
  {type: 'organization', name: 'Organization'}, {type: 'phones', name: 'Phones and cells'},
  {type: 'presentation', name: 'Presentation'}, {type: 'opening', name: 'Opening time'},
  {type: 'socials', name: 'Social networks'}, {type: 'title', name: 'Title and description'}
];

export const getName = (index: number) => {
  return components[index].name;
}

export const getNameStr = (type: string): string => {
  const index = components.findIndex(x => x.type === type);
  return getName(index);
}

export interface CustomProps {
  data: DataType;
  setData: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

export const validator = (data: DataType): boolean => {
  let errors = false;

  if (!data.company?.trim().length || !data.firstName?.trim().length || (data.phone?.trim().length && !PHONE.test(data.phone)) ||
    (data.fax?.trim().length && !PHONE.test(data.fax)) || (data.cell?.trim().length && !PHONE.test(data.cell)) ||
    (data.zip?.trim().length && !ZIP.test(data.zip)) || (data.web?.trim().length && !isValidUrl(data.web)) ||
    (data.email?.trim().length && !EMAIL.test(data.email))) {
    errors = true;
  } else if (data.urlOptionLabel !== undefined && data.urlOptionLink !== undefined) {
    if (!data.urlOptionLabel.trim().length || !data.urlOptionLink.trim().length || !isValidUrl(data.urlOptionLink)) {
      errors = true;
    }
  } else if (data?.isDynamic) {
    errors = !socialsAreValid(data);
  }

  return errors;
}

export const cleaner = (data: DataType, item: string): void => {
  if (item === 'easiness' && data.easiness !== undefined) {
    delete data.easiness;
  } else if (item === 'socials' && data.socials !== undefined) {
    delete data.socials;
  }
}

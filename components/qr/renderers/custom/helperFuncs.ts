import {CustomType, DataType, LinkType, Type} from "../../types/types";
import {EMAIL, PHONE, ZIP} from "../../constants";
import {isValidUrl} from "../../../../utils";
import socialsAreValid from "../validator";

export const components = [
  {type: 'address', name: 'Address'}, {type: 'company', name: 'Company'},
  {type: 'date', name: 'Date'}, {type: 'justEmail', name: 'Email address'},
  {type: 'email', name: 'Email and web'}, {type: 'easiness', name: 'Easiness'},
  {type: 'links', name: 'Links'}, {type: 'organization', name: 'Organization'},
  {type: 'phones', name: 'Phones and cells'}, {type: 'gallery', name: 'Photos'},
  {type: 'presentation', name: 'Presentation'}, {type: 'opening', name: 'Opening time'},
  {type: 'socials', name: 'Social networks'}, {type: 'title', name: 'Title and description'},
  {type: 'action', name: 'Action button'}, {type: 'single', name: 'Single text'},
  {type: 'pdf', name: 'PDF file'}, {type: 'audio', name: 'Audio files'}, {type: 'video', name: 'Video files'},
  {type: 'keyvalue', name: 'Details'}, {type: 'couponInfo', name: 'Promotion info', notInMenu: true},
  {type: 'couponData', name: 'Coupon data', notInMenu: true}, {type: 'petId', name: 'Pet presentation', notInMenu: true},
  {type: 'sku', name: 'Product', notInMenu: true}, {type: 'petId', name: 'Pet presentation', notInMenu: true}
];

export const getName = (index: number) => {
  return components[index].name;
}

const lookFor = (type: string): string => {
  const index = components.findIndex(x => x.type === type);
  return getName(index);
}

export const getNameStr = (type: string, selected: string): string => {
  if (['inventory'].includes(selected)) {
    switch (type) {
      case 'title': { return 'Product information'; }
      case 'gallery': { return 'Images'; }
      case 'sku': { return 'Product SKU and quantity'; }
      case 'keyvalue': { return 'Location'; }
    }
    return lookFor(type);
  }
  return lookFor(type);
}

export interface CustomProps {
  predefined?: string[];
  tip?: string;
  selected?: string;
  data: DataType;
  setData: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

export interface CustomEditProps {
  anchor: HTMLElement;
  index: number;
  item: string;
  name?: string;
}

export interface ContentProps {
  index: number;
  data?: Type;
  handleValues: Function;
}

export const isRequired = (component: string, dataInfo?: Type) =>
  (component === 'action' && (!dataInfo?.urlOptionLabel?.trim().length || !dataInfo?.urlOptionLink?.trim().length || !isValidUrl(dataInfo.urlOptionLink))) ||
  (component === 'company' && !dataInfo?.company?.trim().length) || (component === 'presentation' && !dataInfo?.firstName?.trim().length);

export const validator = (dataToCheck: DataType): boolean => {
  if (!dataToCheck.custom?.length) {
    return true;
  }

  let errors = false;

  dataToCheck.custom.every((custom: CustomType) => {
    const {data} = custom;
    if (!data || !socialsAreValid(data)) { return true; }

    const {component} = custom;
    if (component === 'company' && (!data.company?.trim().length || (
      (data.companyPhone?.trim().length && !PHONE.test(data.companyPhone)) ||
      (data.companyCell?.trim().length && !PHONE.test(data.companyCell)) ||
      (data.companyFax?.trim().length && !PHONE.test(data.companyFax)) ||
      (data.companyWebSite?.trim().length && !isValidUrl(data.companyWebSite)) ||
      (data.companyEmail?.trim().length && !EMAIL.test(data.companyEmail))
    ))) {
      errors = true;
      return false;
    }
    if (component === 'address' && data.zip?.trim().length && !ZIP.test(data.zip)) {
      errors = true;
      return false;
    }
    if (component === 'justEmail' && data.email?.trim().length && !EMAIL.test(data.email)) {
      errors = true;
      return false;
    }
    if (component === 'email' && (data.email?.trim().length && !EMAIL.test(data.email)) ||
      (data.web?.trim().length && !isValidUrl(data.web))) {
      errors = true;
      return false;
    }
    if (component === 'links' && data?.links?.some((x: LinkType) =>
      ((!data.linksOnlyLinks && !(x.label || '').trim().length) || !x.link.trim().length || !isValidUrl(x.link)))) {
      errors = true;
      return false;
    }
    if (component === 'phones' && ((data.phone?.trim().length && !PHONE.test(data.phone)) ||
      (data.cell?.trim().length && !PHONE.test(data.cell)) || (data.fax?.trim().length && !PHONE.test(data.fax)))) {
      errors = true;
      return false;
    }
    if (component === 'presentation' && !data.firstName?.trim().length && (data.includeExtraInfo && (
      (data.email?.trim() && !EMAIL.test(data.email)) || (data.phone?.trim().length && !PHONE.test(data.phone)) ||
      (data.cell?.trim().length && !PHONE.test(data.cell)) || (data.fax?.trim().length && !PHONE.test(data.fax)) ||
      (data.zip?.trim().length && !ZIP.test(data.zip))
    ))) {
      errors = true;
      return false;
    }
    if (component === 'action' && data.urlOptionLabel !== undefined && data.urlOptionLink !== undefined &&
      (!data.urlOptionLabel.trim().length || !data.urlOptionLink.trim().length || !isValidUrl(data.urlOptionLink))) {
        errors = true;
        return false;
    }
    if (component === 'photos' && !data.files?.length) {
      errors = true;
      return false;
    }
  });

  return errors;
}

export const cleaner = (data: DataType, item: string): void => {
  const deleteItem = (item: string): void => { // @ts-ignore
    if (data[item] !== undefined) { delete data[item]; }
  }
  if (item === 'easiness' && data.easiness !== undefined) {
    delete data.easiness;
  } else if (item === 'socials' && data.socials !== undefined) {
    delete data.socials;
  } else if (item === 'links' && data.links !== undefined) {
    delete data.links;
  } else if (item === 'address') {
    deleteItem('address');
    deleteItem('city');
    deleteItem('zip');
    deleteItem('state');
    deleteItem('country');
  } else if (item === 'company') {
    deleteItem('company');
    deleteItem('title');
    deleteItem('subtitle');
    deleteItem('web');
    deleteItem('email');
    deleteItem('contact');
    deleteItem('phone');
    deleteItem('about');
  } else if (item === 'date' && data.value !== undefined) {
    delete data.value;
  } else if (item === 'email') {
    deleteItem('email');
    deleteItem('web');
  } else if (item === 'organization') {
    deleteItem('organization');
    deleteItem('position');
  } else if (item === 'phones') {
    deleteItem('cell');
    deleteItem('phone');
    deleteItem('fax');
  } else if (item === 'presentation') {
    deleteItem('prefix');
    deleteItem('firstName');
    deleteItem('lastName');
  } else if (item === 'opening') {
    deleteItem('is12hours');
    deleteItem('openingTime');
  } else if (item === 'title') {
    deleteItem('titleAbout');
    deleteItem('descriptionAbout');
  }
}

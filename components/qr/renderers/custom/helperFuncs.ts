import {DataType, LinkType} from "../../types/types";
import {EMAIL, PHONE, ZIP} from "../../constants";
import {isValidUrl} from "../../../../utils";
import socialsAreValid from "../validator";

export const components = [
  /*{type: 'gallery', name: 'Gallery'},*/
  {type: 'address', name: 'Address'}, {type: 'company', name: 'Company'},
  {type: 'date', name: 'Date'}, {type: 'email', name: 'Email and web'}, {type: 'easiness', name: 'Easiness'},
  {type: 'links', name: 'Links'}, {type: 'organization', name: 'Organization'},
  {type: 'phones', name: 'Phones and cells'}, {type: 'presentation', name: 'Presentation'},
  {type: 'opening', name: 'Opening time'}, {type: 'socials', name: 'Social networks'},
  {type: 'title', name: 'Title and description'}
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

export interface CustomEditProps {
  anchor: HTMLButtonElement;
  index: number;
  item: string;
  name?: string;
}

export const validator = (data: DataType, sections: any[]): boolean => {
  if (!sections.length || !socialsAreValid(data)) {
    return true;
  }

  let errors = false;

  if (!errors && sections.includes('company') && (!data.company?.trim().length || (
    (data.companyPhone?.trim().length && !PHONE.test(data.companyPhone)) ||
    (data.companyCell?.trim().length && !PHONE.test(data.companyCell)) ||
    (data.companyFax?.trim().length && !PHONE.test(data.companyFax)) ||
    (data.companyWebSite?.trim().length && !isValidUrl(data.companyWebSite)) ||
    (data.companyEmail?.trim().length && !EMAIL.test(data.companyEmail))
  ))) {
    errors = true;
  } else if (sections.includes('address') && data.zip?.trim().length && !ZIP.test(data.zip)) {
    errors = true;
  } else if (sections.includes('email') && data.email?.trim().length && !EMAIL.test(data.email)) {
    errors = true;
  } else if (sections.includes('links') && data?.links?.some((x: LinkType) =>
      (!x.label.trim().length || !x.link.trim().length || !isValidUrl(x.link)))) {
    errors = true;
  } else if (sections.includes('phones') && ((data.phone?.trim().length && !PHONE.test(data.phone)) ||
    (data.cell?.trim().length && !PHONE.test(data.cell)) || (data.fax?.trim().length && !PHONE.test(data.fax)))) {
    errors = true;
  } else if (sections.includes('presentation') && !data.firstName?.trim().length) {
    errors = true;
  } else if (sections.includes('email') && (data.web?.trim().length && !isValidUrl(data.web)) ||
    (data.email?.trim().length && !EMAIL.test(data.email))) {
    errors = true;
  } else if (data.urlOptionLabel !== undefined && data.urlOptionLink !== undefined) {
    if (!data.urlOptionLabel.trim().length || !data.urlOptionLink.trim().length || !isValidUrl(data.urlOptionLink)) {
      errors = true;
    }
  }

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

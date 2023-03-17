import {DataType, Type} from "../../types/types";

export const components = [
  {type: 'address', name: 'Address'}, {type: 'company', name: 'Company'},
  {type: 'date', name: 'Date'}, {type: 'justEmail', name: 'Email address'},
  {type: 'email', name: 'Email and web'}, {type: 'easiness', name: 'Easiness'},
  {type: 'links', name: 'Links'}, {type: 'organization', name: 'Organization'},
  {type: 'phones', name: 'Phones'}, {type: 'gallery', name: 'Gallery'},
  {type: 'presentation', name: 'Presentation'}, {type: 'opening', name: 'Opening time'},
  {type: 'socials', name: 'Social networks'}, {type: 'title', name: 'Title and description'},
  {type: 'action', name: 'Action button'}, {type: 'single', name: 'Single text'},
  {type: 'pdf', name: 'PDF file'}, {type: 'audio', name: 'Audio files'}, {type: 'video', name: 'Video files'},
  {type: 'keyvalue', name: 'Details'}, {type: 'web', name: 'Web'}, {type: 'contact', name: 'Contact form'},
  {type: 'tags', name: 'Tags'}, {type: 'sms', name: 'Contact via SMS'},
  {type: 'couponInfo', name: 'Promotion info', notInMenu: true},
  {type: 'couponData', name: 'Coupon data', notInMenu: true},
  {type: 'petId', name: 'Pet presentation', notInMenu: true},
  {type: 'sku', name: 'Product', notInMenu: true}
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
}

export interface CustomSettingsProps {
  anchor: HTMLElement;
  index: number;
  hideHeadlineOpts: boolean;
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

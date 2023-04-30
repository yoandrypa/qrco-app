import { CustomType, DataType, Type } from "../../types/types";
import { getUuid } from "../../../../helpers/qr/helpers";
import { sectionsQrTypes } from "../../components";
import { IQrSetting, THandleValues } from "../../components/commons/types";

export const components = {
  address: { name: 'Address' },
  buttons: { name: 'Buttons', data: { hideHeadLine: true } },
  company: { name: 'Company' },
  date: { name: 'Date' },
  donation: { name: 'Donation', isMonetized: true, data: { iconId: 'Coffee1', buttonText: 'Donation', unitAmount: 2 } },
  easiness: { name: 'Easiness' },
  justEmail: { name: 'Email address' },
  email: { name: 'Email and web' },
  gallery: { name: 'Gallery' },
  links: { name: 'Links', data: { hideHeadLine: true } },
  opening: { name: 'Opening time' },
  organization: { name: 'Organization' },
  phones: { name: 'Phones' },
  presentation: { name: 'Presentation' },
  socials: { name: 'Social networks', data: { socialsOnlyIcons: true, hideHeadLine: true } },
  tags: { name: 'Tags' },
  title: { name: 'Title and description' },
  contact: { name: 'Contact form' },
  sms: { name: 'Contact via SMS' },
  keyvalue: { name: 'Details' },
  audio: { name: 'Audio files' },
  pdf: { name: 'PDF file' },
  video: { name: 'Video files' },
  single: { name: 'Single text' },
  web: { name: 'Web' },
  action: { name: 'Action button', notInMenu: true },
  couponInfo: { name: 'Promotion info', notInMenu: true },
  couponData: { name: 'Coupon data', notInMenu: true },
  petId: { name: 'Pet presentation', notInMenu: true },
  sku: { name: 'Product', notInMenu: true },
  // Include the sections qr-types from independent components
  ...sectionsQrTypes,
};

export interface RenderSocialsProps {
  index: number;
  data?: Type;
  setData: Function;
  isSolidButton?: boolean;
}

export const NETWORKS = [
  { property: "facebook", tooltip: "Facebook" }, { property: "whatsapp", tooltip: "Whatsapp" },
  { property: "twitter", tooltip: "Twitter" }, { property: "instagram", tooltip: "Instagram" },
  { property: "youtube", tooltip: "YouTube" }, { property: "linkedin", tooltip: "LinkedIn" },
  { property: "pinterest", tooltip: "Pinterest" }, { property: "telegram", tooltip: "Telegram" },
  { property: "tiktok", tooltip: "TikTok" }, { property: "reddit", tooltip: "Reddit" },
  { property: "snapchat", tooltip: "Snapchat" }, { property: "twitch", tooltip: "Twitch" },
  { property: "quora", tooltip: "Quora" }, { property: "discord", tooltip: "Discord" }
];

// @ts-ignore
const getName = (type: string) => components[type].name;

export const getNameStr = (type: string, selected: string): string => {
  if (['inventory'].includes(selected)) {
    switch (type) {
      case 'title':
        return 'Product information';
      case 'gallery':
        return 'Images';
      case 'sku':
        return 'Product SKU and quantity';
      case 'keyvalue':
        return 'Location';
    }
    return getName(type);
  }
  return getName(type);
}

export interface CustomProps {
  predefined?: string[];
  tip?: string;
  selected?: string;
  data: DataType;
  setData: Function;
  handleValues: THandleValues;
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

export const sectionPreConfig = (item: string, selected?: string): CustomType => {
  // @ts-ignore
  const component: IQrSetting = components[item];
  const data = component.getDefaultQrData ? component.getDefaultQrData() : component.data || {};

  if (selected === 'petId') data.linksOnlyLinks = true;

  return {
    component: item,
    expand: getUuid(), // @ts-ignore
    isMonetized: components[item]?.isMonetized || false,
    data
  }
}

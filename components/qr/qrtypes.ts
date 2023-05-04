import pluralize from "pluralize";
import { formatBytes } from "../../utils";
import { FILE_LIMITS } from "../../consts";
import { dynamicQrTypes as dynamicQrSettings, staticQrTypes as staticQrSettings, sectionsQrTypes } from "./components"
import { IQrSetting } from "./components/commons/types"

export const dynamicQrTypes = {
  web: {
    description: "Transform a long URL in a shortened link"
  },
  'vcard+': {
    description: 'Share your contact and social details'
  },
  custom: {
    description: "Custom QRlynk from scratch using the predefined sections"
  },
  business: {
    description: 'Describe your business or company'
  },
  link: {
    description: "Share your own links, including social info"
  },
  inventory: {
    description: "Tag your products to make easy to find them"
  },
  pdf: {
    description: "Share a PDF file"
  },
  audio: {
    description: "Share an audio file"
  },
  gallery: {
    description: "Share a gallery of images"
  },
  video: {
    description: "Share video files"
  },
  social: {
    description: "Share your social networks information"
  },
  coupon: {
    description: "Share a coupon"
  },
  petId: {
    description: "Share your pet's information"
  },
  findMe: {
    description: "Place a QRLynk on your stuff to make easy to find you"
  },
  linkedLabel: {
    description: "Share your product's information"
  },
  fundme: {
    description: "Start your own charity or fundraising campaign",
    devOnly: true
  },
  // Include the dynamic qr-types from independent components
  ...dynamicQrSettings,
};

const handleAssetDesc = (selected: 'pdf' | 'gallery' | 'audio' | 'video') => (
  `You can upload a maximum of ${pluralize("file", FILE_LIMITS[selected].totalFiles, true)} of size ${formatBytes(FILE_LIMITS[selected].totalMbPerFile * 1048576)}.`
)

export const dynamicQr = {
  'vcard+': {
    tip: "Your contact details. Users can store your info or contact you right away.",
    predefined: ['presentation', 'organization', 'socials']
  },
  business: {
    tip: "Your business or company details. Users can contact your business or company right away.",
    predefined: ['company', 'action', 'address', 'opening', 'easiness', 'socials']
  },
  social: {
    description: "Share your social networks information",
    predefined: ['title', 'socials']
  },
  link: {
    tip: "Add at least one link to your websites",
    predefined: ['title', 'links', 'socials']
  },
  coupon: {
    tip: "Share a coupon for promotion.",
    predefined: ['couponInfo', 'couponData', 'address']
  },
  petId: {
    tip: "Your pet information.",
    predefined: ['petId', 'presentation', 'keyvalue', 'links', 'socials', 'contact']
  },
  custom: {
    tip: "Create a custom QRLynk on your own from scratch."
  },
  findMe: {
    tip: "Information to make easy to find you.",
    predefined: ['presentation', 'keyvalue', 'links', 'socials', 'contact']
  },
  linkedLabel: {
    tip: "Smart labels.",
    predefined: ['title', 'tags', 'gallery']
  },
  pdf: {
    tip: handleAssetDesc('pdf'),
    predefined: ['title', 'pdf']
  },
  audio: {
    tip: handleAssetDesc('audio'),
    predefined: ['title', 'audio']
  },
  gallery: {
    tip: handleAssetDesc('gallery'),
    predefined: ['title', 'gallery']
  },
  video: {
    tip: handleAssetDesc('video'),
    predefined: ['title', 'vodep']
  }
};

export const staticQrTypes = {
  web: {
    description: "Link to any page on the web"
  },
  vcard: {
    description: "Share your contact details"
  },
  email: {
    description: "Receive email messages"
  },
  sms: {
    description: "Receive text messages"
  },
  text: {
    description: "Share a short text message"
  },
  wifi: {
    description: "Invite to get connected to a WiFi network"
  },
  twitter: {
    description: "Invite to post a tweet"
  },
  whatsapp: {
    description: "Receive WhatsApp messages"
  },
  facebook: {
    description: "Invite to share an URL in Facebook"
  },
  crypto: {
    description: "Receive crypto on your eWallet",
    devOnly: true
  },
  // Include the dynamic qr-types from independent components
  ...staticQrSettings,
}

export function getQrType(qrTypeId: string): IQrSetting<any> {
  // @ts-ignore
  return dynamicQrTypes[qrTypeId] || staticQrTypes[qrTypeId];
}

export function getQrSectionType(qrTypeId: string): IQrSetting<any> {
  // @ts-ignore
  return sectionsQrTypes[qrTypeId];
}

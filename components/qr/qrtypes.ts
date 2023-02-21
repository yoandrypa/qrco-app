import pluralize from "pluralize";
import {formatBytes} from "../../utils";
import {FILE_LIMITS} from "../../consts";

export const dynamicQrTypes = {
  web: {
    description: "Transform a long URL in a shortened link"
  },
  'vcard+': {
    description: 'Share your contact and social details'
  },
  business: {
    description: 'Describe your business or company'
  },
  social: {
    description: "Share your social networks information"
  },
  link: {
    description: "Share your own links, including social info"
  },
  coupon: {
    description: "Share a coupon"
  },
  donation: {
    description: "Get donations from your supporters worldwide"
  },
  petId: {
    description: "Share your pet's information"
  },
  custom: {
    description: "Custom QR link from scratch using predefined sections"
  },
  findMe: {
    description: "Place a QR link on your stuff to make easy to find you"
  },
  linkedLabel: {
    description: "Share your product's information"
  },
  inventory: {
    description: "Tag your products to make easy to find them"
  },
  fundme: {
    description: "Start your own charity or fundraising campaign",
    devOnly: true
  },
  paylink: {
    description: "Receive payments worldwide",
    devOnly: true
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
  }
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
    description: "Share your social networks information"
  },
  link: {
    tip: "Add at least one link to your websites",
    predefined: ['presentation', 'organization', 'socials']
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
    tip: "Create a custom qr link on your own from scratch."
  },
  findMe: {
    tip: "Information to make easy to find you.",
    predefined: ['presentation', 'keyvalue', 'links', 'socials', 'contact']
  },
  linkedLabel: {
    tip: "Smart labels.",
    predefined: ['title', 'tags', 'gallery']
  },
  inventory: {
    tip: "Inventory tracking information.",
    predefined: ['title', 'gallery', 'sku', 'keyvalue']
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
  }
}

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

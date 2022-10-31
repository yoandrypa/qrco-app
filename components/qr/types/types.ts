export type CornersAndDotsType = {
  topL: string;
  topR: string;
  bottom: string;
} | null;

export type BackgroundType = {
  type: string | null;
  opacity: number;
  size: number;
  file: string | null;
  x: number;
  y: number;
  imgSize: number;
  invert?: boolean | false;
  backColor?: string | null;
};

export type FramesType = {
  type: string | null;
  text: string;
  color: string;
  textColor: string;
  textUp?: boolean | false;
};

export type OptionsType = {
  isDynamic?: boolean;
  qrType?: string;
  mode?: string;
  cornersDot?: CornersAndDotsType;
  corners?: CornersAndDotsType;
  frame?: FramesType;
  background?: BackgroundType;
  userId?: string;
  id?: string;
  shortCode?: string;
  width: number;
  height: number;
  type: string;
  data: string;
  image: string | null;
  margin: number;
  qrOptions: { typeNumber: number; mode: string; errorCorrectionLevel: string; };
  imageOptions: { hideBackgroundDots: boolean; imageSize: number; margin: number; crossOrigin: string; };
  dotsOptions: { color: string; type: string; };
  backgroundOptions: { color: string; };
  cornersSquareOptions: { color: string; type: string | null; };
  cornersDotOptions: { color: string; type: string | null; };
};

export type OpeningObjType = {
  ini: string;
  end: string;
};

export type OpeningDaysType = {
  opening: OpeningObjType[];
};

export type OpeningType = {
  sun?: OpeningDaysType;
  mon?: OpeningDaysType;
  tue?: OpeningDaysType;
  wed?: OpeningDaysType;
  thu?: OpeningDaysType;
  fri?: OpeningDaysType;
  sat?: OpeningDaysType;
} | {} | null;

export type LinkType = {
  label: string;
  link: string;
}

export type DataType = {
  mode?: string;
  userId?: string;
  id?: string;
  qrName?: string;
  number?: string;
  avatarImage?: string;
  bannerImage?: string;
  donationUnitAmount?: number;
  donationPriceId?: string;
  donationProductId?: string;
  message?: string;
  subject?: string;
  body?: string;
  email?: string;
  name?: string;
  password?: string;
  encription?: string;
  hidden?: string;
  prefix?: string;
  lastName?: string;
  firstName?: string;
  cell?: string;
  phone?: string;
  fax?: string;
  organization?: string;
  position?: string;
  address?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
  company?: string;
  contact?: string;
  about?: string;
  title?: string;
  subtitle?: string;
  web?: string;
  url?: string;
  via?: string;
  hashtags?: string;
  text?: string;
  facebook?: string;
  whatsapp?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  pinterest?: string;
  telegram?: string;
  twitter?: string;
  value?: string;
  is12hours?: boolean;
  openingTime?: OpeningType;
  urlOptionLabel?: string;
  urlOptionLink?: string;
  links?: LinkType[];
  easiness?: {
    accessible?: boolean;
    toilet?: boolean;
    seat?: boolean;
    child?: boolean;
    pets?: boolean;
    park?: boolean;
    restaurant?: boolean;
    cafe?: boolean;
    bar?: boolean;
    shower?: boolean;
    health?: boolean;
    fastfood?: boolean;
    bed?: boolean;
    gym?: boolean;
    smoking?: boolean;
    climate?: boolean;
    training?: boolean;
    parking?: boolean;
    train?: boolean;
    bus?: boolean;
    taxi?: boolean;
    wifi?: boolean;
  } | undefined;
  primary?: string;
  secondary?: string;
  isDynamic?: boolean;
  backgndImg?: File | string;
  foregndImg?: File | string;
  foregndImgType?: 'circle' | 'smooth' | 'square' | null;
  files?: File[];
};

export type DonationsData = {
  name: string,
  image?: string,
  shortText: string
}


export type SocialsType = 'facebook' | 'whatsapp' | 'twitter' | 'instagram' | 'youtube' | 'linkedin' | 'pinterest' | 'telegram';

export type EbanuxDonationPriceData = {
  name: string,
  unitAmountUSD: number,
  redirectUrl: string,
}

export type SocialProps = {
  facebook?: string;
  whatsapp?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  pinterest?: string;
  telegram?: string;
  twitter?: string;
  qrName?: string;
  isDynamic?: boolean;
}

export type CardDataProps = {
  data: DataType;
  setData: Function;
};

export type UpdaterType = {
  options: OptionsType;
  background?: BackgroundType;
  corners?: CornersAndDotsType;
  cornersDot?: CornersAndDotsType;
  frame?: FramesType;
};

export type ColorTypes = {
  p: string,
  s: string
};

export type FileType = {
  content: string;
  type: string;
};

export type EditType = {
  userId: string;
  id: string;
  qrType: string;
  qrName: string;
  isDynamic?: boolean;
  qrOptionsId?: any;
  value?: string;
  primary?: string;
  secondary?: string;
  createdAt?: string;
  updatedAt?: string;
};

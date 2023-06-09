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
  label?: string; link: string; type?: string; icon?: File | string
}

export type KeyValues = { key?: string; value: string; }

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
};

export type SocialsType = 'facebook' | 'whatsapp' | 'twitter' | 'instagram' | 'youtube' | 'linkedin' | 'pinterest' | 'telegram' | 'tiktok' | 'title' | 'about' | string;
export type SocialNetworksType = { network: SocialsType, value?: string };

export type Type = {
  iconShape?: string;
  leftAligned?: boolean;
  sectionArrangement?: string;
  invertIconColors?: boolean;
  showIcons?: boolean;
  extras?: any;
  customFont?: boolean;
  headLineFontStyle?: string;
  headlineFontSize?: string;
  headlineFont?: string;
  hideHeadLineIcon?: boolean;
  showOnlyNetworkName?: boolean;
  visibleReceipt?: boolean;
  iconSize?: string;
  linksAsButtons?: boolean;
  hideNetworkIcon?: boolean;
  topSpacing?: string;
  bottomSpacing?: string;
  buttonText?: string;
  tags?: string[];
  splitInTwoColumns?: boolean;
  quantity?: number;
  description?: string;
  data?: string;
  sku?: string;
  avoidButtons?: boolean;
  hideHeadLine?: boolean;
  centerHeadLine?: boolean;
  includeExtraInfo?: boolean;
  prevNetworks?: string[];
  shortDateFormat?: boolean;
  socialsOnlyIcons?: boolean;
  linksOnlyLinks?: boolean;
  keyValues?: KeyValues[];
  badge?: string;
  number?: string;
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
  whatsapp?: string;
  fax?: string;
  organization?: string;
  position?: string;
  address?: string;
  address2?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
  company?: string;
  contact?: string;
  about?: string;
  title?: string;
  titleAbout?: string;
  autoOpen?: boolean;
  descriptionAbout?: string;
  titleText?: string;
  subtitle?: string;
  companyWebSite?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyCell?: string;
  companyFax?: string;
  web?: string;
  website?: string;
  url?: string;
  via?: string;
  hashtags?: string;
  text?: string;
  socials?: SocialNetworksType[];
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
  files?: File[];
  petName?: string;
  petBreed?: string;
  petYearOfBirth?: string;
  petGender?: string;
};

export type CustomType = {
  component: string;
  name?: string;
  data: Type;
  expand: string;
  isMonetized?: boolean;
};

export type DataType = {
  qrForSharing?: File;
  hideQrForSharing?: boolean;
  sharerPosition?: string;
  upperHeight?: string;
  buttonShadowDisplacement?: string;
  forceChange?: boolean;
  buttonsSeparation?: string;
  profileImageVertical?: string;
  profileImageSize?: string;
  customFooter?: string;
  footerKind?: string;
  buttonCase?: boolean;
  alternate?: boolean;
  flipVertical?: boolean;
  flipHorizontal?: boolean;
  buttonShadow?: boolean;
  buttonBorderType?: string;
  buttonBorderWeight?: string;
  buttonBorderColors?: string;
  buttonBorderColor?: string;
  buttonBorderStyle?: string;
  buttonsOpacity?: number;
  micrositeBackImageBlurness?: number;
  micrositeBackImageOpacity?: number;
  qrType?: string;
  mode?: string;
  prevNetworks?: string[];
  userId?: string;
  claim?: string;
  shortDateFormat?: boolean;
  socialsOnlyIcons?: boolean;
  id?: string;
  index?: number[];
  includeDescription?: boolean;
  claimable?: boolean;
  secret?: string;
  preGenerated?: boolean;
  custom?: CustomType[];
  qrName?: string;
  number?: string;
  avatarImage?: string;
  bannerImage?: string;
  unitAmount?: number;
  priceId?: string;
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
  address2?: string;
  city?: string;
  zip?: string;
  state?: string;
  country?: string;
  company?: string;
  contact?: string;
  about?: string;
  title?: string;
  titleAbout?: string;
  autoOpen?: boolean;
  descriptionAbout?: string;
  titleText?: string;
  subtitle?: string;
  companyWebSite?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyCell?: string;
  companyFax?: string;
  web?: string;
  website?: string;
  url?: string;
  via?: string;
  hashtags?: string;
  text?: string;
  socials?: SocialNetworksType[];
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
  backgroundImageFile?: string;
  backgroundType?: string;
  backgroundColor?: string;
  backgroundColorRight?: string;
  backgroundDirection?: string;
  backgroundImage?: File | string;
  globalFont?: string;
  globalFontColor?: string;
  buttonsFont?: string;
  buttonShape?: string;
  buttonBack?: string;
  buttonBorders?: string;
  buttonBackColor?: string;
  layout?: string;
  sectionTitleFont?: string;
  sectionTitleFontSize?: string;
  sectionTitleFontStyle?: string;
  sectionDescFont?: string;
  sectionDescFontSize?: string;
  sectionDescFontStyle?: string;
  titlesFont?: string;
  subtitlesFont?: string;
  messagesFont?: string;
  titlesFontSize?: string;
  subtitlesFontSize?: string;
  messagesFontSize?: string;
  buttonsFontSize?: string;
  titlesFontStyle?: string;
  subtitlesFontStyle?: string;
  messagesFontStyle?: string;
  buttonsFontStyle?: string;
  primary?: string;
  secondary?: string;
  isDynamic?: boolean;
  prevBackImg?: string;
  prevForeImg?: string;
  prevMicrositeImg?: string;
  backgndImg?: File | string;
  foregndImg?: File | string;
  micrositeBackImage?: File | string;
  foregndImgType?: 'circle' | 'smooth' | 'square' | null;
  files?: File[];
  petName?: string;
  petBreed?: string;
  petYearOfBirth?: string;
  petGender?: string;
  headingTextText?: string;
  headingTextHeading?: string;
  contactTitle?: string;
  otherDetails?: HeadAndItemsType;
  urls?: HeadAndItemsType;
  fields?: DragFields;
  description?: string;
  categories?: string[];
  contactForm?: ContactField;
  product?: ProductField;
};

export type validTypes = 'text' | 'email' | 'phone' | 'web' | 'number' | 'date' | 'fax' | 'url' | 'string';

export type HeadAndItemsType = {
  heading: string;
  items: [{
    label: string;
    value: string;
    type?: validTypes
  }];
}

export type EbanuxDonationPriceData = {
  priceId?: string,
  productId?: string,
  name: string,
  unitAmountUSD: number,
  redirectUrl: string,
}

export interface EbanuxSimplePaymentLinkData {
  productName: string,
  productDescription: string,
  images: string[],
  amount: number,
  successUrl?: string
}

export type ColorTypes = {
  p: string; s: string;
};

export type FontTypes = {
  type: string; name: string;
};

export type EditType = {
  background?: any;
  userId: string;
  id: string;
  prevNetworks?: string[];
  qrType: string;
  qrName: string;
  isDynamic?: boolean;
  qrOptionsId?: any;
  backgndImg?: any;
  foregndImg?: any;
  mode?: string;
  value?: string;
  primary?: string;
  secondary?: string;
  createdAt: number;
  updatedAt?: string;
};

export type ProcessHanldlerType = {
  value: string;
  status?: boolean;
};
export type DragField = {
  type: 'text' | 'media' | 'gallery' | 'video' | 'contact';
  header?: string;
  component?: any// ! react component
};
export type ProductField = {
  titleAbout?: string;
  descriptionAbout?: string;
  quantity?: number;
  picture?: File[];
  sku?: string;
}
export type Sections = (TextField | MediaField | ContactField);

export type DragFields = Sections[];

export type ContactField = DragField & {
  title?: string;
  message?: string;
  buttonText?: string;
  email: string;
};

export type TextField = DragField & {
  title?: string;
  text?: string;
};

export type MediaField = DragField & {
  files?: File[];
};

export interface CustomCommon {
  data?: DataType;
  handleValue: Function;
}

export interface RenderLinksBtnsProps {
  index: number; data?: Type; setData: Function; isButtons: boolean;
}

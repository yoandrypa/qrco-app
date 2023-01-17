type Match<T> = {
  [K in keyof T]?: T[K] | [">" | ">=" | "<=" | "<", T[K]];
};

interface UserType {
  bannedById?: string;
  banned?: boolean;
  coolDowns?: string[];
  createdAt?: Date;
  id: string;
  updatedAt?: string;
  subscriptionData?: UserSubscription;
  customerId?: string;
  planType?: string;
  planUsage?: number
}

interface UserQueryType {
  id: object;
  customerId: object;
}

interface UserJoinedType extends UserType {
  admin?: boolean;
  homepage?: string;
  domain?: string;
  domain_id?: string;
}

interface UserSubscription {
  id: string,
  priceId: string,
  status: string,
  currency: string,
  interval: "day" | "week" | "month" | "year" | null,
  intervalCount: number | undefined | null,
  createdDate: number,
  periodStartsAt: number,
  periodEndsAt: EpochTimeStamp
}

type PlanType = "basic" | "business" | "premium" |
  "basicAnnual" | "businessAnnual" | "premiumAnnual" | string;


type CognitoUserData = {
  cid: string,
  idToken: string,
  accessToken: string,
  refreshToken: string,
  clockDrift: number,
  LastAuthUser: string,
  userData: string,
  UserAttributes:
  {
    Name: string,
    Value: string
  }[],
  Username: string
}

interface DomainType {
  address: string;
  banned?: boolean;
  bannedById?: string;
  homepage?: string;
  userId: string;
  createdAt: number;
}

interface DomainSanitizedType {
  address: string;
  userId: string;
  banned?: boolean;
  bannedById: undefined;
  homepage?: string;
}

interface HostType {
  id: string;
  address: string;
  banned: boolean;
  bannedById?: string;
}

interface HostQueryType {
  userId: object;
  address: object;
  banned: object;
  bannedById?: object;
}

interface IPType {
  id: number;
  ip: string;
}

interface IPQueryType {
  id: object;
  ip: object;
}

interface LinkType {
  address?: string | undefined;
  bannedById?: string;
  banned: boolean;
  pausedById?: string;
  paused: boolean;
  description?: string | undefined;
  domainId?: { userId: string, createdAt: number } | null;
  expireIn?: string | undefined;
  id: string;
  password?: string | undefined;
  type?: string;
  target: string;
  userId: string;
  visitCount: number;
  createdAt: number;
}

interface QrDataType {
  createdAt: number;
  qrName: string;
  qrType: string;
  userId: string;
  isDynamic?: boolean;
  shortLinkId?: string;
  qrOptionsId?: object;
}

interface LinkQueryType {
  id: object;
  address?: object;
  createdAt?: object;
  domainId?: object;
  userId?: object;
  target?: object,
  expireIn?: object
}

interface QrDataQueryType {
  id: object;
  userId?: object;
}

interface LinkSanitizedType {
  visitCount: number;
  address?: string | undefined;
  link: string;
  description?: string | undefined;
  expireIn: number | undefined;
  target: string;
  domainId: string | undefined;
  password: string | undefined;
  userId: string;
  domain?: string | undefined;
  banned: boolean;
  //id: string;
  bannedById: undefined;
  paused: boolean;
  pausedById: undefined;
}

interface LinkJoinedDomainType extends LinkType {
  domain?: string | object | undefined;
}

interface VisitType {
  id: number;
  countries: Record<string, number>;
  createdAt: Date;
  link_id: string;
  referrers: object; //Record<string, number>;
  total: number;
  br_chrome: number;
  br_edge: number;
  br_firefox: number;
  br_ie: number;
  br_opera: number;
  br_other: number;
  br_safari: number;
  os_android: number;
  os_ios: number;
  os_linux: number;
  os_macos: number;
  os_other: number;
  os_windows: number;
}

interface StatsType {
  browser: Record<"chrome" | "edge" | "firefox" | "ie" | "opera" | "other" | "safari",
    number>;
  os: Record<"android" | "ios" | "linux" | "macos" | "other" | "windows",
    number>;
  country: Record<string, number>;
  referrer: Record<string, number>;
}

declare namespace Express {
  export interface Request {
    realIP?: string;
    pageType?: string;
    linkTarget?: string;
    protectedLink?: string;
    token?: string;
    user: UserJoinedType;
  }
}

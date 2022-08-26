type Match<T> = {
  [K in keyof T]?: T[K] | [">" | ">=" | "<=" | "<", T[K]];
};

interface UserType {
  banned_by_id?: string;
  banned?: boolean;
  cooldowns?: string[];
  created_at?: string;
  id: string;
  updated_at?: string;
}

interface UserQueryType {
  id: object;
}

interface UserJoinedType extends UserType {
  admin?: boolean;
  homepage?: string;
  domain?: string;
  domain_id?: string;
}

interface DomainType {
  id: string;
  address: string;
  banned: boolean;
  banned_by_id?: string;
  created_at: string;
  homepage?: string;
  updated_at: string;
  user_id?: string;
}

interface DomainQueryType {
  id: object;
  address: object;
  banned: object;
  banned_by_id?: object;
  created_at: object;
  homepage?: object;
  updated_at: object;
  user_id?: object;
}

interface DomainSanitizedType {
  id: string;
  address: string;
  banned: boolean;
  banned_by_id?: undefined;
  created_at: string;
  homepage?: string;
  updated_at: string;
  user_id?: undefined;
}

interface HostType {
  id: string;
  address: string;
  banned: boolean;
  banned_by_id?: string;
  created_at: string;
  updated_at: string;
}

interface HostQueryType {
  id: object;
  address: object;
  banned: object;
  banned_by_id?: object;
  created_at: object;
  updated_at: object;
}

interface IPType {
  id: number;
  created_at: string;
  updated_at: string;
  ip: string;
}

interface IPQueryType {
  id: object;
  created_at: object;
  updated_at: object;
  ip: object;
}

interface LinkType {
  address: string;
  banned_by_id?: string;
  banned: boolean;
  created_at: string;
  description?: string;
  domain_id?: string;
  expire_in: number;
  id: string;
  password?: string;
  target: string;
  updated_at: string;
  user_id?: string;
  visit_count: number;
}

interface LinkQueryType {
  id: object;
  address: object;
  domain_id?: object;
  user_id?: object;
  created_at?: object
  target?: object,
  expire_in?: object
}

interface LinkSanitizedType {
  address: string;
  banned_by_id?: undefined;
  banned: boolean;
  created_at: string;
  domain_id?: undefined;
  id: string;
  link: string;
  password: boolean;
  target: string;
  updated_at: string;
  user_id?: undefined;
  uuid?: undefined;
  visit_count: number;
}

interface LinkJoinedDomainType extends LinkType {
  domain?: string;
}

interface VisitType {
  id: number;
  countries: Record<string, number>;
  created_at: string;
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
  browser: Record<
    "chrome" | "edge" | "firefox" | "ie" | "opera" | "other" | "safari",
    number
  >;
  os: Record<
    "android" | "ios" | "linux" | "macos" | "other" | "windows",
    number
  >;
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

import { isAfter, subHours, subDays } from "date-fns";
import axios from "axios";
import { CustomError } from "../utils";
import * as User from "../queries/user";
import * as Link from "../queries/link";
import * as Domain from "../queries/domain";
import * as Host from "../queries/host";
//import dns from 'dns';
//import { promisify } from "util";

export const coolDown = (user: UserType) => {
  if (!process.env.REACT_APP_GOOGLE_SAFE_BROWSING_KEY || !user || !user.coolDowns) return;

  // If it has active cooldown then throw error
  const hasCooldownNow = user.coolDowns.some(coolDown =>
    isAfter(subHours(new Date(), 12), new Date(coolDown))
  );

  if (hasCooldownNow) {
    throw new CustomError("Cooldown because of a malware URL. Wait 12h");
  }
  return true;
};

export const malware = async (user: UserType, target: string) => {
  if (!process.env.REACT_APP_GOOGLE_SAFE_BROWSING_KEY) return;

  const isMalware = await axios.post(
    `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.REACT_APP_GOOGLE_SAFE_BROWSING_KEY}`,
    {
      client: {
        // @ts-ignore
        clientId: process.env.REACT_APP_DEFAULT_DOMAIN.toLowerCase().replace(".", ""),
        clientVersion: "1.0.0"
      },
      threatInfo: {
        threatTypes: [
          "THREAT_TYPE_UNSPECIFIED",
          "MALWARE",
          "SOCIAL_ENGINEERING",
          "UNWANTED_SOFTWARE",
          "POTENTIALLY_HARMFUL_APPLICATION"
        ],
        platformTypes: ["ANY_PLATFORM", "PLATFORM_TYPE_UNSPECIFIED"],
        threatEntryTypes: [
          "EXECUTABLE",
          "URL",
          "THREAT_ENTRY_TYPE_UNSPECIFIED"
        ],
        threatEntries: [{ url: target }]
      }
    }
  );
  if (!isMalware.data || !isMalware.data.matches) return;

  if (user) {
    const userExist = await User.find({ id: { eq: user.id } });
    const updatedUser = await User.update(
      { id: user.id },
      {
        coolDowns: userExist.coolDowns.concat(new Date().toISOString())
      }
    );

    // Ban if too many coolDowns
    // @ts-ignore
    if (updatedUser.coolDowns.length > 2) {
      await User.update({ id: user.id }, { banned: true });
      throw new CustomError("Too much malware requests. You are now banned.");
    }
  }

  throw new CustomError(
    user ? "Malware detected! Cooldown for 12h." : "Malware detected!"
  );

  return true;
};

export const linksCount = async (user?: UserType) => {
  try {
    if (!user) return;
    const count = await Link.total({
      userId: { eq: user.id },
      createdAt: { gt: subDays(new Date(), 1).valueOf() }
    });

    // @ts-ignore
    if (count > process.env.REACT_APP_USER_LIMIT_PER_DAY) {
      throw new CustomError(
        `You have reached your daily limit (${process.env.REACT_APP_USER_LIMIT_PER_DAY}). Please wait 24h.`
      );
    }
  } catch (e: any) {
    throw new CustomError(e.message, 500, e);
  }
};

export const bannedDomain = async (userId: string, domain: string) => {
  const isBanned = (await Domain.find({
    userId: { eq: userId },
    address: { eq: domain },
    banned: { eq: true }
  }))[0];
  if (isBanned) {
    throw new CustomError("URL is containing malware/scam.", 400);
  }
};

//const dnsLookup = promisify(dns.lookup);
export const bannedHost = async (userId: string, domain: string) => {
  let isBanned;

  try {
    const dnsRes = {}; //TODO await dnsLookup(domain);

    // @ts-ignore
    if (!dnsRes || !dnsRes.address) return;

    isBanned = (await Host.find({
      userId: { eq: userId },
      // @ts-ignore
      address: { eq: dnsRes.address },
      banned: { eq: true }
    }))[0];
  } catch (error) {
    isBanned = undefined;
  }

  if (isBanned) {
    throw new CustomError("URL is containing malware/scam.", 400);
  }
};

export const preservedUrls = [
  "login",
  "logout",
  "signup",
  "reset-password",
  "resetpassword",
  "url-password",
  "url-info",
  "settings",
  "stats",
  "verify",
  "api",
  "404",
  "static",
  "images",
  "banned",
  "terms",
  "privacy",
  "protected",
  "report",
  "pricing"
];

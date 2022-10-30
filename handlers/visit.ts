//const useragent = require("useragent");
const parser = require("ua-parser-js");
const geoip = require("fast-geoip");
import URL from "url";

import query from "../queries";
import { getStatsLimit, removeWww } from "../utils";
import queries from "../queries";

const browsersList = ["IE", "Firefox", "Chrome", "Opera", "Safari", "Edge"];
const osList = ["Windows", "Mac OS", "Linux", "Android", "iOS"];

const filterInBrowser = (agent: { browser: { name: string }; }) => (item: string) =>
  agent.browser.name.toLowerCase().includes(item.toLocaleLowerCase());

const filterInOs = (agent: { os: { name: string; }; }) => (item: string) =>
  agent.os.name.toLowerCase().includes(item.toLocaleLowerCase());

// @ts-ignore
export const add = async (data: any) => {
  const tasks = [];

  if (data.link.visitCount < getStatsLimit()) {
    tasks.push(query.link.increamentVisit({ id: data.link.id }));
    const agent = parser(data.headers["user-agent"]);
    const [browser = "Other"] = browsersList.filter(filterInBrowser(agent));
    const [os = "Other"] = osList.filter(filterInOs(agent));
    const referrer =
      data.referrer && removeWww(URL.parse(data.referrer).hostname);
    const location = await geoip.lookup(data.realIP);
    const country = location && location.country;
    tasks.push(
      queries.visit.add({
        browser: browser.toLowerCase(),
        country: country || "Unknown",
        id: data.link.id,
        os: os.toLowerCase().replace(/\s/gi, ""),
        referrer: (referrer && referrer.replace(/\./gi, "[dot]")) || "Direct"
      })
    );
  }

  return Promise.all(tasks);
};

export default add;

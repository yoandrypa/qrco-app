import { isAfter, set, subDays } from "date-fns";

import * as utils from "../utils";
import { VisitModel as VisitModel } from "../models/link";

interface Add {
  browser: string;
  country: string;
  domain?: string;
  id: number;
  os: string;
  referrer: string;
}

export const add = async (params: Add) => {
  const data = {
    ...params,
    country: params.country.toLowerCase(),
    referrer: params.referrer.toLowerCase()
  };
  const visit = await VisitModel.findOne({ link_id: { eq: params.id } }); //TODO include above full query

  if (visit) {
    await VisitModel.update(visit.id, {
      [`br_${data.browser}`]: visit[`br_${data.browser}`] + 1,
      [`os_${data.os}`]: visit[`os_${data.os}`] + 1,
      total: visit.total + 1,
      countries: Object.assign({}, visit.countries, {
        [data.country]: visit.countries[data.country] + 1
      }),
      referrers: Object.assign({}, visit.referrers, {
        [data.referrer]: visit.referrers[data.referrer] + 1
      })});
  } else {
    await VisitModel.create({
      [`br_${data.browser}`]: 1,
      countries: { [data.country]: 1 },
      referrers: { [data.referrer]: 1 },
      [`os_${data.os}`]: 1,
      total: 1,
      link_id: data.id
    });
  }

  return visit;
};

interface StatsResult {
  stats: {
    browser: { name: string; value: number }[];
    os: { name: string; value: number }[];
    country: { name: string; value: number }[];
    referrer: { name: string; value: number }[];
  };
  views: number[];
}

interface IGetStatsResponse {
  allTime: StatsResult;
  lastDay: StatsResult;
  lastMonth: StatsResult;
  lastWeek: StatsResult;
}

export const find = async (match: Partial<VisitType>, total: number) => {
  /*if (match.link_id) {
    const key = redis.key.stats(match.link_id);
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
  }*/

  const stats = {
    lastDay: {
      stats: utils.getInitStats(),
      views: new Array(24).fill(0)
    },
    lastWeek: {
      stats: utils.getInitStats(),
      views: new Array(7).fill(0)
    },
    lastMonth: {
      stats: utils.getInitStats(),
      views: new Array(30).fill(0)
    },
    allTime: {
      stats: utils.getInitStats(),
      views: new Array(18).fill(0)
    }
  };

  const visitsStream = await VisitModel.scan({
    link_id: { eq: match.link_id }
  }).exec();
  const nowUTC = utils.getUTCDate();
  const now = new Date();

  for await (const visit of visitsStream as unknown as VisitType[]) {
    utils.STATS_PERIODS.forEach(([days, type]) => {
      const isIncluded = isAfter(
        new Date(visit.createdAt),
        subDays(nowUTC, days)
      );
      if (isIncluded) {
        const diffFunction = utils.getDifferenceFunction(type);
        const diff = diffFunction(now, new Date(visit.createdAt));
        const index = stats[type].views.length - diff - 1;
        const view = stats[type].views[index];
        const period = stats[type].stats;
        stats[type].stats = {
          browser: {
            chrome: period.browser.chrome + visit.br_chrome,
            edge: period.browser.edge + visit.br_edge,
            firefox: period.browser.firefox + visit.br_firefox,
            ie: period.browser.ie + visit.br_ie,
            opera: period.browser.opera + visit.br_opera,
            other: period.browser.other + visit.br_other,
            safari: period.browser.safari + visit.br_safari
          },
          os: {
            android: period.os.android + visit.os_android,
            ios: period.os.ios + visit.os_ios,
            linux: period.os.linux + visit.os_linux,
            macos: period.os.macos + visit.os_macos,
            other: period.os.other + visit.os_other,
            windows: period.os.windows + visit.os_windows
          },
          country: {
            ...period.country,
            ...Object.entries(visit.countries).reduce(
              (obj, [country, count]) => ({
                ...obj,
                [country]: (period.country[country] || 0) + count
              }),
              {}
            )
          },
          referrer: {
            ...period.referrer,
            ...Object.entries(visit.referrers).reduce(
              (obj, [referrer, count]) => ({
                ...obj,
                [referrer]: (period.referrer[referrer] || 0) + count
              }),
              {}
            )
          }
        };
        stats[type].views[index] = view + visit.total;
      }
    });

    const allTime = stats.allTime.stats;
    const diffFunction = utils.getDifferenceFunction("allTime");
    const diff = diffFunction(
      set(new Date(), { date: 1 }),
      set(new Date(visit.createdAt), { date: 1 })
    );
    const index = stats.allTime.views.length - diff - 1;
    const view = stats.allTime.views[index];
    stats.allTime.stats = {
      browser: {
        chrome: allTime.browser.chrome + visit.br_chrome,
        edge: allTime.browser.edge + visit.br_edge,
        firefox: allTime.browser.firefox + visit.br_firefox,
        ie: allTime.browser.ie + visit.br_ie,
        opera: allTime.browser.opera + visit.br_opera,
        other: allTime.browser.other + visit.br_other,
        safari: allTime.browser.safari + visit.br_safari
      },
      os: {
        android: allTime.os.android + visit.os_android,
        ios: allTime.os.ios + visit.os_ios,
        linux: allTime.os.linux + visit.os_linux,
        macos: allTime.os.macos + visit.os_macos,
        other: allTime.os.other + visit.os_other,
        windows: allTime.os.windows + visit.os_windows
      },
      country: {
        ...allTime.country,
        ...Object.entries(visit.countries).reduce(
          (obj, [country, count]) => ({
            ...obj,
            [country]: (allTime.country[country] || 0) + count
          }),
          {}
        )
      },
      referrer: {
        ...allTime.referrer,
        ...Object.entries(visit.referrers).reduce(
          (obj, [referrer, count]) => ({
            ...obj,
            [referrer]: (allTime.referrer[referrer] || 0) + count
          }),
          {}
        )
      }
    };
    stats.allTime.views[index] = view + visit.total;
  }

  const response: IGetStatsResponse = {
    allTime: {
      stats: utils.statsObjectToArray(stats.allTime.stats),
      views: stats.allTime.views
    },
    lastDay: {
      stats: utils.statsObjectToArray(stats.lastDay.stats),
      views: stats.lastDay.views
    },
    lastMonth: {
      stats: utils.statsObjectToArray(stats.lastMonth.stats),
      views: stats.lastMonth.views
    },
    lastWeek: {
      stats: utils.statsObjectToArray(stats.lastWeek.stats),
      views: stats.lastWeek.views
    }
  };

  /*if (match.link_id) {
    const cacheTime = utils.getStatsCacheTime(total);
    const key = redis.key.stats(match.link_id);
    redis.set(key, JSON.stringify(response), "EX", cacheTime);
  }*/

  return response;
};

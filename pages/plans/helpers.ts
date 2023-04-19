import { NextRouter } from "next/router";
import { request } from "../../libs/utils/request";
import { setError, setWarning } from "../../components/Notification";
import session from "@ebanux/ebanux-utils/sessionStorage";

export function gotoLogin({ pathname, query }: NextRouter) {
  setWarning('You need to be authenticated before buying any plan!', true);
  session.set('CALLBACK_ROUTE', { pathname, query });
}

export function reviewingPlan() {
  request({ url: 'billing-portal' }).then(({ url }) => {
    window.open(url, '_blank');
  }).catch(setError);
}

export function buyPlan(planType: string) {
  const options = {
    url: 'subscriptions',
    method: "POST",
    data: { planType },
  };

  // Send request to create and get checkout-session url
  request(options).then(({ url: checkoutSessionUrl }) => {
    window.location.href = checkoutSessionUrl;
  }).catch(setError);
}
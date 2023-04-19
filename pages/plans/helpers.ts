import { NextRouter } from "next/router";
import { request } from "../../libs/utils/request";
import { setError, setWarning } from "../../components/Notification";
import { startAuthorizationFlow } from "../../libs/utils/auth";

interface RouterType {
  pathname: string,
  query?: any
}

export function gotoLogin(router: NextRouter | RouterType, redirect = false) {
  setWarning('You need to be authenticated before buying any plan!', true);
  if (redirect) startAuthorizationFlow(router);
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
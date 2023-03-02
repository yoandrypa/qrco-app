import React, { useContext, useEffect, useState } from "react";
import session from "@ebanux/ebanux-utils/sessionStorage";

import { useRouter } from "next/router";

import Context from "../../components/context/Context";
import PlanList from "../../components/plans/PlanList";

import { request } from "../../libs/utils/request";
import { setWarning } from "../../components/Notification";

const Plans = () => {
  const { pathname, query } = useRouter();
  const { subscription } = useContext(Context);
  const [activePlan, setActivePlan] = useState<string>();

  async function reviewingPlan() {
    request({ url: 'billing-portal', throwError: 'notify' }).then(({ url }) => {
      window.open(url, '_blank');
    });
  }

  async function onSelectedPlan(planType: string) {
    if (subscription && activePlan === planType) return await reviewingPlan();

    const options = {
      url: 'subscriptions',
      method: "POST",
      data: { planType },
      throwError: 'notify',
    };

    // Send request to create and get checkout-session url
    request(options).then(({ url: checkoutSessionUrl }) => {
      window.location.href = checkoutSessionUrl;
    });
  }

  useEffect(() => {
    if (session.isAuthenticated) {
      setActivePlan(subscription?.metadata?.plan_type || 'free');
    } else {
      setWarning('You need to be authenticated before buying any plan!', false);
      session.set('CALLBACK_ROUTE', { pathname, query });
    }
  }, [subscription]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PlanList
      activePlan={activePlan}
      onSelected={session.isAuthenticated ? onSelectedPlan : undefined}
    />
  );
};

export default Plans;

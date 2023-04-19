import React, { useContext, useEffect, useState } from "react";
import session from "@ebanux/ebanux-utils/sessionStorage";

import { useRouter } from "next/router";

import Context from "../../components/context/Context";
import PlanList from "../../components/plans/PlanList";

import { gotoLogin, buyPlan, reviewingPlan } from "./helpers";
import { setWarning } from "../../components/Notification";

const Plans = () => {
  const router = useRouter();
  const { subscription } = useContext(Context);
  const [activePlan, setActivePlan] = useState<string>(subscription?.metadata?.plan_type || 'free');

  function onSelectedPlan(planType: string, timeout = 0) {
    if (!subscription || subscription.status === 'canceled') return buyPlan(planType);
    if (timeout == 0) return reviewingPlan();

    let msg;
    if (activePlan === planType) {
      msg = 'You are already subscribed to this plan, you can see the details on your customer portal.';
    } else {
      msg = 'You are already subscribed to another plan, you can see the details on your customer portal.<br/>';
      msg += 'To subscribe to a new plan you must first cancel the old one.';
    }

    setWarning(msg, timeout);
    setTimeout(reviewingPlan, timeout);
  }

  useEffect(() => {
    if (!session.isAuthenticated) return gotoLogin(router);
    setActivePlan(subscription?.metadata?.plan_type || 'free');
  }, [subscription]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!session.isAuthenticated) return gotoLogin(router);
    if (router.query.type) onSelectedPlan(router.query.type as string, 8000);
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PlanList activePlan={activePlan} onSelected={session.isAuthenticated ? onSelectedPlan : undefined} />
  );
};

export default Plans;

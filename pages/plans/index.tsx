import React, { useContext, useEffect, useState } from "react";
import session from "@ebanux/ebanux-utils/sessionStorage";

import { useRouter } from "next/router";

import Context from "../../components/context/Context";
import PlanList from "../../components/plans/PlanList";

import { gotoLogin, buyPlan, reviewingPlan } from "../../helpers/plans";

const Plans = () => {
  const router = useRouter();
  const { subscription } = useContext(Context);
  const [activePlan, setActivePlan] = useState<string>(subscription?.metadata?.plan_type || 'free');

  function onSelectedPlan(planType: string) {
    if (!subscription || subscription.status === 'canceled') return buyPlan(planType);
    return reviewingPlan();
  }

  useEffect(() => {
    if (!session.isAuthenticated) return gotoLogin(router);
    setActivePlan(subscription?.metadata?.plan_type || 'free');
  }, [subscription]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PlanList activePlan={activePlan} onSelected={session.isAuthenticated ? onSelectedPlan : undefined} />
  );
};

export default Plans;

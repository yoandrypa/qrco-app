import React, { useContext, useEffect, useState } from "react";
import session from "@ebanux/ebanux-utils/sessionStorage";

import { useRouter } from "next/router";

import Context from "../../../components/context/Context";
import PlanList from "../../../components/plans/PlanList";

import { gotoLogin, buyPlan, reviewingPlan } from "../../../helpers/plans";
import { setWarning, setInfo } from "../../../components/Notification";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const Plans = ({ type }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { pathname } = useRouter();
  const { subscription } = useContext(Context);
  const [activePlan] = useState<string>(subscription?.metadata?.plan_type || 'free');

  function onSelectedPlan(planType: string) {
    if (!subscription || subscription.status === 'canceled') return buyPlan(planType);

    const timeout = 8000;
    if (activePlan === planType) {
      setInfo('You are already subscribed to this plan, you can see the details on your customer portal.', timeout);
    } else {
      setWarning([
        'You are already subscribed to another plan, you can see the details on your customer portal.',
        'To subscribe to a new plan you must first cancel the old one.'
      ], timeout);
    }

    setTimeout(reviewingPlan, timeout);
  }

  useEffect(() => {
    if (!session.isAuthenticated) return gotoLogin({ pathname, query: { type } }, true);
    onSelectedPlan(type);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PlanList activePlan={activePlan} onSelected={session.isAuthenticated ? onSelectedPlan : undefined} />
  );
};

// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({ params: { type } }) => {
  return { props: { type } };
};

export default Plans;



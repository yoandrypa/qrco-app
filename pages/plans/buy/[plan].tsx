import React from "react";
import { useRouter } from "next/router";
import BuyPlan from "../../../components/plans/BuyPlan";

const PlanType = () => {
  const router = useRouter();
  // @ts-ignore
  return <BuyPlan plan={router.query.plan as string}/>;
};

export default PlanType;


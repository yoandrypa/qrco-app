import React, { useState, useContext } from "react";
import session from "@ebanux/ebanux-utils/sessionStorage";

import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Context from "../../components/context/Context";
import PlanCard from "../../components/plans/plancard";
import PlanCalculator from "../../components/plans/PlanCalculator";
import plans from "../../consts/plans";

import { request } from "../../libs/utils/reguest";

const Plans = () => {
  const router = useRouter();
  // @ts-ignore
  const { subscription } = useContext(Context);
  const [error, setError] = useState<string | null>(null);
  const activePlan = subscription?.metadata?.plan_type || 'free';

  async function reviewingPlan() {
    const { url } = await request({ url: 'billing-portal', errorHandler: setError });
    window.open(url, '_blank');
  }

  async function handlePlanClick(planType: string) {
    if (!session.isAuthenticated) return router.push("/plans/buy/" + planType);

    if (subscription && activePlan === planType) return await reviewingPlan();

    const options = {
      url: 'subscriptions',
      method: "POST",
      data: { planType },
      errorHandler: setError,
    };

    // Send request to create and get checkout-session url
    const { result: { url: checkoutSessionUrl } } = await request(options);

    window.location.href = checkoutSessionUrl;
  };

  return (
    <>
      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert onClose={() => setError(null)} variant="filled" severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <Typography variant="h6" color="blue" textAlign={"center"} marginBottom={3} marginTop={2}>
        PRICING PLANS
      </Typography>
      <Typography variant="h4" textAlign={"center"} marginBottom={3}>
        Choose a monthly plan & pay for any additional QR code
      </Typography>
      <Box sx={{ alignContent: "center", display: "flex", spacing: 3, justifyContent: "center" }}>
      </Box>
      <Grid container marginTop={2} alignContent="center" display="flex" spacing={1} justifyContent={"center"}>
        <PlanCalculator />
      </Grid>
      <Grid container marginTop={3} marginBottom={3} alignContent="center" display="flex" spacing={1}
            justifyContent={"center"}>
        {
          Object.entries<any>(plans).map(([planType, data]) => (
            <PlanCard data={data} key={planType}
                      isCurrentPlan={activePlan === planType}
                      clickAction={handlePlanClick} />
          ))
        }
      </Grid>
    </>
  );
};

export default Plans;

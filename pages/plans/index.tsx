import React from "react";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Context from "../../components/context/Context";
import PlanCard from "../../components/plans/plancard";
import PlanCalculator from "../../components/plans/PlanCalculator";

import { parseErrorMessage } from "../../libs/exceptions";

import plans from "../../consts/plans";
import Subscription from "../../models/subscription";

// @ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage";
// @ts-ignore
import { request } from "@ebanux/ebanux-utils/request";

const Plans = () => {
  const router = useRouter();
  // @ts-ignore
  const { subscription, setSubscription, setLoading } = useContext(Context);
  const { currentAccount: user, isAuthenticated } = session;
  const [error, setError] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState(subscription?.metadata?.plan_type || 'free');

  useEffect(() => {
    if (isAuthenticated && !subscription) {
      setLoading(true);

      Subscription.getActiveByUser(user.cognito_user_id).then((subscription: any) => {
        setSubscription(subscription);
        setActivePlan(subscription?.metadata?.plan_type);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, []);

  const handleClick = async (planType: string) => {
    if (!session.isAuthenticated) return router.push("/plans/buy/" + planType);

    // TODO: Add confirmation dialog before any subscription action.

    if (subscription) {
      if (subscription.metadata.plan_type === planType) {
        // TODO: The functionality for reviewing subscriptions is not ready yet.
        setError('The functionality for reviewing subscriptions is not ready yet.');
      } else {
        // TODO: You are already subscribed to a plan, the functionality for changing subscriptions is not ready yet.
        setError('TODO: You are already subscribed to a plan, the functionality for changing subscriptions is not ready yet.');
      }
      return;
    }

    try {
      setLoading(true);

      const options = {
        url: 'subscriptions',
        method: "POST",
        data: { planType },
      };

      // Send request to create and get checkout-session url
      const { result: { url: checkoutSessionUrl } } = await request(options);

      window.location.href = checkoutSessionUrl;
    } catch (ex) {
      setError(parseErrorMessage(ex));
    } finally {
      setLoading(false);
    }
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
            <PlanCard data={data} key={planType} isCurrentPlan={activePlan === planType} clickAction={handleClick} />
          ))
        }
      </Grid>
    </>
  );
};

export default Plans;

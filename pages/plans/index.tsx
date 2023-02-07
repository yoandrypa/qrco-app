import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import PlanCard from "../../components/plans/plancard";
import BillingPortal from "../../components/billing/BillingPortal";
import PlanCalculator from "../../components/plans/PlanCalculator";

import { get } from "../../handlers/users";
import { handleFetchResponse } from "../../handlers/helpers";

import * as plans from "./plans";

// @ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage";

type Props = {
  logged: boolean,
  profile?: {
    planType?: string,
    customerId?: string,
    subscriptionData?: {
      //TODO
    }
  }
}

const Plans = (props: Props) => {
  const router = useRouter();
  const user = session.currentAccount;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session.isAuthenticated) {
      get(user.cognito_user_id).then(profile => {
        //@ts-ignore
        if (profile?.createdAt != null && !profile?.customerId) {
          //@ts-ignore
        }
        console.log(profile);
        if (profile?.subscriptionData != null &&
          profile?.customerId != null) {
          <BillingPortal customerId={profile?.customerId} />;
        }

        //TODO add logic for customer portal here
      });
    }
  }, [user]);

  const handleClick = async (plan: string) => {
    if (!user) return router.push("/plans/buy/" + plan);

    try {
      const payload = {
        // TODO: This is incorrect, the user identification must not be sent in the request, this information must be obtained in the backend from the token or the active session.
        id: user.cognito_user_id,
        email: user.email,
        plan_type: plan,
      };
      const options = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };
      const response = await fetch(`/api/create-customer`, options);
      const data = await handleFetchResponse(response);
      if (data instanceof Error) throw data;
      //@ts-ignore
      window.location.href = data.result?.url;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Something went wrong. We are working on it.";
      setError(errorMessage);
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
        <PlanCard data={plans.free} isCurrentPlan={false} clickAction={handleClick} />
        <PlanCard data={plans.basic} isCurrentPlan={false} clickAction={handleClick} />
        <PlanCard data={plans.business} isCurrentPlan={false} clickAction={handleClick} />
        <PlanCard data={plans.premium} isCurrentPlan={false} clickAction={handleClick} />
      </Grid>
    </>
  );
};

export default Plans;

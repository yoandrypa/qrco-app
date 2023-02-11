import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Context from "../../components/context/Context";
import PlanCard from "../../components/plans/plancard";
import BillingPortal from "../../components/billing/BillingPortal";
import PlanCalculator from "../../components/plans/PlanCalculator";

import { parseErrorMessage } from "../../libs/exceptions";
import * as Users from "../../handlers/users";

import * as plans from "./plans";

// @ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage";
// @ts-ignore
import { request } from "@ebanux/ebanux-utils/request";

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

  const { setLoading } = React.useContext(Context);

  useEffect(() => {
    if (session.isAuthenticated) {
      Users.get(user.cognito_user_id).then((profile) => {
        if (profile?.subscriptionData != null && profile?.customerId != null) {
          <BillingPortal customerId={profile?.customerId} />;
        }

        //TODO add logic for customer portal here
      });
    }
  }, [user]);

  const handleClick = async (plan: string) => {
    if (!session.isAuthenticated) return router.push("/plans/buy/" + plan);

    try {
      setLoading(true);

      const options = {
        url: 'subscriptions',
        method: "POST",
        data: {
          planType: plan,
        },
      };

      const response = await request(options);
      console.log(response);
      window.open(response.result.url, '_blank')
      // window.location.href = response.result.url;
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
        <PlanCard data={plans.free} isCurrentPlan={false} clickAction={handleClick} />
        <PlanCard data={plans.basic} isCurrentPlan={false} clickAction={handleClick} />
        <PlanCard data={plans.business} isCurrentPlan={false} clickAction={handleClick} />
        <PlanCard data={plans.premium} isCurrentPlan={false} clickAction={handleClick} />
      </Grid>
    </>
  );
};

export default Plans;

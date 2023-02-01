import React from "react";
import { useState, useEffect, useContext } from "react";
import PlanCard from "../../components/plans/plancard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import BillingPortal from "../../components/billing/BillingPortal";
import { get } from "../../handlers/users";
import { handleFetchResponse } from "../../handlers/helpers";
import PlanCalculator from "../../components/plans/PlanCalculator";
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
  //const [user, setUser] = useState<any>(null);
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

  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  const free = {
    title: "Free",
    description: "Upgrade to a paid plan for additional features and support",
    buttonText: "FREE",
    plan_type: "free",
    legend: "Limited set of core features",
    highlighted: false,
    priceAmount: "$0",
    features: [
      "Up to 1 dynamic QR code",
      "No additional Dynamic QR codes are allowed",
      "Unlimited pre-generated QRs",
      "Up to 1 microsite (mobile-friendly landing page)",
      "Unlimited static QR codes",
      "Unlimited scans",
      "QR codes design customization and edition",
      "Dynamic QR codes content edition",
      "Microsites appearance customization and edition",
    ],

  };
  const basic = {
    title: "Basic",
    description: "For small businesses/freelancers at an affordable price",
    buttonText: "SUBSCRIBE",
    plan_type: "basic",
    legend: "A good choice to get started",
    highlighted: false,
    priceAmount: "$9.00",
    features: [
      "Up to 50 dynamic QR codes",
      "$1 per aditional Dynamic QR",
      "Unlimited pre-generated QRs",
      "Up to 50 microsites (mobile-friendly landing pages)",
      "Unlimited static QR codes",
      "Unlimited scans",
      "QR codes design customization and edition",
      "Dynamic QR codes content edition",
      "Microsites appearance customization and edition",
    ],

  };
  const basicAnnual = {
    title: "Basic",
    description: "A good choice to get started and save some cash.",
    buttonText: "SUBSCRIBE",
    plan_type: "basicAnnual",
    legend: "Save two months",
    highlighted: false,
    priceAmount: "$90.00",
    features: [
      "Up to 5 Dynamic QR codes",
      "$1 per aditional Dynamic QR",
      "Unlimited pre-generated QRs",
      "Up to 5 microsites (mobile-friendly landing pages)",
      "Unlimited static QR codes",
      "Unlimited scans",
      "QR codes design customization and edition",
      "Dynamic QR codes content edition",
      "Microsites appearance customization and edition",
    ],

  };

  const business = {
    title: "Business",
    description: "For medium businesses who need a larger solution",
    buttonText: "SUBSCRIBE",
    plan_type: "business",
    legend: "Have plenty of room to grow.",
    highlighted: true,
    priceAmount: "$15.00",
    features: [
      "Up to 100 dynamic QR codes",
      "$0.90 per aditional Dynamic QR",
      "Unlimited pre-generated QRs",
      "Up to 100 microsites (mobile-friendly landing pages)",
      "Unlimited static QR codes",
      "Unlimited scans",
      "QR codes design customization and edition",
      "Dynamic QR codes content edition",
      "Microsites appearance customization and edition",
    ],
  };
  const businessAnnual = {
    title: "Business",
    description: "Receive a fair discount with our annual plan.",
    buttonText: "SUBSCRIBE",
    plan_type: "businessAnnual",
    legend: "Save three months",
    highlighted: true,
    priceAmount: "$135.OO",
    features: [
      "Up to 100 dynamic QR codes",
      "$0.90 per aditional Dynamic QR",
      "Unlimited pre-generated QRs",
      "Up to 100 microsites (mobile-friendly landing pages)",
      "Unlimited static QR codes",
      "Unlimited scans",
      "QR codes design customization and edition",
      "Dynamic QR codes content edition",
      "Microsites appearance customization and edition",

    ],

  };

  const premium = {
    title: "Premium",
    description: "The definitive plan. You're completely covered.",
    buttonText: "SUBSCRIBE",
    plan_type: "premium",
    legend: "Best price",
    highlighted: true,
    priceAmount: "$45.00",
    features: [
      "Up to 500 dynamic QR codes",
      "$0.80 per additional Dynamic QR",
      "Unlimited pre-generated QRs",
      "Unlimited microsites (mobile-friendly landing pages)",
      "Unlimited static QR codes",
      "Unlimited scans",
      "QR codes design customization and edition",
      "Dynamic QR codes content edition",
      "Microsites appearance customization and edition",
    ],
  };
  const premiumAnnual = {
    title: "Premium",
    description: "Receive a great discount and get completely covered.",
    buttonText: "SUBSCRIBE",
    plan_type: "premiumAnnual",
    legend: "Save four months",
    highlighted: true,
    priceAmount: "$360.00",
    features: [
      "Up to 500 dynamic QR codes",
      "$0.80 per additional Dynamic QR",
      "Unlimited pre-generated QRs",
      "Up to 500 microsites (mobile-friendly landing pages)",
      "Unlimited static QR codes",
      "Unlimited scans",
      "QR codes design customization and edition",
      "Dynamic QR codes content edition",
      "Microsites appearance customization and edition",
    ],
  };

  const handleClick = async (plan: string) => {
    if (!user) {
      router.push("/plans/buy/" + plan);
      return;
    } else {
      try {
        //const user = session.currentAccount;
        const payload = {
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
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, value: number) => {
    setActiveTab(value);
  };

  return (
    <>
      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert onClose={() => setError(null)} variant="filled" severity="error"
          sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      <Typography variant="h6" color="blue" textAlign={"center"}
        marginBottom={3} marginTop={2}>PRICING PLANS</Typography>
      <Typography variant="h4" textAlign={"center"} marginBottom={3}>Save money
        with our annual plans</Typography>
      <Box sx={{
        alignContent: "center",
        display: "flex",
        spacing: 3,
        justifyContent: "center",
      }}>

      </Box>
      <Grid container marginTop={2} alignContent="center" display="flex"
        spacing={1} justifyContent={"center"}>
        <PlanCalculator />
      </Grid>
      <Grid container marginTop={6} alignContent="center" display="flex"
        spacing={1} justifyContent={"center"}>

        <Grid item xs={12} sm={6} md={3} lg={3}>
          <PlanCard data={free}
            isCurrentPlan={false}
            clickAction={handleClick}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <PlanCard data={activeTab == 0 ? basic : basicAnnual}
            isCurrentPlan={false}
            clickAction={handleClick} />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <PlanCard data={business}
            isCurrentPlan={false}
            clickAction={handleClick} />
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={3}>
          <PlanCard data={premium}
            isCurrentPlan={false}
            clickAction={handleClick} />
        </Grid>
      </Grid>
    </>
  );
};

export default Plans;

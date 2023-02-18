import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router";

import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'

import BillingPortal from "../../components/billing/BillingPortal"
import { get } from '../../handlers/users'
import Loading from '../../components/Loading';

// @ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage";

const AccountPage = () => {
  const router = useRouter();
  const id = router.query["session_id"];
  const [userCustomerId, setUserCustomerId] = useState(null);

  useEffect(() => {
    const { currentUser, isAuthenticated } = session;

    if (isAuthenticated) {
      get(currentUser.cognito_user_id).then(profile => {
        console.log(profile);
        //@ts-ignore
        if (!profile?.customerId) {
          //@ts-ignore
          setTimeout(() => {
            router.reload()
          }, 2000);
        }
        setUserCustomerId(profile.customerId)

      });
    }
  }, []);

  if (!userCustomerId) {
    return (
      <Loading text='Loading your billing information' />
    )
  }

  //Billing portal
  return (
    <>
      <Typography variant='h4'>
        Billing details
      </Typography>
      <Divider></Divider>
      <Paper>
        <Typography padding={2}>
          To make managing your billings easier, we have partnered with Stripe.
          You can use the Review button below to make changes to your subscription plan, payment information,
          or view your billing history. Options include upgrading, downgrading, or canceling your subscription,
          and updating your payment methods.
        </Typography>
        <Grid container spacing={2}>
          <Grid item padding={2} marginLeft={2}>
            <BillingPortal customerId={userCustomerId} />
          </Grid>
        </Grid>

      </Paper>
    </>
  )
}

export default AccountPage
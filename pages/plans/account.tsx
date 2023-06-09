import React from 'react'

import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'

import Button from "@mui/material/Button";

import { request } from "../../libs/utils/request";
import { setError } from "../../components/Notification";

const AccountPage = () => {

  async function reviewingPlan() {
    request({ url: 'billing-portal' }).then(({ url }) => {
      window.open(url, '_blank');
    }).catch(setError);
  }

  return (
    <>
      <Typography variant='h4'>
        Billing details
      </Typography>
      <Divider></Divider>
      <Paper>
        <Typography padding={2}>
          To make easier your billings management, we have partnered with Stripe.
          You can use the Review button below to make changes to your subscription plan, payment information,
          or view your billing history. Options include upgrading, downgrading, or canceling your subscription,
          and updating your payment methods.
        </Typography>
        <Grid container spacing={2}>
          <Grid item padding={2} marginLeft={2}>
            <Button variant='contained' onClick={reviewingPlan}>
              Review plan
            </Button>
          </Grid>
        </Grid>

      </Paper>
    </>
  )
}

export default AccountPage

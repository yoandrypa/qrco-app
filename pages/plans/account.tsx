import React from 'react'

import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'

import Button from "@mui/material/Button";

import { request } from "../../libs/utils/reguest";

const AccountPage = () => {

  async function reviewingPlan() {
    const { url } = await request({
      url: 'billing-portal',
      // TODO: Add emitError to notification component
      // errorHandler: emitError,
    });
    window.open(url, '_blank');
  }

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
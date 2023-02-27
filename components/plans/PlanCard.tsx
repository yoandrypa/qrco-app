import React, { useContext, useState } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Done from '@mui/icons-material/Done'
import Paper from '@mui/material/Paper'
import LoadingButton from '@mui/lab/LoadingButton'
import Context from "../context/Context";

interface CardOptions {
  title: string,
  description: string,
  plan_type: PlanType,
  priceAmount: string,
  legend: string,
  buttonText: string,
  features: string[],
  highlighted?: boolean
}

type PlanCardProps = {
  data: CardOptions,
  clickAction?: (planType: string) => void,
  isCurrentPlan: boolean
}

const PlanCard = ({ data, clickAction, isCurrentPlan }: PlanCardProps) => {
  // @ts-ignore
  const { subscription } = useContext(Context);
  const { title, description, plan_type, legend, priceAmount, highlighted, buttonText, features } = data;

  const elevation = isCurrentPlan ? 5 : 2;
  const bgColor = isCurrentPlan ? '#efffef' : '#ffffff';
  const disabled = !clickAction
    || plan_type === 'free'
    || (!isCurrentPlan && subscription && subscription.status !== 'canceled');

  return (
    <Grid item xs={12} sm={6} md={3} lg={3}>
      <Paper sx={{ borderRadius: 2.5, maxWidth: 340, height: '100%', backgroundColor: bgColor }} elevation={elevation}>
        <Typography variant='h5' align='center' sx={{ marginBottom: 2, paddingTop: 3 }}>
          {title}
        </Typography>
        <Typography minHeight={60} height={70} textAlign='center' color='gray'
                    sx={{ marginBottom: 1, marginTop: 1, margin: 1 }}>
          {description}
        </Typography>
        <Grid container alignContent='center' display='flex' justifyContent={'center'}>
          <Grid item sx={{
            marginTop: 2,
            justifyContent: 'stretch',
            alignContent: 'baseline',
            display: 'flex',
            color: 'gray'
          }}>
            <Typography variant='h6'>
              (USD)
            </Typography>
          </Grid>
          <Grid item sx={{ margin: 1, justifyContent: 'stretch', alignContent: 'center', display: 'flex' }}>
            <Typography variant='h4'>
              {priceAmount}
            </Typography>
          </Grid>
        </Grid>
        <Typography color='gray' textAlign={'center'}> {legend}</Typography>
        <Grid sx={{ justifyContent: 'center', alignContent: 'center', display: 'flex', margin: 2 }}>
          <LoadingButton disabled={disabled}
                         onClick={() => clickAction?.(plan_type)}
                         variant={highlighted ? 'contained' : 'outlined'}>
            {isCurrentPlan ? 'Review' : buttonText || 'Buy now'}
          </LoadingButton>
        </Grid>
        {
          features?.map((feature, index) => (
              <Grid key={index} container sx={{ minHeight: 60 }}>
                <Grid item key={index} xs={2} sx={{ display: 'flex', justifyContent: 'right', paddingRight: 1 }}>
                  <Done color='success' />
                </Grid>
                <Grid item xs={10}>
                  <Typography sx={{ paddingRight: 1 }}>
                    {feature}
                  </Typography>
                </Grid>
              </Grid>
            )
          )
        }
      </Paper>
    </Grid>
  )
}

export default PlanCard;

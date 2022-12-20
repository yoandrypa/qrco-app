import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Done from '@mui/icons-material/Done'
import Paper from '@mui/material/Paper'
import LoadingButton from '@mui/lab/LoadingButton'

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
  clickAction: (planType: string) => void,
  isCurrentPlan: boolean
}

const PlanCard = ({ data, clickAction, isCurrentPlan }: PlanCardProps) => {
  const [innerLoading, setInnerLoading] = useState(false)

  return (
    <Paper sx={{ borderRadius: 2.5, maxWidth: 340 }}>
      <Typography variant='h5' align='center' sx={{ marginBottom: 2, paddingTop: 3 }} >
        {data.title}
      </Typography>
      <Typography minHeight={60} height={70} textAlign='center' color='gray' sx={{ marginBottom: 1, marginTop: 1, margin: 1 }}>
        {data.description}
      </Typography>
      <Grid container alignContent='center' display='flex' justifyContent={'center'}>
        <Grid item sx={{ margin: 1, justifyContent: 'stretch', alignContent: 'center', display: 'flex' }}>
          <Typography variant='h4' >
            {data.priceAmount}
          </Typography>
        </Grid>
      </Grid>
      <Typography color='gray' textAlign={'center'}> {data.legend}</Typography>
      <Grid sx={{ justifyContent: 'center', alignContent: 'center', display: 'flex', margin: 2 }}>
        <LoadingButton loading={innerLoading}
          onClick={() => {
            setInnerLoading(true)
            clickAction(data.plan_type)
            setInnerLoading(false)
          }}
          variant={data.highlighted ? 'contained' : 'outlined'} >
          {isCurrentPlan ? 'Review': data.buttonText || 'Buy now'}
        </LoadingButton>
      </Grid>
      {data.features?.map((feature, index) => {

        return (
          <Grid key={index} container sx={{ marginLeft: 1, paddingBottom: 2, marginBottom: 2 }}>
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
      })}
    </Paper>
  )
}

export default PlanCard;

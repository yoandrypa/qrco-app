import React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import PlanCalculator from "../PlanCalculator";
import PlanCard from "../PlanCard";
import plans from "../../../consts/plans";
import classes from "./styles.jss";

type PlanListProps = {
  onSelected?: (planType: string) => void;
  activePlan?: string;
}

const PlanList = ({ onSelected, activePlan }: PlanListProps) => {
  return (
    <>
      <Typography variant="h6" color="blue" sx={classes.title}>
        PRICING PLANS
      </Typography>
      <Typography variant="h4" sx={classes.subTitle}>
        Choose a monthly plan & pay for any additional QR code
      </Typography>
      <Grid container sx={classes.calculator}>
        <PlanCalculator />
      </Grid>
      <Grid container sx={classes.items} spacing={1}>
        {
          Object.entries<any>(plans).map(([planType, data]) => (
            <PlanCard data={data} key={planType} isCurrentPlan={activePlan === planType} clickAction={onSelected} />
          ))
        }
      </Grid>
    </>
  )
}

export default PlanList;
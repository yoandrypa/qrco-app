import React, { useContext, useState } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import AllowIcon from '@mui/icons-material/Done'
import NoAllowIcon from '@mui/icons-material/CloseOutlined'
import Paper from '@mui/material/Paper'
import LoadingButton from '@mui/lab/LoadingButton'
import Context from "../context/Context";

interface CardOptions {
  title: string,
  description: string,
  planType: PlanType,
  priceAmount: string,
  legend: string,
  buttonText: string,
  features: any,
  highlighted?: boolean
}

type PlanCardProps = {
  data: CardOptions,
  clickAction?: (planType: string) => void,
  isCurrentPlan: boolean
}

type FeatureProps = {
  name: string;
  value: number | boolean | string;
}

const parseUpToText = (value: number | boolean | string, feature: string) => {
  if (value === -1) return `Unlimited ${feature}`
  if (value === 0) return `No ${feature} are allowed`;
  return `Up to ${value} ${feature}`;
}

const parseAmountText = (value: number | boolean | string, feature: string) => {
  if (value === -1) return `Unlimited ${feature}`
  if (value === 0) return `No ${feature} are allowed`;
  return `${value} per ${feature}`;
}

const parseFeatureText = (feature: string, value: number | boolean | string) => {
  switch (feature) {
    case 'upToDynamicQR':
      return parseUpToText(value, 'dynamic QR code');
    case 'amountByAdditionalDynamicQR':
      return parseAmountText(value, 'additional dynamic QR');
    case 'upToPreGeneratedQR':
      return parseUpToText(value, 'pre-generated QRs');
    case 'upToMicroSite':
      return parseUpToText(value, 'micro-site (mobile-friendly landing page');
    case 'upToStaticQR':
      return parseUpToText(value, 'static QR codes');
    case 'upToScans':
      return parseUpToText(value, 'scans');
    case 'allowQRCodesDesign':
      return 'QR codes design customization and edition';
    case 'allowEditDynamicQRContent':
      return 'Dynamic QR codes content edition';
    case 'allowEditMicroSite':
      return 'Micro-sites appearance customization and edition';
  }
}

const Feature = ({ name, value }: FeatureProps) => {
  const icon = !!value ? <AllowIcon color='success' /> : <NoAllowIcon color='error' />;

  return (
    <Grid container sx={{ minHeight: 60 }}>
      <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'right', paddingRight: 1 }}>
        {icon}
      </Grid>
      <Grid item xs={10}>
        <Typography sx={{ paddingRight: 1 }}>
          {parseFeatureText(name, value)}
        </Typography>
      </Grid>
    </Grid>
  )
}

const PlanCard = ({ data, clickAction, isCurrentPlan }: PlanCardProps) => {
  // @ts-ignore
  const { subscription } = useContext(Context);
  const { title, description, planType, legend, priceAmount, highlighted, buttonText } = data;

  const features = isCurrentPlan ? subscription.features : data.features;
  const elevation = isCurrentPlan ? 5 : 2;
  const bgColor = isCurrentPlan ? '#efffef' : '#ffffff';
  const disabled = !clickAction
    || planType === 'free'
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
                         onClick={() => clickAction?.(planType)}
                         variant={highlighted ? 'contained' : 'outlined'}>
            {isCurrentPlan ? 'Review' : buttonText || 'Buy now'}
          </LoadingButton>
        </Grid>

        <Feature name="upToDynamicQR" value={features.upToDynamicQR} />
        <Feature name="amountByAdditionalDynamicQR" value={features.amountByAdditionalDynamicQR} />
        <Feature name="upToPreGeneratedQR" value={features.upToPreGeneratedQR} />
        <Feature name="upToMicroSite" value={features.upToMicroSite} />
        <Feature name="upToStaticQR" value={features.upToStaticQR} />
        <Feature name="upToScans" value={features.upToScans} />
        <Feature name="allowQRCodesDesign" value={features.allowQRCodesDesign} />
        <Feature name="allowEditDynamicQRContent" value={features.allowEditDynamicQRContent} />
        <Feature name="allowEditMicroSite" value={features.allowEditMicroSite} />

      </Paper>
    </Grid>
  )
}

export default PlanCard;

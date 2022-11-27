import React from 'react'
import { useState, useEffect, useContext } from 'react'
import PlanCard from '../../components/plans/plancard'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from '../../libs/aws/aws-exports'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Dialog from '@mui/material/Dialog'
import { useRouter } from 'next/router';
import Context from '../../components/context/Context'
import axios, { AxiosError } from 'axios'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import BillingPortal from '../../components/billing/BillingPortal'
import { get } from '../../handlers/users'

type Props = {
  logged: boolean,
  profile?: {
    planType?: string,
    customerId?: string,
    subscriptionData?: {

    }
  }

}

Amplify.configure(awsconfig);

const Plans = (props: Props) => {
  const [user, setUser] = useState<any>(null);
  const [mustLogInDlg, setMustLogInDlg] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [startTrialDate, setStartTrialDate] = useState<string | null>(null)

  // @ts-ignore
  const { userInfo } = useContext(Context)
  const API = axios.create({
    baseURL: process.env.REACT_APP_DEFAULT_DOMAIN === 'localhost:3000' ?
      `http://${process.env.REACT_APP_DEFAULT_DOMAIN}` :
      `https://${process.env.REACT_APP_DEFAULT_DOMAIN}`

  });



  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(currentUser => { })
      .catch(() => setUser(null));

    //@ts-ignore
    (userInfo != null && userInfo != undefined) && setUser(userInfo)
    if (props.logged === true) {
      //@ts-ignore
      if (props.profile?.createdAt != null && !props.profile?.customerId) {
        //@ts-ignore
        setStartTrialDate(props.profile.createdAt)
      }

      if (props.profile?.subscriptionData != null && props.profile?.customerId != null) {
        <BillingPortal customerId={props.profile?.customerId} />
      }

      //TODO add logic for customer portal here
    }
  }, [userInfo, props.logged, props.profile]);



  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter()

  const basic = {
    title: "Basic Account",
    description: "For small businesses/freelancers at an affordable price",
    buttonText: "START NOW",
    plan_type: "basic",
    legend: "A good choice to get started",
    highlighted: false,
    priceAmount: "$9.00",
    features: [
      '5 dynamic QR codes',
      'Up to 5 microsites (mobile-friendly landing pages)',
      'Unlimited static QR codes',
      'Unlimited scans',
      'QR codes design customization and edition',
      'Dynamic QR codes content edition',
      'Microsites appearance customization and edition'
    ],

  }
  const basicAnnual = {
    title: "Basic Account",
    description: 'A good choice to get started and save some cash.',
    buttonText: "START NOW",
    plan_type: "basicAnnual",
    legend: "Save two months",
    highlighted: false,
    priceAmount: "$90.00",
    features: [
      "5 Dynamic QR codes",
      "Up to 5 microsites (mobile-friendly landing pages)",
      "Unlimited static QR codes",
      'Unlimited scans',
      'QR codes design customization and edition',
      'Dynamic QR codes content edition',
      'Microsites appearance customization and edition'
    ],

  }

  const business = {
    title: "Business Account",
    description: "For medium businesses who need a larger solution",
    buttonText: "START NOW",
    plan_type: "business",
    legend: "Have plenty of room to grow.",
    highlighted: true,
    priceAmount: "$15.00",
    features: [
      '100 dynamic QR codes',
      'Up to 100 microsites (mobile-friendly landing pages)',
      'Unlimited static QR codes',
      'Unlimited scans',
      'QR codes design customization and edition',
      'Dynamic QR codes content edition',
      'Microsites appearance customization and edition'
    ],
  }
  const businessAnnual = {
    title: "Business Account",
    description: 'Receive a fair discount with our annual plan.',
    buttonText: "START NOW",
    plan_type: "businessAnnual",
    legend: 'Save three months',
    highlighted: true,
    priceAmount: "$135.OO",
    features: [
      '100 dynamic QR codes',
      'Up to 100 microsites (mobile-friendly landing pages)',
      'Unlimited static QR codes',
      'Unlimited scans',
      'QR codes design customization and edition',
      'Dynamic QR codes content edition',
      'Microsites appearance customization and edition'

    ],

  }

  const premium = {
    title: "Premium Account",
    description: "The definitive plan. You're completely covered.",
    buttonText: "START NOW",
    plan_type: "premium",
    legend: "Limitless",
    highlighted: true,
    priceAmount: "$45.00",
    features: [
      'Unlimited dynamic QR codes',
      'Unlimited microsites (mobile-friendly landing pages)',
      'Unlimited static QR codes',
      'Unlimited scans',
      'QR codes design customization and edition',
      'Dynamic QR codes content edition',
      'Microsites appearance customization and edition'
    ],
  }
  const premiumAnnual = {
    title: "Premium Account",
    description: 'Receive a great discount and get completely covered.',
    buttonText: "START NOW",
    plan_type: "premiumAnnual",
    legend: 'Save four months',
    highlighted: true,
    priceAmount: "$360.00",
    features: [
      'Unlimited dynamic QR codes',
      'Unlimited microsites (mobile-friendly landing pages)',
      'Unlimited static QR codes',
      'Unlimited scans',
      'QR codes design customization and edition',
      'Dynamic QR codes content edition',
      'Microsites appearance customization and edition'
    ],
  }


  const handleClick = async (plan: string) => {
    if (!props.logged) {
      router.push('/?login=true')
    } else {
      try {
        const payload = {
          id: user.attributes.sub,
          email: user.attributes.email,
          plan_type: plan
        }
        const options = {
          method: 'post',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload)
        };
        const response = await fetch(`/api/create-customer`, options);
        const data = await handleFetchResponse(response)
        //@ts-ignore
        window.location.href = data.result.url;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Something went wrong. We are working on it.'
        setError(errorMessage)
      }
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, value: number) => {
    setActiveTab(value)
  }

  return (
    <>
      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert onClose={() => setError(null)} variant="filled" severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Typography variant='h6' color='blue' textAlign={'center'} marginBottom={3} marginTop={2}>PRICING PLANS</Typography>
      <Typography variant='h4' textAlign={'center'} marginBottom={3}>Save money with our annual plans</Typography>

      <Box sx={{ alignContent: 'center', display: 'flex', spacing: 3, justifyContent: 'center' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label='Monthly Plan' />
          <Tab label='Annual Plan' />
        </Tabs>
      </Box>
      <Grid container marginTop={6} alignContent='center' display='flex' spacing={3} justifyContent={'center'}>
        <Grid item xs={12} md={6} lg={4}>
          <PlanCard data={activeTab == 0 ? basic : basicAnnual}
            isCurrentPlan={false}
            clickAction={handleClick} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <PlanCard data={activeTab == 0 ? business : businessAnnual}
            isCurrentPlan={false}
            clickAction={handleClick} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <PlanCard data={activeTab == 0 ? premium : premiumAnnual}
            isCurrentPlan={false}
            clickAction={handleClick} />
        </Grid>
      </Grid>
    </>


  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next'
import { handleFetchResponse } from '../../handlers/helpers'

export const getServerSideProps: GetServerSideProps = async ({ query, req, res }) => {

  const getUserInfo = async (): Promise<CognitoUserData | null> => {
    try {
      let userInfo = {};
      for (const [key, value] of Object.entries(req.cookies)) {
        // @ts-ignore
        userInfo[key.split(".").pop()] = value;
      }
      // @ts-ignore
      if (!userInfo.userData) {
        return null;
      }
      //@ts-ignore
      return userInfo;
    } catch (e) {
      return null;
    }
  };

  const userInfo = await getUserInfo();
  if (userInfo) {

  }

  if (!userInfo?.userData) {
    return {
      props: {
        logged: false
      }
    }
  } else {

    //@ts-ignore
    const userData = JSON.parse(userInfo.userData as string)
    const userId = userData.UserAttributes[0].Value;
    const data: object = await get(userId)
    return {
      props: {
        logged: true,
        profile: JSON.parse(JSON.stringify(data))
      }
    }
  }


}

export default Plans

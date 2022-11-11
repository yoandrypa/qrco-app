import React from 'react'
import { useState, useEffect, useContext } from 'react'
import PlanCard from '../../components/plans/plancard'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import { Amplify } from 'aws-amplify';
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
import {get} from '../../handlers/users'
import CountDown from '../../components/countdown/CountDown'
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
  const [startTrialDate,setStartTrialDate] = useState<string | null>(null)

  // @ts-ignore
  const { userInfo } = useContext(Context)
  const API = axios.create({
    baseURL: process.env.REACT_APP_DEFAULT_DOMAIN === 'localhost:3000' ?
      `http://${process.env.REACT_APP_DEFAULT_DOMAIN}` :
      `https://${process.env.REACT_APP_DEFAULT_DOMAIN}`

  });

   

  useEffect(() => {
    // Auth.currentAuthenticatedUser()
    //     .then(currentUser => setUser(currentUser.attributes.email))
    //     .catch(() => setUser(null));

    // console.log(user)       
    //@ts-ignore
    (userInfo != null && userInfo != undefined) && setUser(userInfo)
    if(props.logged === true){
      console.log(props.profile)
      //@ts-ignore
      if (props.profile?.createdAt != null && !props.profile?.customerId){
        //@ts-ignore
        setStartTrialDate(props.profile.createdAt)
      }

      if(props.profile?.subscriptionData != null && props.profile?.customerId != null){
        <BillingPortal customerId={props.profile?.customerId}/>
      }
      
      //TODO add logic for customer portal here
    }
  }, [userInfo,props.logged,props.profile]);



  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter()

  const basic = {
    title: "Basic Account",
    description: "For small businesses/freelancers at an affordable price.",
    buttonText: "Subscribe",
    plan_type: "basic",
    legend: "A good choice to get started",
    highlighted: false,
    priceAmount: "$9",
    features: [
      "Up to 5 Dynamic QR codes",
      "Unlimited static QR codes",
      "Unlimited scans"
    ],

  }
  const basicAnnual = {
    title: "Basic Account",
    description: "A good choice to get started",
    buttonText: "Subscribe",
    plan_type: "basicAnnual",
    legend: "Save two months",
    highlighted: false,
    priceAmount: "$90",
    features: [
      "Up to 5 Dynamic QR codes",
      "Unlimited static QR codes",
      "Unlimited scans"
    ],

  }

  const business = {
    title: "Business Account",
    description: "For medium business/freelancers who need a more complete solution.",
    buttonText: "Subscribe",
    plan_type: "business",
    legend: "Have plenty of room to grow.",
    highlighted: false,
    priceAmount: "$15",
    features: [
      "Up to 100 Dynamic QR codes",
      "Unlimited static QR codes",
      "Unlimited scans"
    ],
  }
  const businessAnnual = {
    title: "Business Account",
    description: "Receive a great discount with our annual plan.",
    buttonText: "Subscribe",
    plan_type: "businessAnnual",
    legend: "Have plenty of room to grow.",
    highlighted: false,
    priceAmount: "$150",
    features: [
      "Up to 100 Dynamic QR codes",
      "Unlimited static QR codes",
      "Unlimited scans"
    ],

  }

  const premium = {
    title: "Premium Account",
    description: "The definitive plan. You're completely covered.",
    buttonText: "Subscribe",
    plan_type: "premium",
    legend: "Limitless",
    highlighted: true,
    priceAmount: "$45",
    features: [
      "Unlimited dynamic QR codes",
      "Unlimited static QR codes",
      "Unlimited scans"
    ],
  }
  const premiumAnnual = {
    title: "Premium Account",
    description: "The definitive plan. You're completely covered.",
    buttonText: "Subscribe",
    plan_type: "premiumAnnual",
    legend: "With a great discount. You deserve the best",
    highlighted: true,
    priceAmount: "$360",
    features: [
      "Unlimited dynamic QR codes",
      "Unlimited static QR codes",
      "Unlimited scans"
    ],
  }


  const handleClick = async (plan: string) => {
    if (!props.logged) {
      setMustLogInDlg(true)
    } else {

      try {
        const response = await API.post(`/api/create-customer`, {
          id: user.attributes.sub,
          email: user.attributes.email,
          plan_type: plan
        })

        if (response.status === 200 && response.data.result.url) {
          window.location.href = response.data.result.url
        }

      } catch (error) {
        const errorMessage = error instanceof AxiosError ? error.message : 'Something went wrong'
        setError(errorMessage)
      }



    }
  }

  const handleTabChange = (event: React.SyntheticEvent, value: number) => {
    setActiveTab(value)
  }

  // const action = (
  //   <Button onClick={()=> window.location.href = 'mailto:'} color="primary" variant='contained' sx={{ marginLeft: 2 }} size="small">
  //     Support
  //   </Button>
  // );

  return (
    <>
      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert onClose={() => setError(null)} variant="filled" severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Dialog open={mustLogInDlg}>
        <DialogContent>
          Sorry, you must have an account to buy a Plan.
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={async () => {
            await router.push('/?login=true')
          }}>
            Login
          </Button>
          <Button onClick={() => setMustLogInDlg(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant='h6' color='blue' textAlign={'center'} marginBottom={3} marginTop={2}>PRICING PLANS</Typography>
      <Typography variant='h4' textAlign={'center'} marginBottom={3}>Save money with our annual plans</Typography>
      
    
         {/* {startTrialDate && <TrialCountDown dateFrom={startTrialDate}/>} */}
         {/* {startTrialDate && <CountDown startDate={startTrialDate}/>}*/}

        <Box sx={{ alignContent: 'center', display: 'flex', spacing: 3, justifyContent: 'center' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label='Monthly' />
          <Tab label='Annual' />
        </Tabs>  
      </Box>
      <Grid container alignContent='center' display='flex' spacing={3} justifyContent={'center'}>
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
  if (userInfo){

  }

  if (!userInfo?.userData){
    return {
      props: {
        logged: false
      }
    }
  } else {
   console.log(userInfo)
   //@ts-ignore
  const userData = JSON.parse(userInfo.userData as string)
  const userId = userData.UserAttributes[0].Value;
  console.log('user infoData es',userData)
  const data: object = await get(userId)
   console.log('data retrieved', data)
  return {
    props: {
      logged: true,
      profile: JSON.parse(JSON.stringify(data)) 
    }
  }
} 


}

export default Plans

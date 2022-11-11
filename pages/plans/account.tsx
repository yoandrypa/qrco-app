

import React, {useContext} from 'react'
import Paper from '@mui/material/Paper'
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import BillingPortal from "../../components/billing/BillingPortal"
import Context from '../../components/context/Context'
import Grid from '@mui/material/Grid'
import {get} from '../../handlers/users'
import Box from '@mui/material/Box'
import Image from 'next/image'

type Props = {
  logged: boolean,
  profile?: {customerId?: string},
  planType?: string
}

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
  return {
    props: {
      logged: true,
      profile: JSON.parse(JSON.stringify(data)) 
    }
  }
} 


} 

 const AccountPage = (props: Props) => {
  // @ts-ignore
  const { userInfo } = useContext(Context)
  const router = useRouter();
  const id = router.query["session_id"];
 console.log(id)
 console.log(props.logged, props.profile)

 if (!props.profile?.customerId){ 
  return (
<Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }}>
  <Image width={250} height={200} alt='Ops' src='/images/ops/oops-problem-man-business.jpg'/>
  <Typography textAlign={'center'} >
      No data available yet . Try refresh this page.
    </Typography>
</Box>
   
  )
 } else {

  return (
    <>
    <Typography variant='h4'>
      Account details
    </Typography>
    <Divider></Divider>
    <Paper>
      <Typography padding={2}>
      The Qr Link has Stripe as official partner to ensure a better experience managing your billings.
       Use the Review button bellow to make changes on your plan or payment information. 
      </Typography>
      <Typography>You can:</Typography>
      <ul>
        <li>
        <Typography>Upgrade, downgrade, or cancel a subscription.</Typography>
        </li>
        <li>
        <Typography>Update your payment methods.</Typography>
        </li>
        <li>
        <Typography>View their billing history.</Typography>
        </li>
      </ul>
      <Grid container spacing={2}>
        <Grid item padding={2} marginLeft={2}>
        <BillingPortal customerId={props.profile?.customerId || ''} />
        </Grid>
        <Grid item padding={2}>
        <Button variant='outlined'>
          Home Page
        </Button>
        </Grid>
        <Grid item>
      {/* <Button  variant='outlined'>Later</Button> */}
       
        </Grid>
      </Grid>
     
    </Paper>
    </>
  )

 }

}



export default AccountPage
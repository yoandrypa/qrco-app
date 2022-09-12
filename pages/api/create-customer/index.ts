import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import {update, find} from '../../../handlers/users'
// import {PLAN_TEST_MODE_PRICES} from '../../../consts'
//init stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-08-01',
  })


  async function createCustomerInStripe(email: string): Promise<string | Error> {
  try {
    const params: Stripe.CustomerCreateParams = {
      email: email
    }
    const customer: Stripe.Customer = await stripe.customers.create(params)
    return customer.id
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error'
    return err as Error
  }
}

async function createCheckoutSession(
  customer_id: string,
   plan_type: string) {
  try {
     const session = stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: '',
          // For metered billing, do not pass quantity
          quantity: 1
        }
      ],
      success_url: `${process.env.REACT_APP_DEFAULT_DOMAIN}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.REACT_APP_DEFAULT_DOMAIN}/plans/`
     })
     return session
  } catch (error) {
    return error as Error
  }
}

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    if (req.method === 'POST') {
      if (!req.body.id || !req.body.email || !req.body.plan_type){
        return res.status(400).send('Missing parameters in request (email, plan_type and id)')
      }      
      const userData = await find(req.body.id)  
      if(!userData){
        return res.status(404).send('No user found for this id ' + req.body.id )
      }
      console.log('user data ',JSON.stringify(userData))  

         //creating new customer
          if (!userData.customerId){ 
           const customer_id = await createCustomerInStripe(req.body.email);
            if (customer_id instanceof Error ){
               return res.status(500).json({error: true,message: customer_id.message})
               }
           const updateResult = await update({id: req.body.id}, {customerId: customer_id})
            if(!updateResult){
              return res.status(500).json(updateResult)
            }            
          }
           
      const session = await createCheckoutSession(userData.plan_customer_id,req.body.plan_type) 
      if (session instanceof Error ) {
        return res.status(500).json({error: true, message: session.message})
      } 
        res.status(200).json({session})
  } else {
    //Incorrect method
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }



  }
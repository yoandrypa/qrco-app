// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// import { update, findByCustomerId } from '../../../handlers/users'
import Stripe from 'stripe'
import { sendEmail } from '../../../handlers/email'
// const stripe = new Stripe(process.env.REACT_STRIPE_SECRET_KEY || 'sk_test_51Ksb3LCHh3XhfaZr2tgzaQKAQtuTF9vRtgdXBS7X2rAaPC6FNoLQ3hyPFVmlnRhsif0FDdbi5cdgEh7Y1Wt9Umo900w9YPUGo6', {
//   // https://github.com/stripe/stripe-node#configuration
//   apiVersion: '2022-08-01',
// })


type ResponseData = {

}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {


  const result = await sendEmail('info@ebanux.com', ['yosle007@gmail.com'], 'hello', 'test')
  res.status(200).json(result)

  // if (req.method == 'POST') {

  //   const userid = req.body.userId
  //   // const {id} = await get(userid)
  //   const customerId = req.body.customerId
  //   const customer: any = await findByCustomerId(customerId)


  //   try {
  //     const query = await update({ id: userid }, {
  //       planType: 'basicAnnual', subscriptionData: {
  //         createdDate: 231312,
  //         currency: "usd",
  //         id: "sasaas",
  //         status: "active",
  //         periodEndsAt: 23123123,
  //         periodStartsAt: 232323232,
  //         interval: 'day',
  //         priceId: "sdsdasdads",
  //         intervalCount: 23232
  //       }
  //     })


  //     return res.status(200).json({ customer: customer, query })
  //     //  const subscription = await stripe.subscriptions.retrieve(req.body.subscription);
  //     //  const customer = subscription.customer.toString() 
  //     // const id = await findByCustomerId(customer as string)
  //     // return res.status(200).json({objecto: id, customer: customer, subs: subscription}) 


  //     console.log(query)
  //   } catch (error) {
  //     res.status(500).json(error as ResponseData)
  //   }

  // } else {
  //   return res.status(400)
  // }




}
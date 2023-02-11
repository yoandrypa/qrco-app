// // import { buffer } from 'micro'
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import getRawBody from 'raw-body';
import { onCheckoutCompleted, onDeleteSubscription, onSubscriptionUpdated } from '../../handlers/webhooks';
import { stripe } from "../../libs/gateways/stripe";

// disable body parser to receive the raw body string. The raw body
// is fundamental to verify that the request is genuine
export const config = {
  api: {
    bodyParser: false,
  },
};

type ResponseData = {}

const webhookSecret: string = process.env.STRIPE_EVENTS_SECRET!

export enum StripeWebhooks {
  AsyncPaymentSuccess = 'checkout.session.async_payment_succeeded',
  Completed = 'checkout.session.completed',
  PaymentFailed = 'checkout.session.async_payment_failed',
  SubscriptionDeleted = 'customer.subscription.deleted',
  SubscriptionUpdated = 'customer.subscription.updated',
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature']!
    let event: Stripe.Event

    if (!process.env.STRIPE_EVENTS_SECRET) {
      return res.status(500).send('No secret webhook key is available')
    }

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      // On error, log and return the error message.
      if (err! instanceof Error) console.log(err)
      console.error(`Error message: ${errorMessage}`)
      res.status(400).send(`Webhook Error: ${errorMessage}`)
      return
    }

    // Successfully constructed event.
    console.log('Success constructing event:', event.id)

    switch (event.type) {
      case StripeWebhooks.Completed: {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription == null) {
          console.error('Error - Susbcription id is null', session);
          return res.status(500).json({ error: 'No subscription Id retrieved', subscription: session.subscription })
        } else {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          try {
            const result = onCheckoutCompleted(session, subscription);
            if (result instanceof Error) {
              res.status(500).send(`Error saving checkout without exception ${result}`)
            }
          } catch (error) {
            res.status(500).send('error saving checkout')
          }
        }


        break;
      }

      // case StripeWebhooks.AsyncPaymentSuccess: {
      //   const session = event.data.object as Stripe.Checkout.Session;
      //   const customerId = session.customer as string;

      //   await activatePendingSubscription(customerId);

      //   break;
      // }

      case StripeWebhooks.SubscriptionDeleted: {
        const subscription = event.data.object as Stripe.Subscription;
        //casting to string
        await onDeleteSubscription(subscription.customer as string);

        break;
      }

      case StripeWebhooks.SubscriptionUpdated: {
        const subscription = event.data.object as Stripe.Subscription;
        try {
          const result = await onSubscriptionUpdated(subscription);
          if (result instanceof Error) {
            res.status(500).send(`Error saving subscription update without exception ${result}`)
          }

        } catch (error) {
          res.status(500).json({ error })
        }

        break;
      }

      case StripeWebhooks.PaymentFailed: {
        const session = event.data.object as Stripe.Checkout.Session;

        // TODO: handle this properly
        // onPaymentFailed(session);

        break;
      }
    }

    // Return a response to acknowledge receipt of the event.
    res.status(200).json({ success: true, message: "Payload decoded successfully", payload: event })

  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }

}

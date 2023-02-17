import { NextApiRequest, NextApiResponse } from 'next';
import { isProductionMode } from "../../base/helpers";
import {
  NotFound,
  respondWithException,
  parseFromEventCatchRequest,
} from './helpers';
import Stripe from "stripe";

type EventModule = { process: (event: Stripe.Event) => void }

const modules: { [key: string]: () => Promise<any> } = {
  'checkout.session': () => import('./checkout.session'),
  'customer.subscription': () => import('./customer.subscription'),
}

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result;

  try {
    if (req.method === 'POST') {
      const event = await parseFromEventCatchRequest(req);

      if ((event.livemode && isProductionMode) || (!event.livemode && !isProductionMode)) {
        const stripeRecord: any = event.data.object;
        const moduleName = event.type.replace(/\.[^.]+$/, '');

        console.info(`CATCH EVENT ( ${event.type}, ${stripeRecord.id} )`);

        // Dynamic and asynchronous import of the module corresponding to the event type.
        modules[moduleName]().then((module: EventModule) => module.process(event));
      }

      result = { success: true };
    } else {
      throw new NotFound;
    }

    res.status(200).json(result);
  } catch (ex: any) {
    console.log(333);
    respondWithException(res, ex);
  }
}

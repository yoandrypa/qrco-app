import { request as baseRequest } from "@ebanux/ebanux-utils/request";
import { parseErrorMessage } from "../../libs/exceptions";
import { startWaiting, releaseWaiting } from "../../components/Waiting";
import { setError } from "../../components/Notification";

import session from "@ebanux/ebanux-utils/sessionStorage";
import Subscription from "../../models/subscription";

export function request({ inBackground, throwError, ...options }: any) {
  if (inBackground !== true) startWaiting();

  return baseRequest(options)
    .then((response: any) => response.result === undefined ? response : response.result)
    .catch((err: any) => {
      const msg = parseErrorMessage(err);

      console.error(err);

      if (throwError === 'notify') setError(msg);
      if (throwError !== false) throw new Error(msg);
    })
    .finally(() => {
      if (inBackground !== true) releaseWaiting();
    });
}

export async function loadSubscription(): Promise<any> {
  const { currentUser } = session;

  let subscription: any = null;

  startWaiting();
  try {
    subscription = await Subscription.getActiveByUser(currentUser.cognito_user_id);
  } catch (err: any) {
    setError(err.message);
  } finally {
    releaseWaiting();
  }

  return subscription;
}
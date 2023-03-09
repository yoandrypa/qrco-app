import { request as baseRequest } from "@ebanux/ebanux-utils/request";
import { parseErrorMessage } from "../../libs/exceptions";
import { startWaiting, releaseWaiting } from "../../components/Waiting";
import { setError } from "../../components/Notification";

export function request({ inBackground, throwError, ...options }: any) {
  if (inBackground !== true) startWaiting();

  return baseRequest(options)
    .then((response: any) => response.result === undefined ? response : response.result)
    .catch((err: any) => {
      const msg = parseErrorMessage(err);

      console.error(err);

      if (throwError === 'notify') {
        setError(msg);
      } else if (throwError !== false) {
        throw new Error(msg);
      }
    })
    .finally(() => {
      if (inBackground !== true) releaseWaiting();
    });
}

export async function loadSubscription(): Promise<any> {
  const subscription = await request({
    url: 'subscriptions',
    method: "GET",
    throwError: 'notify',
  });

  return subscription;
}
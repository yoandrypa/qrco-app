import { request as baseRequest } from "@ebanux/ebanux-utils/request";
import { parseErrorMessage } from "../../libs/exceptions";
import { startWaiting, releaseWaiting } from "../../components/Waiting";

export function request({ inBackground, ...options }: any) {
  if (inBackground !== true) startWaiting();

  return baseRequest(options)
    .then((response: any) => response.result === undefined ? response : response.result)
    .catch(
      (err: any) => {
        console.error(err);
        throw new Error(parseErrorMessage(err));
      })
    .finally(() => {
      if (inBackground !== true) releaseWaiting();
    });
}

export async function loadSubscription(): Promise<any> {
  const subscription = await request({
    url: 'subscriptions',
    method: "GET",
  });

  return subscription;
}
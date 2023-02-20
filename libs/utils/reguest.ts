import { request as baseRequest } from "@ebanux/ebanux-utils/request";
import { startWaiting, releaseWaiting } from "../../components/Waiting";
import { parseErrorMessage } from "../../libs/exceptions";

export function request({ inBackground, errorHandler, ...options }: any) {
  if (inBackground !== true) startWaiting();

  return baseRequest(options)
    .then((response: any) => response.result || response)
    .catch((err: any) => {
      if (!errorHandler) throw err;
      errorHandler(parseErrorMessage(err));
    })
    .finally(() => {
      if (inBackground !== true) releaseWaiting();
    });
}
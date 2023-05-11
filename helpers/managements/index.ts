import { payLynkRequest } from "../../libs/utils/request";

export { useDidUpdated } from '../commons';

function onRequest(data: any, appWindow: Window) {
  const { options, requestId } = data;
  payLynkRequest({ ...options, inBackground: true }).then((response: any) => {
    appWindow.postMessage({ cmd: 'response', response, requestId }, '*');
  }).catch((error: any) => {
    appWindow.postMessage({ cmd: 'error', error, requestId }, '*');
  });
}

export function onMessage(event: any) {
  const { origin, source: { window: appWindow }, data } = event;
  const { cmd } = data;

  if (origin !== process.env.PAYLINK_APP_URL) return false;
  if (cmd === 'doRequest') return onRequest(data, appWindow);
}

export function startUpEventListener() {
  // Anything in here is fired on component mount.
  window.addEventListener("message", onMessage);
  return () => {
    // Anything in here is fired on component unmount.
    window.removeEventListener("message", onMessage);
  }
}

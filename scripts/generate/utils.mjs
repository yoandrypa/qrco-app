import { customAlphabet } from "nanoid";
import { findLink } from "./handlers.mjs";

export function getUuid () {
  let dt = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export const generateCode = async (code = null) => {
  try {
    const nanoid = customAlphabet(
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      parseInt(`${process.env.REACT_APP_LINK_LENGTH}`));

    const address = code || nanoid();
    const link = await findLink({
      address: { eq: address },
      domainId: { eq: "" },
    });
    if (link.count === 0) return address;
    return generateCode();
  } catch (e) {
    throw e;
  }
};
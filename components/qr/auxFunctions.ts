// TODO: Use setError from Notification component.
import {
  BackgroundType,
  CornersAndDotsType,
  DataType,
  EbanuxDonationPriceData,
  EditType,
  FramesType,
  OptionsType
} from "./types/types";
import { areEquals } from "../helpers/generalFunctions";
import { initialBackground, initialFrame } from "../../helpers/qr/data";
import { upload, remove } from "../../handlers/storage";
import { updateEbanuxDonationPrice, createEbanuxDonationPrice } from "../../handlers/ebanux";
import { getUuid } from "../../helpers/qr/helpers";
import { generateId, generateShortLink } from "../../utils";
import { create, edit as qrEdit } from "../../handlers/qrs";
import { startWaiting, releaseWaiting } from "../Waiting";
import { QR_CONTENT_ROUTE, QR_TYPE_ROUTE } from "./constants";
import { capitalize } from "@mui/material";

import session from "@ebanux/ebanux-utils/sessionStorage";

interface UserInfoProps {
  attributes: { sub: string, email: string },
  cognito_user_id: string,
  signInUserSession: {
    accessToken: {
      jwtToken: string
    },
    idToken: {
      jwtToken: string
    }
  }
}

export interface StepsProps {
  step: number;
  setStep: Function;
  setData: Function;
  clearData: Function;
  selected: string;
  data: DataType;
  userInfo: UserInfoProps;
  subscription: any;
  options: OptionsType;
  frame: FramesType;
  background: BackgroundType;
  cornersData: CornersAndDotsType;
  dotsData: CornersAndDotsType;
  setOptions: (opt: OptionsType) => void;
  isWrong: boolean;
  loading: boolean;
  setRedirecting: (isRedirecting: boolean) => void;
}

export interface GeneratorProps {
  options: OptionsType;
  setOptions: Function;
  background: BackgroundType;
  setBackground: Function;
  setIsWrong: (isWrong: boolean) => void;
  frame: FramesType;
  setFrame: Function;
  selected: string;
  userInfo: object;
  cornersData?: CornersAndDotsType | null;
  dotsData?: CornersAndDotsType | null;
}

export interface QrGeneratorProps {
  options: OptionsType;
  background?: BackgroundType | null;
  hidden?: boolean | false;
  overrideValue?: string | undefined;
  command?: () => void;
  frame?: FramesType | null;
  cornersData?: CornersAndDotsType | null;
  dotsData?: CornersAndDotsType | null;
}

export interface GenProps {
  forceOverride?: string | undefined;
}

export const steps = ["Type", "Content", "QR Design"];

const cleaner = (qrDesign: OptionsType, background: BackgroundType, frame: FramesType,
                 cornersData: CornersAndDotsType, dotsData: CornersAndDotsType, edit: boolean): void => {
  if (!areEquals(frame, initialFrame)) {
    qrDesign.frame = frame;
  }

  if (!areEquals(background, initialBackground)) {
    qrDesign.background = background;
    if (qrDesign.background.file === null) { qrDesign.background.file = ''; }
    if (qrDesign.background.backColor === null) { qrDesign.background.backColor = '#fff'; }
  } else if (edit) { // @ts-ignore
    qrDesign.background = initialBackground;
  }
  if (cornersData !== null) {
    qrDesign.corners = cornersData;
  }
  if (dotsData !== null) {
    qrDesign.cornersDot = dotsData;
  }
  if (!qrDesign.cornersDotOptions.type) {
    qrDesign.cornersDotOptions.type = "";
  }
  if (!qrDesign.cornersSquareOptions.type) {
    qrDesign.cornersSquareOptions.type = "";
  }
  if (qrDesign.mode !== undefined) {
    delete qrDesign.mode;
  }
};

const generateObjectToEdit = (qrData: DataType, data: DataType, qrDesign: OptionsType): EditType => {
  const objToEdit = {
    ...qrData,
    userId: qrDesign.userId,
    //id: qrDesign.id,
    qrType: qrData.qrType,
    qrName: qrData.qrName
  } as EditType;

  if (objToEdit.updatedAt) { delete objToEdit.updatedAt; }
  if (data.isDynamic) { objToEdit.isDynamic = true; }
  if (objToEdit.mode) { delete objToEdit.mode; }

  objToEdit.qrOptionsId = qrDesign;

  if (objToEdit.qrOptionsId?.background?.backColor === null) {
    objToEdit.qrOptionsId.background.backColor = '';
  }
  if (objToEdit.qrOptionsId?.background?.file === null) {
    objToEdit.qrOptionsId.background.file = '';
  }
  if (objToEdit.qrOptionsId?.image === null) {
    objToEdit.qrOptionsId.image = '';
  }
  if (objToEdit.background !== undefined && objToEdit.qrOptionsId?.background !== undefined &&
    objToEdit.background.type === 'image' && objToEdit.qrOptionsId.background === 'solid') {
    objToEdit.background = initialBackground;
  }

  return objToEdit;
};

/**
 * @param dataSource is data
 * @param userInfo
 * @param options
 * @param frame
 * @param background
 * @param cornersData
 * @param dotsData
 * @param selected
 * @param setIsError
 * @param success
 * @param router
 * @param lastStep
 * @param dataInfo would be dataInfo.current.length at QrWizard component
 * @param updatingHandler
 */
export const saveOrUpdate = async (dataSource: DataType, userInfo: UserInfoProps, options: OptionsType, frame: FramesType,
                                   background: BackgroundType, cornersData: CornersAndDotsType, dotsData: CornersAndDotsType, selected: string,
                                   setIsError: (isError: boolean) => void,
                                   success: (creationData?: string) => void, router?: any, lastStep?: (go: boolean) => void, dataInfo?: number,
                                   updatingHandler?: (value: string | null, status?: boolean) => void) => {

  const prevUpdatingHandler = (value: string | null, status?: boolean) => {
    if (updatingHandler) {
      updatingHandler(value, status);
    }
  }

  const data = structuredClone(dataSource);
  if (data.custom?.length) {
    for (let idx = 0, len = data.custom?.length || 0; idx < len; idx += 1) {
      const x = data.custom[idx]; // @ts-ignore
      if (x.expand !== undefined) { delete x.expand; }
      if (["pdf", "audio", "gallery", "video"].includes(x.component) && x.data?.files?.length) {
        prevUpdatingHandler(`Uploading assets for ${capitalize(x.component)} section`);
        try {
          // upload will handle only File instances, others are ignored
          x.data.files = await upload(x.data.files, `${userInfo.cognito_user_id}/${selected}s`);
          prevUpdatingHandler(null, true);
        } catch {
          prevUpdatingHandler(null, false);
          setIsError(true);
        }
      }
    }
  }

  if (data.claim) {
    delete data.claim;
  }

  const dataLength = updatingHandler !== undefined && dataInfo !== undefined && dataInfo > 0;

  if (data.backgndImg !== undefined) {
    if (!Array.isArray(data.backgndImg)) {
      prevUpdatingHandler("Uploading banner image");
      try { // @ts-ignore
        data.backgndImg = await upload([data.backgndImg], `${userInfo.cognito_user_id}/${selected}s/design`);
        prevUpdatingHandler(null, true);
      } catch {
        prevUpdatingHandler(null, false);
        setIsError(true);
      }
    } else {
      delete data.backgndImg;
    }
  }
  if (data.prevBackImg !== undefined) {
    prevUpdatingHandler("Removing previous banner image");
    try {
      await remove([{ Key: data.prevBackImg }]);
      delete data.prevBackImg;
      prevUpdatingHandler(null, true);
    } catch {
      prevUpdatingHandler(null, false);
      setIsError(true);
    }
  }

  if (data.foregndImg !== undefined) {
    if (!Array.isArray(data.foregndImg)) {
      prevUpdatingHandler("Uploading profile image");
      try { // @ts-ignore
        data.foregndImg = await upload([data.foregndImg], `${userInfo.cognito_user_id}/${selected}s/design`);
        prevUpdatingHandler(null, true);
      } catch {
        prevUpdatingHandler(null, false);
        setIsError(true);
      }
    } else {
      delete data.foregndImg;
    }
  }
  if (data.prevForeImg !== undefined) {
    prevUpdatingHandler("Deleting previous profile image");
    try {
      await remove([{ Key: data.prevForeImg }]);
      delete data.prevForeImg;
      prevUpdatingHandler(null, true);
    } catch {
      prevUpdatingHandler(null, false);
      setIsError(true);
    }
  }

  if (data.micrositeBackImage !== undefined) {
    if (!Array.isArray(data.micrositeBackImage)) {
      prevUpdatingHandler("Uploading background image");
      try { // @ts-ignore
        data.micrositeBackImage = await upload([data.micrositeBackImage], `${userInfo.cognito_user_id}/${selected}s/design`);
        prevUpdatingHandler(null, true);
      } catch {
        prevUpdatingHandler(null, false);
        setIsError(true);
      }
    } else {
      delete data.backgndImg;
    }
  }
  if (data.prevMicrositeImg !== undefined) {
    prevUpdatingHandler("Removing previous background image");
    try {
      await remove([{ Key: data.prevMicrositeImg }]);
      delete data.prevMicrositeImg;
      prevUpdatingHandler(null, true);
    } catch {
      prevUpdatingHandler(null, false);
      setIsError(true);
    }
  }

  if (selected === "donation") {
    data["email"] = session.currentUser.account.email;
    let priceData: EbanuxDonationPriceData;
    priceData = {
      name: `Donate ${data["title"]}` || "Donation",
      unitAmountUSD: data["donationUnitAmount"] || 1,
      redirectUrl: data["web"] || ""
    };
    if (data["donationPriceId"]) {
      try {
        prevUpdatingHandler("Updating donation microsite");
        const updatedPrice = await updateEbanuxDonationPrice(
          userInfo.cognito_user_id,
          data["donationPriceId"],
          priceData);
        console.log("updated price", updatedPrice)
        prevUpdatingHandler(null, true);
      } catch (error) {
        setIsError(true);
        prevUpdatingHandler(null, false);
      }

    } else {
      try {
        prevUpdatingHandler("Creating Donation microsite");
        const price = await createEbanuxDonationPrice(userInfo.cognito_user_id, priceData);
        console.log("the price is")
        //@ts-ignore
        data["donationPriceId"] = price.result.price.id;
        //@ts-ignore
        data["donationProductId"] = price.result.product.id;
        prevUpdatingHandler(null, true)
      } catch (error) {
        setIsError(true);
        console.log(error)
        prevUpdatingHandler(null, false)
      }
    }
  }

  let shortLink;
  const qrData = { ...data, qrType: selected };
  const qrDesign = { ...options };

  if (data.mode !== 'edit') {
    const qrDesignId = getUuid();
    const qrId = options.id || getUuid(); // @ts-ignore
    qrData.qrOptionsId = qrDesignId;
    qrData.userId = userInfo.cognito_user_id;

    if (data.isDynamic) { // @ts-ignore
      qrData.shortLinkId = { userId: userInfo.cognito_user_id, createdAt: Date.now() };
      shortLink = {
        target: generateShortLink(`qr/${qrId}`),
        address: options.shortCode || await generateId(), // @ts-ignore
        claimable: data.claimable, // @ts-ignore
        preGenerated: data.preGenerated, // @ts-ignore
        ...qrData.shortLinkId
      };

      // TODO: Review apply usage after create QR
      // This will execute when a new Dynamic QR is created
      // if (userInfo) {
      //   const user = await getUser(userInfo.cognito_user_id);
      //   if (user.subscriptionData?.status == 'active') {
      //     try {
      //       const currentUsage = !user.planUsage ? 0 : user.planUsage;
      //       console.log('add 1 to current usage ', currentUsage);
      //       const result = await recordPlanUsage(1, user.subscriptionData.id, userInfo.cognito_user_id);
      //     } catch (error) {
      //       console.error('unable to report usage', error)
      //     }
      //   }
      // }
    }
    qrDesign.id = qrDesignId;
  }

  cleaner(qrDesign, background, frame, cornersData, dotsData, data.mode === 'edit');

  try {
    let edition = false;
    if (data.mode !== 'edit') {
      if (dataLength) {
        prevUpdatingHandler("Saving QR Code data");
      }
      const response = await create({ shortLink, qrDesign, qrData });
      if (success && response?.creationDate) { success(response.creationDate); }
    } else {
      edition = true;
      if (dataLength) {
        prevUpdatingHandler("Updating QR Code data");
      }

      const objToEdit = generateObjectToEdit(qrData, data, qrDesign);

      if (!objToEdit.userId) {
        objToEdit.userId = userInfo.cognito_user_id;
      }

      await qrEdit(objToEdit);
      if (success) success();
    }
    if (dataLength) {
      prevUpdatingHandler(null, true);
    } else if (lastStep !== undefined && router !== undefined) {
      if (!edition) {
        lastStep(true);
      } else {
        startWaiting();
        router.replace("/").finally(releaseWaiting);
      }
    }
  } catch {
    if (dataLength) prevUpdatingHandler(null, false);
    setIsError(true);
  }
  if (dataLength) prevUpdatingHandler("done");
}

export const readableFileSize = (size: number): string => {
  const e = (Math.log(size) / Math.log(1e3)) | 0;
  return `${+(size / Math.pow(1e3, e)).toFixed(2)} ${('kMGTPEZY'[e - 1] || '')}B`;
}

export const getStep = (route: string): number => [QR_TYPE_ROUTE, '/'].includes(route) ? 0 : route === QR_CONTENT_ROUTE ? 1 : 2;

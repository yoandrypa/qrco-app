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
import * as StorageHandler from "../../handlers/storage";
import * as EbanuxHandler from "../../handlers/ebanux";
import { getUuid } from "../../helpers/qr/helpers";
import { generateId, generateShortLink } from "../../utils";
import * as QrHandler from "../../handlers/qrs";
import { QR_CONTENT_ROUTE, QR_TYPE_ROUTE } from "./constants";

//@ts-ignore
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

interface currentAccount {
  account: {
    id: string;
    email: string;
  }

}

export interface StepsProps {
  step: number;
  setStep: Function;
  clearData: Function;
  selected: string;
  data: DataType;
  userInfo: UserInfoProps;
  options: OptionsType;
  frame: FramesType;
  background: BackgroundType;
  cornersData: CornersAndDotsType;
  dotsData: CornersAndDotsType;
  setOptions: (opt: OptionsType) => void;
  isWrong: boolean;
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
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
 * dataInfo would be dataInfo.current.length at QrWizard component
 * @param data
 * @param userInfo
 * @param options
 * @param frame
 * @param background
 * @param cornersData
 * @param dotsData
 * @param selected
 * @param setLoading
 * @param setIsError
 * @param success
 * @param router
 * @param lastStep
 * @param dataInfo
 * @param updatingHandler
 */
export const saveOrUpdate = async (data: DataType, userInfo: UserInfoProps, options: OptionsType, frame: FramesType,
  background: BackgroundType, cornersData: CornersAndDotsType,
  dotsData: CornersAndDotsType, selected: string,
  setLoading: (loading: boolean) => void, setIsError: (isError: boolean) => void,
  success?: (creationData?: string) => void, router?: any,
  lastStep?: (go: boolean) => void, dataInfo?: number,
  updatingHandler?: (value: string | null, status?: boolean) => void) => {
  const prevUpdatingHandler = (value: string | null, status?: boolean) => {
    if (updatingHandler) {
      updatingHandler(value, status);
    }
  }

  const dataLength = updatingHandler !== undefined && dataInfo !== undefined && dataInfo > 0;

  if (updatingHandler && ["pdf", "audio", "gallery", "video"].includes(selected)) { //Process assets before saving de QR Data
    updatingHandler("Uploading assets");
    try { // @ts-ignore
      data["files"] = await StorageHandler.upload(data["files"], `${userInfo.cognito_user_id}/${selected}s`);
      updatingHandler(null, true);
    } catch {
      updatingHandler(null, false);
    }
  }
  
  if( updatingHandler && selected === "linkedLabel" && data.fields) {
    updatingHandler("Uploading assets");
      for ( let index = 0 ; index < data.fields?.length ; index++){
        try{
        if(data.fields[index].type === "media"){
          data.fields[index].files = await StorageHandler.upload(data.fields[index].files, `${userInfo.cognito_user_id}/${selected}s`);
          updatingHandler(null, true);
        }
      } catch{
        updatingHandler(null, false);
      }
    }
  }

  if (data.backgndImg !== undefined) {
    if (!Array.isArray(data.backgndImg)) {
      prevUpdatingHandler("Uploading background image");
      try { // @ts-ignore
        data.backgndImg = await StorageHandler.upload([data.backgndImg], `${userInfo.cognito_user_id}/${selected}s/design`);
        prevUpdatingHandler(null, true);
      } catch {
        prevUpdatingHandler(null, false);
      }
    } else {
      delete data.backgndImg;
    }
  }
  if (data.prevBackImg !== undefined) {
    prevUpdatingHandler("Removing previous background image");
    try {
      await StorageHandler.remove([{ Key: data.prevBackImg }]);
      delete data.prevBackImg;
      prevUpdatingHandler(null, true);
    } catch {
      prevUpdatingHandler(null, false);
    }
  }

  if (data.foregndImg !== undefined) {
    if (!Array.isArray(data.foregndImg)) {
      prevUpdatingHandler("Uploading main image");
      try { // @ts-ignore
        data.foregndImg = await StorageHandler.upload([data.foregndImg], `${userInfo.cognito_user_id}/${selected}s/design`);
        prevUpdatingHandler(null, true);
      } catch {
        prevUpdatingHandler(null, false);
      }
    } else {
      delete data.foregndImg;
    }
  }
  if (data.prevForeImg !== undefined) {
    prevUpdatingHandler("Deleting previous main image");
    try {
      await StorageHandler.remove([{ Key: data.prevForeImg }]);
      delete data.prevForeImg;
      prevUpdatingHandler(null, true);
    } catch {
      prevUpdatingHandler(null, false);
    }
  }

  if (selected === "donation") {
    data["email"] = session.currentAccount.account.email;
    let priceData: EbanuxDonationPriceData;
    priceData = {
      name: `Donate ${data["title"]}` || "Donation",
      unitAmountUSD: data["donationUnitAmount"] || 1,
      redirectUrl: data["web"] || ""
    };
    if (data["donationPriceId"]) {
      try {
        prevUpdatingHandler("Updating donation microsite");
        const updatedPrice = await EbanuxHandler.updateEbanuxDonationPrice(
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
        const price = await EbanuxHandler.createEbanuxDonationPrice(userInfo.cognito_user_id,
          priceData);
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

  if (data.mode === undefined) {
    const qrDesignId = getUuid();
    const qrId = options.id || getUuid(); // @ts-ignore
    qrData.qrOptionsId = qrDesignId;
    qrData.userId = userInfo.cognito_user_id;

    if (data.isDynamic) { // @ts-ignore
      qrData.shortLinkId = { userId: userInfo.cognito_user_id, createdAt: Date.now() };
      shortLink = {
        target: generateShortLink(`qr/${qrId}`),
        address: options.shortCode || await generateId(), // @ts-ignore
        ...qrData.shortLinkId
      };
    }
    qrDesign.id = qrDesignId;
  }

  cleaner(qrDesign, background, frame, cornersData, dotsData, data.mode === 'edit');

  try {
    let edition = false;
    if (data.mode === undefined) {
      if (dataLength) {
        prevUpdatingHandler("Saving QR Code data");
      }
      const response = await QrHandler.create({ shortLink, qrDesign, qrData });
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

      await QrHandler.edit(objToEdit);
      if (success) { success(); }
    }
    if (dataLength) {
      prevUpdatingHandler(null, true);
    } else if (lastStep !== undefined && router !== undefined) {
      if (!edition) {
        lastStep(true);
      } else {
        router.replace("/").then(() => setLoading(false));
      }
    }
  } catch {
    if (dataLength) {
      prevUpdatingHandler(null, false);
    }
    setIsError(true);
    setLoading(false);
  }
  if (dataLength) {
    prevUpdatingHandler("done");
  }
}

export const readableFileSize = (size: number): string => {
  const e = (Math.log(size) / Math.log(1e3)) | 0;
  return `${+(size / Math.pow(1e3, e)).toFixed(2)} ${('kMGTPEZY'[e - 1] || '')}B`;
}

export const getStep = (route: string): number => [QR_TYPE_ROUTE, '/'].includes(route) ? 0 : route === QR_CONTENT_ROUTE ? 1 : 2;

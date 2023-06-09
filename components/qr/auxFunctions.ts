import { BackgroundType, CornersAndDotsType, CustomType, DataType, EditType, FramesType, LinkType, OptionsType } from "./types/types";
import { areEquals } from "../helpers/generalFunctions";
import { initialBackground, initialFrame } from "../../helpers/qr/data";
import { upload, remove, download, get } from "../../handlers/storage";
import { convertBlobUrlToFile, getUuid } from "../../helpers/qr/helpers";
import { generateId, generateShortLink } from "../../utils";
import { create, edit as qrEdit } from "../../handlers/qrs";
import { startWaiting, releaseWaiting } from "../Waiting";
import { QR_CONTENT_ROUTE, QR_TYPE_ROUTE } from "./constants";
import { capitalize } from "@mui/material";

// @ts-ignore
import { renderToString } from "react-dom/server";
import { getOptionsForPreview } from "../../helpers/qr/auxFunctions";
import { generateSVGObj, handleQrData } from "./QrGenerator";
import { getQrType, getQrSectionType } from "./qrtypes";
import { setError } from "../Notification";

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
  if (frame.textUp === false) { delete frame.textUp; }
  if (!areEquals(frame, initialFrame)) { qrDesign.frame = frame; }
  if (!areEquals(background, initialBackground)) {
    qrDesign.background = background;
    if (qrDesign.background.file === null) qrDesign.background.file = '';
    if (qrDesign.background.backColor === null) qrDesign.background.backColor = '#fff';
  } else if (edit) { // @ts-ignore
    qrDesign.background = initialBackground;
  }
  if (cornersData !== null) { qrDesign.corners = cornersData; }
  if (dotsData !== null) { qrDesign.cornersDot = dotsData; }
  if (!qrDesign.cornersDotOptions.type) { qrDesign.cornersDotOptions.type = ""; }
  if (!qrDesign.cornersSquareOptions.type) { qrDesign.cornersSquareOptions.type = ""; }
  if (qrDesign.mode !== undefined) { qrDesign.mode = undefined; }
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

export const getFileFromQr = (data: DataType, options: OptionsType, background: BackgroundType, frame: FramesType,
                              cornersData: CornersAndDotsType, dotsData: CornersAndDotsType, selected: string, onlySvg?: boolean, name?: string) => {
  const qrDesign = getOptionsForPreview(data, options, background, frame, cornersData, dotsData, selected);
  const svgObject = generateSVGObj(handleQrData(qrDesign), frame, background, cornersData, dotsData, undefined, undefined, undefined, options?.image);
  const svgString = renderToString(svgObject);

  if (onlySvg) {
    return svgString;
  }

  return new File([svgString], name !== undefined ? name : `${getUuid()}QR.svg`, {type: 'image/svg+xml'});
}

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
                                   background: BackgroundType, cornersData: CornersAndDotsType, dotsData: CornersAndDotsType,
                                   selected: string, setIsError: (isError: boolean) => void,
                                   success: (creationData?: string, qrForSharing?: any) => void,
                                   router?: any, lastStep?: (go: boolean) => void, dataInfo?: number,
                                   updatingHandler?: (value: string | null, status?: boolean) => void) => {

  const prevUpdatingHandler = (value: string | null, status?: boolean) => {
    if (updatingHandler) { updatingHandler(value, status); }
  }

  const data = structuredClone(dataSource) as any;

  // cleaning layout data, does not affect the original object
  if (data.layout?.startsWith('empty')) {
    if (data.backgndImg) { data.backgndImg = undefined; }
    if (data.foregndImg) { data.foregndImg = undefined; }
    if (data.foregndImgType !== undefined) { data.foregndImgType = undefined; }
    if (data.profileImageSize) { data.profileImageSize = undefined; }
    if (data.profileImageVertical) { data.profileImageVertical = undefined; }
  } else if (data.layout?.includes('banner') && data.backgndImg) {
    data.backgndImg = undefined;
  }

  // cleaning, same as above
  if (data.claim) { delete data.claim; }
  if (data.forceChange) { delete data.forceChange; }

  // @ts-ignore
  const userId = data.mode !== 'secret' ? userInfo.cognito_user_id : options?.userId?.id;

  if (!data.hideQrForSharing && data.isDynamic) {
    prevUpdatingHandler(`${data.mode === 'clone' || data.qrForSharing?.[0]?.Key === undefined ? 'Saving' : 'Adjusting'} QR code`);

    const file = getFileFromQr(data, options, background, frame, cornersData, dotsData, selected, false, data.mode !== 'clone' ? data.qrForSharing?.[0]?.name : undefined);

    try { // @ts-ignore
      data.qrForSharing = await upload([file], `${userId}/${selected}s/design`);
      if (!updatingHandler && dataSource.qrForSharing?.name !== data.qrForSharing.name) {
        dataSource.qrForSharing = structuredClone(data.qrForSharing);
      }
      prevUpdatingHandler(null, true);
    } catch {
      prevUpdatingHandler(null, false);
      setIsError(true);
    }
  }

  if ((data.hideQrForSharing || data.sharerPosition === 'no') && (data.qrForSharing || data.qrForSharing?.[0]?.Key)) {
    prevUpdatingHandler('Removing QR Code');
    try {
      await remove([{ Key: data.qrForSharing.Key }]);
      data.qrForSharing = undefined;
      prevUpdatingHandler(null, true);
    } catch {
      prevUpdatingHandler(null, false);
      setIsError(true);
    }
  }

  const clearExpand = !data.custom?.some((x: CustomType) => x.data?.sectionArrangement === 'tabbed');

  const qrType = getQrType(selected);
  try {
    if (qrType?.beforeSave) await qrType.beforeSave(data);
  } catch (e: any) {
    setError(e);
  }

  if (data.custom?.length) {
    // Set isMonetized in false to recalculate it new value.
    data.isMonetized = false;

    let qrInf = undefined;
    if (data.mode === 'edit') {
      prevUpdatingHandler('Reading data');
      try {
        qrInf = await get(userId, typeof data.createdAt === 'number' ? data.createdAt : data.createdAt.getTime());
        prevUpdatingHandler(null, true);
      } catch (e) {
        prevUpdatingHandler(null, false);
        setIsError(true);
      }
    }

    if (qrInf) {
      const filesToRemove: {Key: string}[] = [];
      prevUpdatingHandler('Processing assets');
      qrInf.custom.forEach((cust: CustomType) => {
        cust.data?.links?.forEach((link: LinkType) => { // @ts-ignore
          if (link?.icon?.[0]?.Key && !data.custom.some((c: CustomType) => c.data?.showIcons && c.data?.links?.some((l: LinkType) => l?.icon?.[0]?.Key === link.icon[0].Key))) { // @ts-ignore
            // @ts-ignore
            filesToRemove.push({Key: link.icon[0].Key});
          }
        })
        cust.data?.files?.forEach(file => { // @ts-ignore
          if (file?.[0]?.Key && !data.custom.some((c: CustomType) => c.data?.files?.some(f => f[0]?.Key === file[0].Key))) {
            // @ts-ignore
            filesToRemove.push({Key: file[0].Key});
          }
        })
      });

      if (filesToRemove.length === 0) {
        prevUpdatingHandler(null, true);
      } else {
        try {
          await remove(filesToRemove);
          prevUpdatingHandler(null, true);
        } catch {
          prevUpdatingHandler(null, false);
        }
      }
    }

    for (let idx = 0, len = data.custom?.length || 0; idx < len; idx += 1) {
      const section = data.custom[idx];

      if (section.data?.iconName !== undefined) { delete section.data.iconName; }
      if (clearExpand && section.expand !== undefined) { delete section.expand; }

      if (!qrType?.beforeSave) {
        const qrSecType = getQrSectionType(section.component);

        if (qrSecType?.beforeSave) {
          try {
            prevUpdatingHandler(`Setting ${section.component} micro-site section`)
            await qrSecType.beforeSave(section, idx);
          } catch (error) {
            setIsError(true);
            prevUpdatingHandler(null, false);
          }
        }
      }

      if (section.data?.links) {
        let someFailed = false;
        if (section.data.links.some((x: LinkType) => x.icon instanceof File)) {
          prevUpdatingHandler(`Uploading images for buttons for ${section.component.toLowerCase()} section ${idx + 1}`);
          for (let i = 0, l = section.data.links.length; i < l; i += 1) {
            const x = section.data.links[i];
            if (x.icon instanceof File) {
              try { // @ts-ignore
                x.icon = await upload([x.icon], `${userId}/${selected}s/design`);
              } catch {
                someFailed = true;
              }
            }
          }
          if (!someFailed) {
            prevUpdatingHandler(null, true);
          } else {
            prevUpdatingHandler(null, false);
            setIsError(true);
          }
        } // @ts-ignore
        if (data.mode === 'clone' && section.data.links.some((x: LinkType) => Array.isArray(x.icon) && x.icon.length > 0 && x.icon[0].Key)) {
          someFailed = false;
          prevUpdatingHandler(`Cloning images for buttons for ${section.component.toLowerCase()} section ${idx + 1}`);
          for (let i = 0, l = section.data.links.length; i < l; i += 1) {
            const x = section.data.links[i];
            if (Array.isArray(x.icon) && x.icon.length > 0 && x.icon[0].Key) {
              try {
                const img = await download(x.icon[0].Key); // @ts-ignore
                const newFile = await convertBlobUrlToFile(img.content, `${getUuid()}.${img.type.split('/')[1]}`);
                x.icon = await upload([newFile], `${userId}/${selected}s/design`);
              } catch {
                someFailed = true;
              }
            }
          }
          if (!someFailed) {
            prevUpdatingHandler(null, true);
          } else {
            prevUpdatingHandler(null, false);
            setIsError(true);
          }
        }
      }

      if (["pdf", "audio", "gallery", "video"].includes(section.component) && section.data?.files?.length) {
        prevUpdatingHandler(`Uploading assets for ${capitalize(section.component)} section`);
        try {
          // upload will handle only File instances, others are ignored
          section.data.files = await upload(section.data.files, `${userId}/${selected}s`);
          prevUpdatingHandler(null, true);
        } catch {
          prevUpdatingHandler(null, false);
          setIsError(true);
        }

        try {
          if (data.mode === 'clone' && section.data.files.some((x: {Key: string;}) => !Array.isArray(x) && x.Key)) {
            prevUpdatingHandler(`Cloning assets for ${section.component.toLowerCase()} section ${idx + 1}`); // @ts-ignore
            for (let i = 0, l = section.data.files.length; i < l; i += 1) {
              const x = section.data.files[i];
              if (!Array.isArray(x) && x.Key) {
                const tempo = await download(x.Key); // @ts-ignore
                const newFile = await convertBlobUrlToFile(tempo.content, `${getUuid()}.${img.type.split('/')[1]}`);
                section.data.files[i] = await upload([newFile], `${userId}/${selected}s`);
              }
            }
            prevUpdatingHandler(null, false);
          }
        } catch {
          prevUpdatingHandler(null, false);
          setIsError(true);
        }
      }

      // Check if the section is monetized
      data.isMonetized ||= section.isMonetized;
    }
  }

  const dataLength = updatingHandler !== undefined && dataInfo !== undefined && dataInfo > 0;

  if (data.backgndImg !== undefined) {
    if (!Array.isArray(data.backgndImg)) {
      prevUpdatingHandler("Uploading banner image");
      try { // @ts-ignore
        data.backgndImg = await upload([data.backgndImg], `${userId}/${selected}s/design`);
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
      data.prevBackImg = undefined;
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
        data.foregndImg = await upload([data.foregndImg], `${userId}/${selected}s/design`);
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
      data.prevForeImg = undefined;
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
        data.micrositeBackImage = await upload([data.micrositeBackImage], `${userId}/${selected}s/design`);
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
      data.prevMicrositeImg = undefined;
      prevUpdatingHandler(null, true);
    } catch {
      prevUpdatingHandler(null, false);
      setIsError(true);
    }
  }

  let shortLink;
  const qrData: any = { ...data, qrType: selected };
  const qrDesign = { ...options };

  if (!['edit', 'secret'].includes(data.mode)) {
    const qrDesignId = getUuid();
    const qrId = options.id || getUuid();
    qrData.qrOptionsId = qrDesignId;

    qrData.userId = userInfo.cognito_user_id;

    if (data.isDynamic) { // @ts-ignore
      qrData.shortLinkId = { userId: userInfo.cognito_user_id, createdAt: Date.now() };
      shortLink = {
        address: options.shortCode || await generateId(),
        target: generateShortLink(`qr/${qrId}`),
        claimable: data.claimable,
        preGenerated: data.preGenerated,
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

    const secretMode = data.mode === 'secret';

    if (!['edit', 'secret'].includes(data.mode)) {
      if (qrData.frame !== undefined && !frame.type) { delete qrData.frame; }
      if (dataLength) { prevUpdatingHandler("Saving QR Code data"); }

      const response = await create({ shortLink, qrDesign, qrData });

      if (success && response) { success(response.creationDate, response.qrForSharing); }
    } else {
      edition = true;

      if (dataLength) { prevUpdatingHandler("Updating QR Code data"); }

      const objToEdit = generateObjectToEdit(qrData, data, qrDesign) as any;

      if (objToEdit.frame !== undefined) {
        if (!frame?.type) {
          objToEdit.frame = undefined;
          objToEdit.qrOptionsId.frame = undefined;
        } else if (!areEquals(objToEdit.frame, frame)) {
          objToEdit.frame = frame;
        }
      }

      if (!objToEdit.userId) { objToEdit.userId = userInfo.cognito_user_id; }
      if (objToEdit.qrOptionsId.editedShortLink) {
        delete objToEdit.qrOptionsId.editedShortLink;
        objToEdit.shortLinkId = { address: objToEdit.qrOptionsId.shortCode };
      }

      if (objToEdit.creation !== undefined) { delete objToEdit.creation; }
      if (objToEdit.visitCount !== undefined) { delete objToEdit.visitCount; }

      if (secretMode) {
        if (typeof objToEdit.userId !== 'string') { objToEdit.userId = objToEdit.userId.id; }
        if (typeof objToEdit.qrOptionsId.userId !== 'string') { objToEdit.qrOptionsId.userId = objToEdit.qrOptionsId.userId.id; }
      } else if (objToEdit.secret === undefined) { objToEdit.secret = undefined; }
      if (objToEdit.secretOps === undefined) { objToEdit.secretOps = undefined; }

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
    if (dataLength) { prevUpdatingHandler(null, false); }
    setIsError(true);
  }
  if (dataLength) prevUpdatingHandler("done");
}

export const readableFileSize = (size: number): string => {
  const e = (Math.log(size) / Math.log(1e3)) | 0;
  return `${+(size / Math.pow(1e3, e)).toFixed(2)} ${('kMGTPEZY'[e - 1] || '')}B`;
}

export const getStep = (route: string): number => [QR_TYPE_ROUTE, '/'].includes(route) ? 0 : route === QR_CONTENT_ROUTE ? 1 : 2;

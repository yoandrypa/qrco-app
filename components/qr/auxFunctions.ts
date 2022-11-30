import { BackgroundType, CornersAndDotsType, DataType, EditType, FramesType, OptionsType } from "./types/types";
import { areEquals } from "../helpers/generalFunctions";
import { initialBackground, initialFrame } from "../../helpers/qr/data";

export interface StepsProps {
  step: number;
  setStep: Function;
  selected: string;
  data: DataType;
  userInfo: {
    attributes: { sub: string },
    signInUserSession: {
      accessToken: {
        jwtToken: string
      },
      idToken: {
        jwtToken: string
      }
    }
  };
  options: OptionsType;
  frame: FramesType;
  background: BackgroundType;
  cornersData: CornersAndDotsType;
  dotsData: CornersAndDotsType;
  setOptions: (opt: OptionsType) => void;
  isWrong: boolean;
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
  isTrialMode?: boolean;
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

export const cleaner = (qrDesign: OptionsType, background: BackgroundType, frame: FramesType,
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

export const finalCleanForEdtion = (objToEdit: EditType) => {
  if (objToEdit.qrOptionsId?.background?.backColor === null) {
    objToEdit.qrOptionsId.background.backColor = '';
  }
  if (objToEdit.qrOptionsId?.background?.file === null) {
    objToEdit.qrOptionsId.background.file = '';
  }
  if (objToEdit.background !== undefined && objToEdit.qrOptionsId?.background !== undefined &&
    objToEdit.background.type === 'image' && objToEdit.qrOptionsId.background === 'solid') {
    objToEdit.background = initialBackground;
  }
}

export const generateObjectToEdit = (qrData: DataType, data: DataType, qrDesign: OptionsType): EditType => {
  const objToEdit = {
    ...qrData,
    userId: qrDesign.userId,
    //id: qrDesign.id,
    qrType: qrData.qrType,
    qrName: qrData.qrName
  } as EditType;

  if (objToEdit.updatedAt) {
    delete objToEdit.updatedAt;
  }
  if (data.isDynamic) {
    objToEdit.isDynamic = true;
  }

  objToEdit.qrOptionsId = qrDesign;

  return objToEdit;
};

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

export const steps = ["Type", "Content", "Design"];

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

export const generateObjectToEdit = (qrData: DataType, data: DataType, qrDesign: OptionsType): EditType => {
  const objToEdit = {
    ...qrData,
    userId: qrDesign.userId,
    id: qrDesign.id,
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

import { ChangeEvent, ReactElement } from "react";

export type TEventPayload = ChangeEvent<HTMLInputElement> | string | number | boolean | string[];
export type THandleValues = (item: string, index?: number) => (payload: TEventPayload) => void;

export interface IIconProps {
  enabled: boolean;
  color?: string;
  sx?: Object;
}

export interface IFormProps<IQrData> {
  index?: number;
  data: IQrData;
  handleValues: THandleValues;
}

type TBeforeSave1<IQrData> = (data: IQrSection<IQrData>, index?: number) => Promise<IQrSection<IQrData>>;
type TBeforeSave2<IQrData> = (data: IQrData, index?: number) => Promise<IQrData>;
type TValitator<IQrData> = (data: IQrData, index?: number) => string[];

export interface IQrSetting<IQrData> {
  id: string;
  name: string;
  description?: string;
  tip?: string;
  isDynamic?: boolean;
  isMonetized?: boolean;
  isOnlyQr?: boolean;
  renderIcon: (props: IIconProps) => ReactElement;
  renderForm: (props: IFormProps<IQrData>) => ReactElement;
  getDefaultQrData: () => IQrData;
  beforeSave?: TBeforeSave1<IQrData> | TBeforeSave2<IQrData>;
  validate?: TValitator<IQrData>;
  devOnly?: boolean;
}

export interface IQrSection<ISectionData> {
  component: string;
  data: ISectionData;
  expand: string;
  isMonetized?: boolean;
}



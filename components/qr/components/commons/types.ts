import { ChangeEvent, ReactNode } from "react";

type TEventPayload = ChangeEvent<HTMLInputElement> | string | number | boolean | string[];

export interface IIconProps {
  enabled: boolean;
  color?: string;
  sx?: Object;
}

export interface IFormProps<IQrData> {
  index?: number;
  data: IQrData;
  handleValues: (item: string, index?: number) => (payload: TEventPayload) => void;
}

export interface IQrSetting<IQrData> {
  id: string;
  name: string;
  description: string;
  tip?: string;
  isDynamic?: boolean;
  isMonetized?: boolean;
  renderIcon: (props: IIconProps) => ReactNode;
  renderForm: (props: IFormProps<IQrData>) => ReactNode;
  getDefaultQrData: () => IQrData;
  devOnly?: boolean;
}

export interface IQrSection<ISectionData> {
  component: string;
  data: ISectionData;
  expand: string;
  isMonetized?: boolean;
}



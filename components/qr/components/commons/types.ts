import { ReactNode } from "react";

export interface IIconProps {
  enabled: boolean;
  color?: string;
  sx?: Object;
}

export interface IFormProps<IData> {
  index: number;
  data: IData;
  handleValues: Function;
}

export interface ISettingQr<IData> {
  id: string;
  name: string;
  description: string;
  isDynamic?: boolean;
  isMonetized?: boolean;
  renderIcon: (props: IIconProps) => ReactNode;
  renderForm: (props: IFormProps<IData>) => ReactNode;
  devOnly?: boolean;
}


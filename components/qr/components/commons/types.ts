import { ReactNode } from "react";

export interface IconPropsType {
  enabled: boolean;
  color?: string;
  sx?: Object;
}

export interface FormPropsType<DataType> {
  index: number;
  data: DataType;
  handleValues: Function;
}

export interface SettingQrType<DataType> {
  id: string;
  name: string;
  description: string;
  isDynamic?: boolean;
  isMonetized?: boolean;
  renderIcon: (props: IconPropsType) => ReactNode;
  renderForm: (props: FormPropsType<DataType>) => ReactNode;
  devOnly?: boolean;
}


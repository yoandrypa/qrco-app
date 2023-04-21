import {
  FormPropsType as BaseFormPropsType,
  SettingQrType as BaseSettingQrType,
} from "../commons/types";

export interface DataType {
  concept: string;
  description: string;
  unitAmount: number;
  email: string;
  ownerId: string;
}

export type { IconPropsType } from '../commons/types';
export type FormPropsType = BaseFormPropsType<DataType>;
export type SettingQrType = BaseSettingQrType<DataType>;

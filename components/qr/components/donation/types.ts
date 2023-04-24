import { IQrSection } from '../commons/types';
import { ISectionData } from '../sections/donation/types';

export type { IIconProps, IFormProps, IQrSetting, IQrSection } from '../commons/types';

export interface IQrData {
  isDynamic: boolean,
  custom: IQrSection<ISectionData>[];
}
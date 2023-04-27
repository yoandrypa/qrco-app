export type { IIconProps, IFormProps, IQrSetting, IQrSection } from '../../commons/types';

export interface ISectionData {
  title: string;
  buttonText: string;
  message: string;
  unitAmount: number;
  email: string;
  ownerId: string;
  iconId: string;
  productId?: string;
  priceId?: string;
  changePrice?: boolean;
  changeProduct?: boolean;
}

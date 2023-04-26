export type { IIconProps, IFormProps, IQrSetting, IQrSection } from '../../commons/types';

export interface ISectionData {
  concept: string;
  description: string;
  unitAmount: number;
  email: string;
  ownerId: string;
  productId?: string;
  priceId?: string;
}

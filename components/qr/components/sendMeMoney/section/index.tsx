import React from "react";
import dynamic from "next/dynamic";

import session from "@ebanux/ebanux-utils/sessionStorage";

const Icon = dynamic(() => import('@mui/icons-material/CreditCard'));
const Form = dynamic(() => import('./form'));

import { isEmpty } from "@ebanux/ebanux-utils";
import { parseIconStyle } from '../../commons/helpers';
import { payLynkRequest } from "../../../../../libs/utils/request";
import { IIconProps, IFormProps, IQrSetting, IQrSection, ISectionData } from './types';

const setting: IQrSetting<ISectionData> = {
  id: 'sendMeMoney',
  name: 'Send Me Money',
  isMonetized: true,
  renderIcon: (props: IIconProps) => <Icon sx={parseIconStyle(props)} />,
  renderForm: (props: IFormProps<ISectionData>) => <Form {...props} />,
  getDefaultQrData: () => ({
    concept: '',
    description: '',
    unitAmount: 5,
    email: session.currentUser?.email as string,
    ownerId: session.currentUser?.cognito_user_id as string,
  }),
  beforeSave: async (section: IQrSection<ISectionData>) => {
    const { data } = section;
    const { concept, description, unitAmount } = data;

    if (isEmpty(concept)) throw new Error("The 'concept' field is required");

    if (!data.productId || data.changeProduct) {
      const productPath = data.productId ? `products/${data.productId}` : 'products';
      const { id: productId } = await payLynkRequest({
        url: productPath, method: 'POST',
        data: { name: concept, description: !isEmpty(description) ? description : undefined }
      });
      data.productId = productId;
      delete data.changeProduct;
    }

    if (!data.priceId || data.changePrice) {
      const { id: priceId } = await payLynkRequest({
        url: 'prices', method: 'POST',
        data: { unit_amount: unitAmount, nickname: concept, product: data.productId, currency: 'usd' }
      });
      data.priceId = priceId;
      delete data.changePrice;
    }

    return section;
  },
  validate: (data, index = 0) => {
    const errors: string[] = [];
    const { unitAmount, concept } = data;

    if (isEmpty(unitAmount) || !(unitAmount > 0)) errors.push(`Enter a valid 'unit amount' in the section ${index + 1}`);
    if (isEmpty(concept)) errors.push(`Enter a valid 'concept' in the section ${index + 1}`);

    return errors;
  },
};

export default setting;
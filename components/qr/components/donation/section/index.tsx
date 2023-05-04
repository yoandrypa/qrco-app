import React from "react";
import dynamic from "next/dynamic";

import session from "@ebanux/ebanux-utils/sessionStorage";

const Icon = dynamic(() => import('@mui/icons-material/Coffee'));
const Form = dynamic(() => import('./form'));

import { isEmpty } from "@ebanux/ebanux-utils/utils";
import { IIconProps, IFormProps, IQrSetting, IQrSection, ISectionData } from './types';
import { parseIconStyle } from '../../commons/helpers';
import { createAxiosInstance } from "@ebanux/ebanux-utils/request";
import { payLynkRequest } from "../../../../../libs/utils/request";

const setting: IQrSetting<ISectionData> = {
  id: 'donation',
  name: 'Donation',
  isMonetized: true,
  renderIcon: (props: IIconProps) => <Icon sx={parseIconStyle(props)} />,
  renderForm: (props: IFormProps<ISectionData>) => <Form {...props} />,
  getDefaultQrData: () => ({
    title: '',
    buttonText: 'Donate',
    message: '',
    unitAmount: 2,
    email: session.currentUser?.email as string,
    ownerId: session.currentUser?.cognito_user_id as string,
    iconId: 'Coffee1',
  }),
  beforeSave: async (section: IQrSection<ISectionData>) => {
    const axios = createAxiosInstance(`${process.env.PAYLINK_BASE_URL}/api/v2.0`);
    const { data } = section;
    const { title, unitAmount } = data;

    if (!data.productId || data.changeProduct) {
      const productPath = data.productId ? `products/${data.productId}` : 'products';
      const { id: productId } = await payLynkRequest({
        url: productPath, method: 'POST',
        data: { name: title || 'QR-DONATION' }
      });
      data.productId = productId;
      delete data.changeProduct;
    }

    if (!data.priceId || data.changePrice) {
      const nickname = (title || 'QR-DONATION').toUpperCase();
      const { id: priceId } = await payLynkRequest({
        url: 'prices', method: 'POST',
        data: { unit_amount: unitAmount, nickname, product: data.productId, currency: 'usd' }
      });
      data.priceId = priceId;
      delete data.changePrice;
    }

    return section;
  },
  validate: (data, index = 0) => {
    const errors: string[] = [];
    const { unitAmount } = data;

    if (isEmpty(unitAmount) || !(unitAmount > 0)) {
      errors.push(`Enter a valid 'unit amount' in the section ${index + 1}`);
    }

    return errors;
  },
};

export default setting;
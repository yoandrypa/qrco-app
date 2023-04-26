import React from "react";
import dynamic from "next/dynamic";

import session from "@ebanux/ebanux-utils/sessionStorage";

const Icon = dynamic(() => import('@mui/icons-material/Coffee'));
const Form = dynamic(() => import('./form'));

import { IIconProps, IFormProps, IQrSetting, IQrSection, ISectionData } from './types';
import { parseIconStyle } from '../../commons/helpers';
import { createAxiosInstance } from "@ebanux/ebanux-utils/request";

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
    const axios = createAxiosInstance(`${process.env.PAYLINK_BASE_URL}/api/v2.0`);
    const productPath = data.productId ? `products/${data.productId}` : 'products';
    const { concept, description, unitAmount } = data;
    const { data: { result: { id: productId } } } = await axios.put(productPath, { name: concept, description });
    const { data: { result: { id: priceId } } } = await axios.post('prices', {
      unit_amount: unitAmount,
      nickname: concept,
      product: productId,
      currency: 'usd',
    });

    data.productId = productId;
    data.priceId = priceId;

    return section;
  }
};

export default setting;
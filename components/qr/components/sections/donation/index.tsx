import React from "react";
import dynamic from "next/dynamic";

import session from "@ebanux/ebanux-utils/sessionStorage";

const Icon = dynamic(() => import('@mui/icons-material/Coffee'));
const Form = dynamic(() => import('./form'));

import { IIconProps, IFormProps, IQrSetting, ISectionData } from './types';
import { parseIconStyle, uuid } from '../../commons/helpers';
import { createAxiosInstance } from "@ebanux/ebanux-utils/request";

const setting: IQrSetting<ISectionData> = {
  id: 'donation',
  name: 'Donation',
  isMonetized: true,
  isDynamic: true,
  renderIcon: (props: IIconProps) => <Icon sx={parseIconStyle(props)} />,
  renderForm: (props: IFormProps<ISectionData>) => <Form {...props} />,
  getDefaultQrData: () => ({
    title: '',
    buttonText: 'Donation',
    message: '',
    unitAmount: 2,
    email: session.currentUser?.email as string,
    ownerId: session.currentUser?.cognito_user_id as string,
    iconId: 'Coffee1',
  }),
  beforeSave: async (data: ISectionData, index ) => {
    const axios = createAxiosInstance(`${process.env.PAYLINK_BASE_URL}/api/v2.0`);
    const name = `${data.title} (QR-DONATION)`.toUpperCase();
    const { data: { result: { id: priceId } } } = await axios.post('prices', {
      unit_amount: data.unitAmount,
      nickname: name,
      product: { name },
      currency: 'usd',
    });

    data.priceId = priceId;

    return data;
  }
};

export default setting;
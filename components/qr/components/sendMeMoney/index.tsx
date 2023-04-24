import React from "react";
import dynamic from "next/dynamic";

const Icon = dynamic(() => import('@mui/icons-material/CreditCard'));
const Form = dynamic(() => import('./form'));

import { IIconProps, IFormProps, IQrSetting, IData } from './types';
import { parseIconStyle } from '../commons/helpers';
import session from "@ebanux/ebanux-utils/sessionStorage";

const setting: IQrSetting<IData> = {
  id: 'sendMeMoney',
  name: 'Send Me Money',
  description: 'Receive payments worldwide',
  isMonetized: true,
  isDynamic: true,
  renderIcon: (props: IIconProps) => <Icon sx={parseIconStyle(props)} />,
  renderForm: (props: IFormProps<IData>) => <Form {...props} />,
  getDefaultQrData: () => ({
    concept: '',
    description: '',
    unitAmount: 5,
    email: session.currentUser?.email as string,
    ownerId: session.currentUser?.cognito_user_id as string,
  }),
};

export default setting;
import React from "react";
import dynamic from "next/dynamic";

const Icon = dynamic(() => import('@mui/icons-material/CreditCard'));
const Form = dynamic(() => import('./form'));

import { IIconProps, IFormProps, IQrSetting, IData } from './types';
import { parseIconStyle } from '../commons/helpers';

const setting: IQrSetting<IData> = {
  id: 'sendMeMoney',
  name: 'Send Me Money',
  description: 'Receive payments worldwide',
  isMonetized: true,
  isDynamic: true,
  renderIcon: (props: IIconProps) => <Icon sx={parseIconStyle(props)} />,
  renderForm: (props: IFormProps<IData>) => <Form {...props} />,
};

export default setting;
import React from "react";
import dynamic from "next/dynamic";

const Icon = dynamic(() => import('@mui/icons-material/CreditCard'));
const Form = dynamic(() => import('./form'));

import { IconPropsType, FormPropsType, SettingQrType } from './types';
import { parseIconStyle } from '../commons/helpers';

const setting: SettingQrType = {
  id: 'sendMeMoney',
  name: 'Send Me Money',
  description: 'Receive payments worldwide',
  isMonetized: true,
  isDynamic: true,
  renderIcon: (props: IconPropsType) => <Icon sx={parseIconStyle(props)} />,
  renderForm: (props: FormPropsType) => <Form {...props} />,
};

export default setting;
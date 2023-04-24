import React from "react";
import dynamic from "next/dynamic";

import session from "@ebanux/ebanux-utils/sessionStorage";

const Icon = dynamic(() => import('@mui/icons-material/Coffee'));
const Form = dynamic(() => import('./form'));

import { IIconProps, IFormProps, IQrSetting, ISectionData } from './types';
import { parseIconStyle, uuid } from '../../commons/helpers';

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
};

export default setting;
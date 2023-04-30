import React from "react";
import dynamic from "next/dynamic";

import session from "@ebanux/ebanux-utils/sessionStorage";

const Icon = dynamic(() => import('@mui/icons-material/ContactPhone'));
const Form = dynamic(() => import('./form'));

import { isEmpty } from "@ebanux/ebanux-utils/utils";
import { IIconProps, IFormProps, IQrSetting, ISectionData } from './types';
import { parseIconStyle } from '../../commons/helpers';

const setting: IQrSetting<ISectionData> = {
  id: 'contact',
  name: 'Contact form',
  isMonetized: false,
  renderIcon: (props: IIconProps) => <Icon sx={parseIconStyle(props)} />,
  renderForm: (props: IFormProps<ISectionData>) => <Form {...props} />,
  getDefaultQrData: () => ({
    subjectPlaceholder: '',
    messagePlaceholder: '',
    recipientVisible: false,
    recipientEmail: session.currentUser?.email as string,
    ownerId: session.currentUser?.cognito_user_id as string,
    buttonText: '',
  }),
  validate: (data, index = 0) => {
    const errors: string[] = [];
    const emailFormat = /^\w+(\.\w+)*(\+\w+(\.\w+)*)?@\w+(\.\w+)+$/;

    if (isEmpty(data.recipientEmail) || !emailFormat.test(data.recipientEmail)) {
      errors.push(`Enter a valid email address for the receipt in section ${index + 1}`);
    }

    return errors;
  }
};

export default setting;
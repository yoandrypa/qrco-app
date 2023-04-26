import React from "react";
import dynamic from "next/dynamic";

import qrSection from "./section";

const Icon = dynamic(() => import('@mui/icons-material/Coffee'));

import { IIconProps, IFormProps, IQrSetting, IQrData } from './types';
import { parseIconStyle, uuid } from '../commons/helpers';

const componentId = 'donation';

const setting: IQrSetting<IQrData> = {
  id: componentId,
  name: 'Donation',
  description: 'Get donations from your supporters worldwide.',
  tip: 'Generate a custom QR code for your page and give your supporters a quick and touch-free checkout option.',
  renderIcon: (props: IIconProps) => <Icon sx={parseIconStyle(props)} />,
  renderForm: ({ data, ...props }: IFormProps<IQrData>) => {
    return qrSection.renderForm({
      data: data.custom[0].data, index: 0, ...props
    })
  },
  getDefaultQrData: () => ({
    isDynamic: true,
    isMonetized: true,
    custom: [{
      component: componentId,
      isMonetized: true,
      expand: uuid(),
      data: qrSection.getDefaultQrData(),
    }],
  }),
};

export default setting;
import React from "react";
import dynamic from "next/dynamic";

import sDonation from "../sections/donation";

const Icon = dynamic(() => import('@mui/icons-material/Coffee'));

import { IIconProps, IFormProps, IQrSetting, IQrData } from './types';
import { parseIconStyle, uuid } from '../commons/helpers';

const componentId = 'donation';

const setting: IQrSetting<IQrData> = {
  id: componentId,
  name: 'Donation',
  description: 'Get donations from your supporters worldwide.',
  tip: 'Generate a custom QR code for your page and give your supporters a quick and touch-free checkout option.',
  isMonetized: true,
  isDynamic: true,
  renderIcon: (props: IIconProps) => <Icon sx={parseIconStyle(props)} />,
  renderForm: ({ data, ...props }: IFormProps<IQrData>) => {
    return sDonation.renderForm({
      data: data.custom[0].data, index: 0, ...props
    })
  },
  getDefaultQrData: () => ({
    isDynamic: true,
    custom: [{
      component: componentId,
      isMonetized: true,
      expand: uuid(),
      data: sDonation.getDefaultQrData(),
    }],
  }),
};

export default setting;
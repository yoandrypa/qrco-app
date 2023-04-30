import React from "react";

import qrSection from "./section";

import { IFormProps, IQrSetting, IQrData } from './types';
import { uuid } from '../commons/helpers';

const componentId = 'sendMeMoney';

const setting: IQrSetting<IQrData> = {
  id: componentId,
  name: 'Send Me Money',
  description: 'Receive payments worldwide',
  tip: 'Generate a custom QR code for your page and give your supporters a quick and touch-free checkout option.',
  renderIcon: qrSection.renderIcon,
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
  beforeSave: async (data: IQrData) => {
    const section = data.custom[0];
    // @ts-ignore
    if (section && qrSection.beforeSave) await qrSection.beforeSave(section);
    return data;
  }
};

export default setting;
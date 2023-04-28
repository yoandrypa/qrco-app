import React, { ReactElement } from "react";

import RenderIcon from "../../helperComponents/smallpieces/RenderIcon";

import { grey } from "@mui/material/colors";
import { IIconProps, IQrSetting } from "./types";

export function parseIconStyle({ color, enabled, sx }: IIconProps) {
  return { ...sx, color: enabled ? color || 'primary.dark' : grey[600] };
}

export function renderQrIcon(qrType: IQrSetting<any>, iconProps: IIconProps): ReactElement {
  const { id: qrTypeId, renderIcon } = qrType;

  if (renderIcon) return renderIcon(iconProps);

  // Render using legacy qr-icon method
  return <RenderIcon icon={qrTypeId} {...iconProps} />;
}

export function uuid(): string {
  let dt = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

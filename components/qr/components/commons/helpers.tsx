import { grey } from "@mui/material/colors";
import { IconPropsType, SettingQrType } from "./types";
import React, { ReactNode } from "react";
import RenderIcon from "../../helperComponents/smallpieces/RenderIcon";

export function parseIconStyle({ color, enabled, sx }: IconPropsType) {
  return { ...sx, color: enabled ? color || 'primary.dark' : grey[600] };
}

export function renderQrIcon(qrType: SettingQrType<any>, iconProps: IconPropsType): ReactNode {
  const { id: qrTypeId, renderIcon } = qrType;

  if (renderIcon) return renderIcon(iconProps);

  // Render using legacy qr-icon method
  return <RenderIcon icon={qrTypeId} {...iconProps} />;
}
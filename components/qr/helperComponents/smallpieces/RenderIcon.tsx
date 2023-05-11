import {memo} from "react";
import {grey} from "@mui/material/colors";
import {capitalize} from "@mui/material";

import * as Icons from "./Icons/Icons";
import * as systemIcons from "../../../icons/system";

type RenderIconProp = {
  icon: string;
  enabled: boolean;
  color?: string;
  sx?: Object;
};

function RenderIcon({ icon, color, enabled, sx }: RenderIconProp) {
  let iconName = capitalize(icon);
  switch (iconName) {
    case 'Call':
    case 'CompanyPhone': { iconName = 'Phone'; break; }
    case 'CompanyCell':
    case 'Cell': { iconName = 'CellPhone'; break; }
    case 'CompanyFax': { iconName = 'Fax'; break; }
    case 'Contact':
    case 'Vcard': { iconName = 'VCard'; break; }
    case 'Vcard+': { iconName = 'VCardPlus'; break; }
    case 'Email': { iconName = 'AltEmail'; break; }
    case 'EmailIcon': { iconName = 'Email'; break; }
    case 'Gallery': { iconName = 'Image'; break; }
    case 'PetId': { iconName = 'Pets'; break; }
    case 'Fastfood': { iconName = 'FastFood'; break; }
    case 'Fundme': { iconName = 'FundMe'; break; }
    case 'Paylink': { iconName = 'PayLink'; break; }
    case 'LinkedLabel': { iconName = 'QrCode'; break; }
    case 'Tiktok': { iconName = 'TikTok'; break; }
    case 'Whatsapp': { iconName = 'WhatsApp'; break; }
    case 'Linkedin': { iconName = 'LinkedIn'; break; }
    case 'Youtube': { iconName = 'YouTube'; break; }
  }

  // @ts-ignore
  let MUIIcon = Icons[iconName];

  if (!MUIIcon) { // @ts-ignore
    MUIIcon = systemIcons[iconName];
  }

  if (!MUIIcon) {
    return <Icons.Text sx={{ ...sx, color: enabled ? color || 'primary.dark' : grey[600] }} />
  }

  return <MUIIcon sx={{ ...sx, color: enabled ? color || 'primary.dark' : grey[600] }} />;
}

export default memo(RenderIcon, (current, next) => current.enabled === next.enabled);

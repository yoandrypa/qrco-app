import {capitalize} from "@mui/material";

export default function renderText(item?: string, ending: string = ' here') {
  if (!item || item === 'link') {
    return `URL${ending}`;
  }
  if (item === 'sms') {
    return `SMS${ending}`;
  }
  return `${capitalize(item)}${ending}`;
}

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

export const getOptions = (item?: string) => {
  if (item !== undefined) {
    if (item === 'call') { return ['Call now', 'Call me', 'Give me a call', 'Phone call']; }
    if (item === 'whatsapp') { return ['Whatsapp', 'Whatsapp me', 'Hit my whatsapp', 'Whatsapp call', 'Send me a whatsapp call']; }
    if (item === 'email') { return ['Email', 'Email me', 'Write me an email', 'Send me an email']; }
    if (item === 'sms') { return ['SMS', 'Text me', 'Send me an SMS', 'Send me a text']; }
  }
  return ['My website', 'My youtube channel', 'My blog', 'My portfolio', 'My podcast', 'My store'];
}

export interface RenderTextFieldsProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  handleValues: Function;
  isError?: boolean;
  multiline?: boolean;
  value: string;
  customValue?: string;
  item?: string;
  icon?: File | string;
  sx?: any;
  isButtons?: boolean;
  type?: string;
  index?: number;
  includeIcon?: boolean;
  options?: boolean;
}

export interface IconsProps {
 icon: string;
 name?: string;
 alt?: string;
}

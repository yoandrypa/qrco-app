import React, { ReactNode, useState } from "react";

import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import { checkValidity } from "../helpers/validations";
import { parseFormSelectFieldSx } from "../helpers/styles";
import { useTheme } from "@mui/system";

import EbxIcon, { iconIds, iconName } from "../../icons"

interface RenderTextFieldsProps {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onChange?: Function;
  value?: string;
  sx?: any;
  index?: number;
  startAdornment?: ReactNode;
  requiredAdornment?: boolean | string | ReactNode;
}

export default function SelectIconBox(props: RenderTextFieldsProps) {
  const theme = useTheme();
  const {
    value: initValue, onChange, sx, label,
    startAdornment: sAdornment, requiredAdornment: rAdornment,
    ...staticProps
  } = props;
  const { required = !!rAdornment } = staticProps;

  const [value, setValue] = useState<string>(initValue || '');
  const [valid, setValid] = useState<boolean>(checkValidity(initValue, false, 'string'));

  const onBaseChange = (event: SelectChangeEvent<typeof value>) => {
    const newValue = event.target.value;
    const newValid = checkValidity(newValue, required, 'string');

    setValue(newValue);
    setValid(newValid);
    onChange && onChange(newValue, newValid);
  }

  const renderValue = (value: string) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
      <EbxIcon iconId={value} />{iconName(value)}
    </Box>
  );

  const renderItem = (item: string) => (
    <MenuItem value={item} key={item}>
      <div style={{ display: 'flex' }}>
        <ListItemIcon>
          <EbxIcon iconId={item} />
        </ListItemIcon>
        <ListItemText primary={iconName(item)} />
      </div>
    </MenuItem>
  );

  return (
    <FormControl sx={parseFormSelectFieldSx(sx, theme)} fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        {...staticProps}
        required={required}
        value={value}
        error={!valid}
        renderValue={renderValue}
        onChange={onBaseChange}
      >
        {iconIds().map(renderItem)}
      </Select>
    </FormControl>
  );
}

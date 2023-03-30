import {memo, useEffect, useState} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import RenderIcon from "../../helperComponents/smallpieces/RenderIcon";

import dynamic from "next/dynamic";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {checkValidity, FormatType} from "../../../../libs/utils/check_validity";

const MenuItem = dynamic(() => import("@mui/material/MenuItem"));
const Popover = dynamic(() => import("@mui/material/Popover"));
const MenuList = dynamic(() => import("@mui/material/MenuList"));
const IconButton = dynamic(() => import("@mui/material/IconButton"));
const ArrowDropDownIcon = dynamic(() => import("@mui/icons-material/ArrowDropDown"));
const FontDownloadIcon = dynamic(() => import("@mui/icons-material/FontDownload"));

interface RenderTextFieldsProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  handleValues: Function;
  isError?: boolean;
  multiline?: boolean;
  value: string;
  customValue?: string;
  item?: string;
  sx?: any;
  index?: number;
  includeIcon?: boolean;
  options?: boolean;
  rows?: number;
  format?: FormatType;
}

const RenderTextFields = ({rows, format, value, customValue, handleValues, placeholder, label, item, required, isError, multiline, sx, includeIcon, options}: RenderTextFieldsProps) => {
  const [anchor, setAnchor] = useState<Element | undefined>(undefined);
  const [openCustom, setOpenCustom] = useState<boolean>(false);

  useEffect(() => {
    if (!anchor && openCustom) { setOpenCustom(false); }
  }, [anchor]); // eslint-disable-line react-hooks/exhaustive-deps

  const valid = format ? checkValidity(value, !!required, 'string', format) : isError || false;

  return (
    <>
      <TextField
        sx={{...sx}}
        label={label}
        size="small"
        fullWidth
        required={valid}
        error={isError || !valid}
        rows={rows}
        margin="dense"
        multiline={multiline || (rows && rows > 1) || false}
        value={value || ''}
        placeholder={placeholder}
        onChange={item !== undefined ? handleValues(item) : handleValues}
        InputProps={{
          startAdornment: includeIcon && (
            <RenderIcon icon={item || ''} enabled color={'#717171'} sx={{ mr: includeIcon ? '5px' : 'unset' }} />
          ),
          endAdornment: (
            (required && !value.trim().length) || options ? (
              <InputAdornment position="end">
                {required && !value.trim().length && <Typography color="error">{'REQUIRED'}</Typography>}
                {customValue?.length ? <FontDownloadIcon /> : undefined}
                {options && value?.trim()?.length ? (
                  <IconButton size="small" sx={{mr: '-10px'}} onClick={event => setAnchor(event.currentTarget)}>
                    <ArrowDropDownIcon />
                  </IconButton>
                ) : undefined}
              </InputAdornment>
            ) : null
          )
        }}
      />
      {anchor && options && (
        <Popover
          open
          anchorEl={anchor}
          onClose={() => setAnchor(undefined)}
          anchorOrigin={{vertical: 'top', horizontal: 'left'}}
          transformOrigin={{vertical: 'top', horizontal: 'left'}}
        >
          {!openCustom ? (
            <MenuList>
              {Boolean(customValue?.length) && (
                <Typography sx={{width: '100%', textAlign: 'center', color: theme => theme.palette.text.disabled, fontSize: 'smaller'}}>
                  {customValue}
                </Typography>
              )}
              <MenuItem key={'setCustom'} onClick={() => setOpenCustom(true)}>
                <Typography>{'Set custom text'}</Typography>
              </MenuItem>
              <MenuItem key={'clearCustom'} disabled={!customValue?.length} onClick={() => {
                handleValues(`${item}_Custom`)('');
                setAnchor(undefined);
              }}>
                <Typography>{'Clear custom text'}</Typography>
              </MenuItem>
            </MenuList>
          ) : (
            <Box sx={{width: {xs: '350px', sm: '100%'}}}>
              <Box sx={{p: 1, m: 1}}>
                <Typography>{'Enter the custom text for this button'}</Typography>
                <TextField
                  fullWidth
                  label=""
                  autoFocus
                  size="small"
                  placeholder="Custom text"
                  margin="dense"
                  value={customValue || ''}
                  onChange={item !== undefined ? handleValues(`${item}_Custom`) : handleValues}
                />
                <Divider sx={{my: 1}}/>
                <div style={{display: 'flex', justifyContent: 'end'}}>
                  <Button variant="outlined" disabled={!customValue?.length} onClick={() => handleValues(`${item}_Custom`)('')}>Clear</Button>
                  <Button variant="outlined" sx={{ml: '5px'}} onClick={() => setAnchor(undefined)}>Close</Button>
                </div>
              </Box>
            </Box>
          )}
        </Popover>
      )}
    </>
  );
}

const notIf = (current: RenderTextFieldsProps, next: RenderTextFieldsProps) => (
  current.value === next.value && current.isError === next.isError && current.index === next.index &&
  current.options === next.options && current.customValue === next.customValue
);

export default memo(RenderTextFields, notIf);

import {memo, useState} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import RenderIcon from "../../helperComponents/smallpieces/RenderIcon";
import renderText, {RenderTextFieldsProps} from "./textfieldHelpers/textHandler";

import dynamic from "next/dynamic";

const IconButton = dynamic(() => import("@mui/material/IconButton"));
const ArrowDropDownIcon = dynamic(() => import("@mui/icons-material/ArrowDropDown"));
const FontDownloadIcon = dynamic(() => import("@mui/icons-material/FontDownload"));
const TextFieldButton = dynamic(() => import("./textfieldHelpers/TextFieldButton"));
const CenterFocusWeakIcon = dynamic(() => import("@mui/icons-material/CenterFocusWeak"));
const CenterFocusStrongIcon = dynamic(() => import("@mui/icons-material/CenterFocusStrong"));
const TextFieldIcon = dynamic(() => import("./textfieldHelpers/TextFieldIcon"));
const TextFieldButtonType = dynamic(() => import("./textfieldHelpers/TextFieldButtonType"));

function RenderTextFields({icon, type, isButtons, value, customValue, handleValues, placeholder, label, item, required, isError, multiline, sx, includeIcon, options}: RenderTextFieldsProps) {
  const [anchor, setAnchor] = useState<Element | undefined>(undefined);
  const [anchorType, setAnchorType] = useState<Element | undefined>(undefined);
  const [anchorIcon, setAnchorIcon] = useState<Element | undefined>(undefined);

  return (
    <>
      <TextField
        sx={{...sx}}
        label={label}
        size="small"
        fullWidth
        required={required || false}
        error={isError || false}
        margin="dense"
        multiline={multiline || false}
        value={value || ''}
        placeholder={placeholder}
        onChange={item !== undefined ? handleValues(item) : handleValues}
        InputProps={{
          startAdornment: (
            (includeIcon || Boolean(isButtons)) ? (
              <InputAdornment position="start">
                {includeIcon && (
                  <RenderIcon icon={type || 'link'} enabled color={'#717171'} sx={{ mr: includeIcon ? '5px' : 'unset' }} />
                )}
                {isButtons && (
                  <span style={{display: 'flex'}}>
                    <Typography sx={{mt: '5px'}}>{renderText(type, '')}</Typography>
                    <IconButton size="small" onClick={event => setAnchorType(event.currentTarget)}>
                      <ArrowDropDownIcon />
                    </IconButton>
                  </span>
                )}
              </InputAdornment>
            ) : null
          ),
          endAdornment: (
            <>
              {(required && !value.trim().length) || options && (
                <InputAdornment position="end">
                  {required && !value.trim().length && <Typography color="error">{'REQUIRED'}</Typography>}
                  {customValue?.length ? <FontDownloadIcon /> : undefined}
                  {options && value?.trim()?.length ? (
                    <IconButton size="small" sx={{mr: '-10px'}} onClick={event => setAnchor(event.currentTarget)}>
                      <ArrowDropDownIcon />
                    </IconButton>
                  ) : undefined}
                </InputAdornment>
              )}
              {(includeIcon && Boolean(isButtons)) && (
                <InputAdornment position="end">
                  <IconButton size="small" sx={{mr: '-10px'}} onClick={event => setAnchorIcon(event.currentTarget)}>
                    {!icon ? <CenterFocusWeakIcon /> : <CenterFocusStrongIcon color="primary" />}
                  </IconButton>
                </InputAdornment>
              )}
            </>
          )
        }}
      />
      {anchorIcon && <TextFieldIcon anchor={anchorIcon} setAnchor={setAnchorIcon} handleValues={handleValues} icon={icon} />}
      {anchorType && (
        <TextFieldButtonType
          anchor={anchorType}
          setAnchor={setAnchorType}
          handler={(value: string) => {
            handleValues({type: value});
            setAnchorType(undefined);
          }}
          type={type}
        />
      )}
      {anchor && options && (
        <TextFieldButton
          anchor={anchor}
          setAnchor={setAnchor}
          handleValues={handleValues}
          item={item}
          customValue={customValue} />
      )}
    </>
  );
}

const notIf = (current: RenderTextFieldsProps, next: RenderTextFieldsProps) => (
  current.value === next.value && current.isError === next.isError && current.index === next.index &&
  current.includeIcon === next.includeIcon && current.options === next.options &&
  current.customValue === next.customValue && current.type === next.type && current.icon === next.icon
);

export default memo(RenderTextFields, notIf);

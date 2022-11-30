'use strict'

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';

// @ts-ignore
import { SketchPicker } from 'react-color';
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

const hex = /^#?([0-9A-Fa-f]{3}){1,2}$/;

const handleValue = (value: string): string => {
  let result = (' ' + value).slice(1, 7);
  if (!result.startsWith('#')) {
    result = `#${result}`;
  }
  return result;
};

interface ColorSelProps {
  color: string | undefined | null;
  label: string;
  property: string;
  handleData: Function;
  allowClear?: boolean;
}

const ColorSelector = ({ color, handleData, label, property, allowClear }: ColorSelProps) => {
  const [anchor, setAnchor] = useState(null);
  const [value, setValue] = useState(color || '#000000');

  const ref = useRef(null);
  const cursorPos = useRef<number>(0);

  // @ts-ignore
  const handlePicker = ({ currentTarget }) => {
    setAnchor(currentTarget);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    cursorPos.current = event.target.selectionStart || 0;
    setValue(handleValue(event.target.value));
  };

  // @ts-ignore
  const handlePaste = ({ clipboardData }) => {
    const text = clipboardData.getData('text/plain');
    if (text.length && hex.test(value)) {
      setValue(handleValue(text));
    }
  };

  const handleColor = (payload: { hex: any; }) => {
    handleData(property)(payload.hex);
  };

  const handleClear = () => {
    handleData(property)({clear: true});
  };

  useEffect(() => {
    if (color !== value) { // @ts-ignore
      setValue(color);
    }
    if (ref.current) { // @ts-ignore
      ref.current.selectionStart = cursorPos.current; // @ts-ignore
      ref.current.selectionEnd = cursorPos.current;
    }
  }, [color]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let val = '';
    if (value?.length) {
      val = (' ' + value).slice(1);
    }
    if (val.length && val !== color && hex.test(val)) {
      handleData(property)(val);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <TextField
          size="small"
          fullWidth
          margin="dense"
          variant="outlined"
          label={label}
          value={value?.slice(1) || '000000'}
          onChange={handleChange}
          onPaste={handlePaste}
          inputProps={{ ref }}
          sx={allowClear ? {"& .MuiOutlinedInput-root": { "& > fieldset": { borderRadius: '5px 0 0 5px' }}} : undefined}
          error={!hex.test(value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography>#</Typography>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" sx={{ mt: '5px', mr: '-5px' }}>
                <Box
                  sx={{
                    cursor: 'pointer',
                    p: '3px',
                    mt: '-5px',
                    mr: '-3px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '5px',
                    border: 'solid 1px black',
                    borderColor: theme => theme.palette.text.disabled,
                    backgroundClip: 'content-box',
                    backgroundColor: color || 'inherit'
                  }}
                  onClick={handlePicker} />
              </InputAdornment>
            )
          }}
        />
        {allowClear && (
          <Tooltip title="Clear color selection">
            <Button
              onClick={handleClear}
              disabled={value !== undefined && ['#fff', '#ffffff'].includes(value.toLowerCase())}
              color="error"
              variant="contained"
              sx={{height: '40px', mt: 1, borderRadius: '0 5px 5px 0'}}>
              <ClearIcon sx={{mx: 'auto'}} />
            </Button>
          </Tooltip>
        )}
      </Box>
      {anchor && (
        <Popover
          id="reasonPopover"
          open
          anchorEl={anchor}
          onClose={() => { setAnchor(null); }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <SketchPicker color={color} onChangeComplete={handleColor} disableAlpha presetColors={[]}/>
        </Popover>
      )}
    </>
  );
};

export default ColorSelector;

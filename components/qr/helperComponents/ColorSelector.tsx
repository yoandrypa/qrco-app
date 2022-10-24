// @ts-nocheck

'use strict'

import { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { SketchPicker } from 'react-color';

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
}

const ColorSelector = ({ color, handleData, label, property }: ColorSelProps) => {
  const [anchor, setAnchor] = useState(null);
  const [value, setValue] = useState(color || '#000000');

  const ref = useRef(null);
  const cursorPos = useRef<number>(0);

  const handlePicker = ({ currentTarget }) => {
    setAnchor(currentTarget);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    cursorPos.current = event.target.selectionStart || 0;
    setValue(handleValue(event.target.value));
  };

  const handlePaste = ({ clipboardData }) => {
    const text = clipboardData.getData('text/plain');
    if (text.length && hex.test(value)) {
      setValue(handleValue(text));
    }
  };

  const handleColor = payload => {
    handleData(property)(payload.hex);
  };

  useEffect(() => {
    if (color !== value) {
      setValue(color);
    }
    if (ref.current) {
      ref.current.selectionStart = cursorPos.current;
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

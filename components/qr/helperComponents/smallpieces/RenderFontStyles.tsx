import {memo, MouseEvent, ReactNode, useEffect, useRef, useState} from "react";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from '@mui/material/MenuItem';
import Typography from "@mui/material/Typography";
import ClearIcon from '@mui/icons-material/Clear';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import CheckIcon from '@mui/icons-material/Check';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import SquareOutlinedIcon from '@mui/icons-material/SquareOutlined';
import SquareIcon from '@mui/icons-material/Square';
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

// @ts-ignore
import {SketchPicker} from 'react-color';

interface RenderFontStylesProps {
  handleValue: Function;
  property: string;
  value?: string;
}

const RenderFontStyles = ({handleValue, property, value}: RenderFontStylesProps) => {
  const [formats, setFormats] = useState<string[]>([]);
  const [color, setColor] = useState<string>('#000000');
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [colorAnchor, setColorAnchor] = useState<boolean>(false);

  const doneInitialRender = useRef<boolean>(false);
  const allow = useRef<boolean>(false);

  const handleColorValue = (payload: { hex: any; }) => {
    setColor(payload.hex);
  };

  const setCol = (payload: string) => () => {
    setAnchor(null);
    setColor(payload);
  }

  const handleFormat = (event: MouseEvent<HTMLElement>, newFormats: string[]) => {
    setFormats(newFormats);
  };

  const handleColor = (event: MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const handleOther = () => {
    setColorAnchor(true);
  };

  useEffect(() => {
    if (doneInitialRender.current) {
      if (allow.current) {
        let response = '';
        if (formats.includes('b')) {
          response = 'b';
        }
        if (formats.includes('i')) {
          response += 'i';
        }
        if (formats.includes('u')) {
          response += 'u';
        }
        if (color !== '#000000') {
          response += color;
        }
        handleValue(property)(response);
      } else {
        allow.current = true;
      }
    }
  }, [color, formats]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setColor(value !== undefined && value.includes('#') ? value.slice(value.indexOf('#')) : '#000000');
    const newFormats = [];
    if (value === undefined && ['titlesFontStyle', 'subtitlesFontStyle'].includes(property)) {
      newFormats.push('b');
      handleValue(property)('b');
    } else if (value?.includes('b')) {
      newFormats.push('b');
    }
    if (value?.includes('i')) {
      newFormats.push('i');
    }
    if (value?.includes('u')) {
      newFormats.push('u');
    }
    setFormats(newFormats);
    doneInitialRender.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderCheck = (is?: boolean) => {
    return is ? <CheckIcon color="primary" sx={{mr: '10px'}} /> : <div style={{ width: '34px' }} />
  }

  const renderItem = (text: string, icon: ReactNode) => (
    <>
      {icon}
      <Typography sx={{ml: '5px'}}>{text}</Typography>
    </>
  );

  return (
    <>
    <Stack direction="row">
      <ToggleButtonGroup value={formats} onChange={handleFormat} size="small">
        <ToggleButton value="b">
          <FormatBoldIcon/>
        </ToggleButton>
        <ToggleButton value="i">
          <FormatItalicIcon/>
        </ToggleButton>
        <ToggleButton value="u">
          <FormatUnderlinedIcon/>
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButton value="color" sx={{ml: 1}} selected={formats.some((x: string) => x.startsWith('#'))}
                    onChange={handleColor} size="small">
        <FormatColorTextIcon sx={{color: color !== '#000000' ? color : 'unset'}}/>
        <ArrowDropDownIcon />
      </ToggleButton>
    </Stack>
    {anchor && !colorAnchor && (
      <Menu
        id="menuButton"
        MenuListProps={{ 'aria-labelledby': 'menuButton' }}
        anchorEl={anchor}
        open onClose={() => setAnchor(null)}
      >
        <MenuItem key="defaultColor" onClick={setCol('#000000')}>
          {renderCheck(color === '#000000')}
          {renderItem('Default color', <ClearIcon />)}
        </MenuItem>
        {property==='buttonsFontStyle' && (
          <MenuItem key="mainColors" onClick={setCol('#-1')}>
            {renderCheck(color === '#-1')}
            {renderItem('Use main colors', <InvertColorsIcon />)}
          </MenuItem>
        )}
        <Divider />
        <MenuItem key="white" onClick={setCol('#ffffff')}>
          {renderCheck(color === '#ffffff')}
          {renderItem('White', <SquareOutlinedIcon color="primary" />)}
        </MenuItem>
        <MenuItem key="blue" onClick={setCol('#1a237e')}>
          {renderCheck(color === '#1a237e')}
          {renderItem('Blue', <SquareIcon sx={{color: '#1a237e'}}/>)}
        </MenuItem>
        <MenuItem key="green" onClick={setCol('#33691e')}>
          {renderCheck(color === '#33691e')}
          {renderItem('Green', <SquareIcon sx={{color: '#33691e'}}/>)}
        </MenuItem>
        <MenuItem key="orange" onClick={setCol('#f57f17')}>
          {renderCheck(color === '#f57f17')}
          {renderItem('Orange', <SquareIcon sx={{color: '#f57f17'}} />)}
        </MenuItem>
        <MenuItem key="other" onClick={setCol('#b71c1c')}>
          {renderCheck(color === '#b71c1c')}
          {renderItem('Red', <SquareIcon sx={{color: '#b71c1c'}} />)}
        </MenuItem>
        <Divider />
        <MenuItem key="chooseColor" onClick={handleOther}>
          {renderCheck(!['#-1', '#000000', '#ffffff','#1a237e', '#33691e', '#f57f17', '#b71c1c'].includes(color))}
          {renderItem('Other...', <ColorLensIcon color="primary" />)}
        </MenuItem>
      </Menu>
      )}
      {anchor && colorAnchor && (
        <Popover
          id="reasonPopover"
          open
          anchorEl={anchor}
          onClose={() => {
            setAnchor(null);
            setColorAnchor(false);
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <SketchPicker color={color} onChangeComplete={handleColorValue} disableAlpha presetColors={[]}/>
          <Button endIcon={<HighlightOffIcon />} sx={{ my: 1, height: '25px', width: '100%' }} onClick={() => {
            setAnchor(null);
            setColorAnchor(false);
          }}>
            {'Close'}
          </Button>
        </Popover>
      )}
      </>
  );
}

export default memo(RenderFontStyles, (curr, next) => curr.value === next.value);

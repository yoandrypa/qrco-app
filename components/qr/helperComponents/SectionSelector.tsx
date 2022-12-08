import {useRef, useState} from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import UploadIcon from '@mui/icons-material/Upload';

import Notifications from '../../../components/notifications/Notifications';

interface SectionSelectorProps {
  handleSelect: Function;
  isUpload?: boolean | false;
  label?: string | '';
  isFrame?: boolean | false;
  icon?: string | null;
  selected: boolean;
  separate?: boolean;
  property?: string;
  maxSize?: number;
  w?: string;
  h?: string;
}

const SectionSelector = ({w, h, label, handleSelect, icon, selected, isUpload, isFrame, property, separate, maxSize }: SectionSelectorProps) => {
  const fileInput = useRef<any>();
  const [error, setError] = useState<boolean>(false);

  const renderIcon = () => {
    if (isUpload) {
      return <UploadIcon/>
    } else if (icon === null) {
      return <DoNotDisturbIcon/>
    } else {
      return <Box component="img" src={icon} sx={{width: !w ? '30px' : `calc(${w} - 15px)`}}/>
    }
  };

  const handler = (f: Blob | MediaSource) => {
    if (f) {
      const reader = new FileReader(); // @ts-ignore
      reader.readAsDataURL(f);
      reader.onloadend = e => { // @ts-ignore
        if (e.total <= ((maxSize * 1024) || 30720)) { // @ts-ignore
          handleSelect(property || 'image', { fileContents: e.target.result, file: URL.createObjectURL(f) }, !isUpload ? icon : null);
        } else {
          setError(true);
        }
      };
    }
  }

  const beforeHandle = () => {
    if (!isUpload) {
      if (icon) {
        if (!isFrame) {
          fetch(icon)
            .then(response => response.text())
            .then(data => {
              const blob = new Blob([data], {type: 'image/svg+xml'});
              handler(blob);
            });
        } else {
          handleSelect(property || 'image', icon);
        }
      } else {
        handleSelect(property || 'image', null);
      }
    } else {
      fileInput.current.click();
    }
  };

  // @ts-ignore
  const onLoadFile = ({target}) => {
    const f = target.files[0];
    handler(f);
    fileInput.current.value = '';
  };

  return (
    <Box sx={{display: 'inline-flex', mr: separate ? '10px' : 0}}>
      <Box>
        <Button
          sx={{
            width: w || '50px',
            height: h || '60px',
            border: theme => `solid 1px ${theme.palette.text.disabled}`,
            boxShadow: selected ? '0 0 3px 2px #286ED6' : 'none',
            '&:hover': {
              boxShadow: !selected ? '0 0 2px 2px #849abb' : '0 0 2px 2px #286ED6'
            }
          }}
          variant={selected ? 'outlined' : 'text'}
          onClick={beforeHandle}
        >
          {isUpload &&
            <input ref={fileInput} accept="image/*" type="file" style={{display: 'none'}} onChange={onLoadFile}/>}
          {renderIcon()}
        </Button>
        <Typography sx={{
          width: '100%',
          textAlign: 'center',
          fontWeight: selected ? 'bold' : 'normal',
          fontSize: 'small',
          fontVariantCaps: 'all-petite-caps'
        }}>
          {label}
        </Typography>
      </Box>
      {error && (
        <Notifications onClose={() => {
          setError(false);
        }} message={`The selected file is larger than ${maxSize || 30} kilobytes.`}/>
      )}
    </Box>
  );
};

export default SectionSelector;

import {useContext, useRef} from "react";
import Popover from "@mui/material/Popover";
import Claiming from "../looseComps/Claiming";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';

import Context from "../../../context/Context";
import {OptionsType} from "../../types/types";
import {generateShortLink} from "../../../../utils";

interface EditCustomProps {
  anchor?: HTMLElement;
  setAnchor: (close: any) => void;
  current: string;
}

export default function EditCustomLinkCode({anchor, setAnchor, current}: EditCustomProps) {
  const code = useRef<string>((' ' + current).slice(1));
  const { setOptions } = useContext(Context);

  const close = () => {
    setAnchor(undefined);
  }

  const updateCode = (newCode: string) => {
    code.current = newCode;
  }

  const handleOk = () => {
    setOptions((prev: OptionsType) => {
      const newOptions = {...prev, shortCode: code.current, data: generateShortLink(code.current, process.env.SHORT_URL_DOMAIN)};
      if (newOptions.mode === 'edit') { // @ts-ignore
        newOptions.editedShortLink = true;
      }
      return newOptions;
    });
    close();
  }

  return (
    <Popover
      open
      anchorEl={anchor}
      onClose={close}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Box sx={{ p: 2, width: {sx: '100%', xs: '370px'} }}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Typography sx={{my: 'auto'}}>{'Enter the new code'}</Typography>
          <IconButton size="small" onClick={close}><CloseIcon /></IconButton>
        </Box>
        <Claiming handleOk={handleOk} code={current} handleCurrent={updateCode} />
      </Box>
    </Popover>
  );
}

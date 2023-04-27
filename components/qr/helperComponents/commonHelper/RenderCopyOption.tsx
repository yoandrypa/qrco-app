import {MouseEvent, useEffect, useState} from "react";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";

import {iconColor} from "./helpers";
import {handleCopy} from "../../../helpers/generalFunctions";

import dynamic from "next/dynamic";

const MenuList = dynamic(() => import ("@mui/material/MenuList"));
const MenuItem = dynamic(() => import ("@mui/material/MenuItem"));
const Popover = dynamic(() => import ("@mui/material/Popover"));
const RenderCopiedNotification = dynamic(() => import ("../looseComps/RenderCopiedNotification"));

interface CopyOptProps {
  disabled: boolean;
  secretOps?: string;
  secret: string;
}

function RenderCopyOption({disabled, secret, secretOps}: CopyOptProps ) {
  const [copy, setCopy] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<undefined | HTMLElement>(undefined);

  useEffect(() => {
    if (anchor) { setAnchor(undefined); }
  }, [copy]); // eslint-disable-line react-hooks/exhaustive-deps

  if (secretOps === 'l') {
    return (
      <>
        <Tooltip title="Copy">
          <IconButton disabled={disabled} sx={{mr: '-3px'}} size="small"
                      onClick={(event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}>
            <ContentCopyIcon sx={iconColor(disabled)}/>
          </IconButton>
        </Tooltip>
        {anchor && (<Popover
          open
          anchorEl={anchor}
          onClose={() => setAnchor(undefined)}
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          transformOrigin={{vertical: 'top', horizontal: 'center'}}
        >
          <MenuList>
            <MenuItem onClick={() => handleCopy(`${window.location.origin}/s/${secret}`, setCopy)}>
              {'Copy secret edit URL'}
            </MenuItem>
            <MenuItem onClick={() => handleCopy(secret, setCopy)}>
              {'Copy secret code'}
            </MenuItem>
          </MenuList>
        </Popover>
        )}
        {copy && <RenderCopiedNotification setCopied={() => setCopy(false)} />}
      </>
    );
  }

  const isUrl = !Boolean(secretOps);

  const handleCopier = () => {
    handleCopy(isUrl ? `${window.location.origin}/s/${secret}` : secret, setCopy);
  }

  return (
    <>
      <Tooltip title={`Copy secret ${isUrl ? 'edit URL' : 'code'}`}>
        <IconButton disabled={disabled} sx={{mr: '-3px'}} size="small"
                    onClick={handleCopier}><ContentCopyIcon sx={iconColor(disabled)}/></IconButton>
      </Tooltip>
      {copy && <RenderCopiedNotification setCopied={() => setCopy(false)} />}
    </>
  );
}

export default RenderCopyOption;

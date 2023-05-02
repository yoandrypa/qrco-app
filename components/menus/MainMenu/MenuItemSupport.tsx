import {useState} from "react";

import session from "@ebanux/ebanux-utils/sessionStorage";

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import EmailIcon from "@mui/icons-material/Email";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import classes from "./classes.sx";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {handleCopy} from "../../helpers/generalFunctions";

import dynamic from "next/dynamic";

const RenderCopiedNotification = dynamic(() => import("../../qr/helperComponents/looseComps/RenderCopiedNotification"));

const email = 'info@ebanux.com';

export default function MenuItemSupport() {
  const { iconSmall } = classes;
  const { isAuthenticated } = session;

  const [copy, setCopy] = useState<boolean>(false);

  const onOpenDocumentation = () => {
    window.open('https://docs.theqr.link', '_blank');
  }

  const onOpenMailTo = () => {
    window.open(`mailto:${email}`, '_blank');
  }

  const handleCopier = (e: any) => {
    if (e.currentTarget.id === 'btnCopy') {
      e.preventDefault();
      e.stopPropagation();
      handleCopy(email, setCopy);
    }
  }

  return (
    <div>
      <MenuItem onClick={onOpenDocumentation}>
        <ListItemIcon><ContactSupportIcon sx={iconSmall} /></ListItemIcon>
        <ListItemText>Documentation</ListItemText>
        <Tooltip title="Open documentation page">
          <OpenInNewIcon fontSize="small" sx={{color: '#757575'}}/>
        </Tooltip>
      </MenuItem>
      <MenuItem onClick={onOpenMailTo} divider={isAuthenticated}>
        <ListItemIcon><EmailIcon sx={iconSmall} /></ListItemIcon>
        <ListItemText>{email}</ListItemText>
        <Tooltip title="Copy contact email address">
          <IconButton size="small" sx={{mr: '-6px'}} id="btnCopy" onClick={handleCopier}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </MenuItem>
      {copy && <RenderCopiedNotification setCopied={() => setCopy(false)} message="Contact email address copied!" />}
    </div>
  );
}

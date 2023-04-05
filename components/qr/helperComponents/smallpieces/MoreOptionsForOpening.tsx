import {memo, MouseEvent, useEffect, useState} from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";

import dynamic from "next/dynamic";
import Notifications from "../../../notifications/Notifications";

const MenuItem = dynamic(() => import("@mui/material/MenuItem"));
const ListItemIcon = dynamic(() => import("@mui/material/ListItemIcon"));
const ListItemText = dynamic(() => import("@mui/material/ListItemText"));
const Menu = dynamic(() => import("@mui/material/Menu"));
const ContentCopyIcon = dynamic(() => import("@mui/icons-material/ContentCopy"));
const ContentPasteIcon = dynamic(() => import("@mui/icons-material/ContentPaste"));

interface MoreOptionsProps {
  handleCopy: (day: string) => void;
  handlePaste: (day: string) => void;
  disableCopy: boolean;
  disablePaste: boolean;
  day: string;
}

const MoreOptionsForOpening = ({day, handleCopy, handlePaste, disableCopy, disablePaste}: MoreOptionsProps) => {
  const [anchor, setAnchor] = useState<undefined | HTMLElement>(undefined);
  const [action, setAction] = useState<undefined | string>(undefined);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const beforePaste = () => {
    handlePaste(day);
    setAction('pasted');
  };

  const beforeCopy = () => {
    handleCopy(day);
    setAction('copied');

  };

  useEffect(() => {
    if (action) {
      setAnchor(undefined);
    }
  }, [action]);

  return (
    <>
      <IconButton size="small" onClick={handleOpen} sx={{mr: '-5px'}}>
        <MoreVertIcon fontSize="small"/>
      </IconButton>
      {anchor && (
        <Menu
          id="menuButton"
          MenuListProps={{ 'aria-labelledby': 'menuButton' }}
          anchorEl={anchor}
          open
          onClose={() => setAnchor(undefined)}
        >
          <MenuItem key="copyOption" onClick={beforeCopy} disabled={disableCopy}>
            <ListItemIcon><ContentCopyIcon/></ListItemIcon>
            <ListItemText>Copy this day opening schedule</ListItemText>
          </MenuItem>
          <MenuItem key="pasteOption" onClick={beforePaste} disabled={disablePaste}>
            <ListItemIcon><ContentPasteIcon /></ListItemIcon>
            <ListItemText>Paste opening schedule</ListItemText>
          </MenuItem>
        </Menu>
      )}
      {action && (
        <Notifications
          autoHideDuration={1500}
          message={`Opening schedule ${action} successfully!`}
          vertical="bottom"
          horizontal="center"
          severity="success"
          onClose={() => setAction(undefined)}/>
      )}
    </>
  );
}

const notIf = (curr: MoreOptionsProps, next: MoreOptionsProps) =>
  curr.disableCopy === next.disableCopy && curr.disablePaste === next.disablePaste;

export default memo(MoreOptionsForOpening, notIf);

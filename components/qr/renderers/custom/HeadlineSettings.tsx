import {useState} from "react";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import CheckIcon from "@mui/icons-material/Check";
import Typography from "@mui/material/Typography";

import {Type} from "../../types/types";

import dynamic from "next/dynamic";
import RenderHeadlineSettings from "./RenderHeadlineSettings";

const SettingsIcon = dynamic(() => import("@mui/icons-material/Settings"));

interface HeadlineProps {
  anchor: HTMLElement;
  handleValues: Function;
  handleClose: () => void;
  data?: Type;
  hideHeadline: boolean;
  index: number;
}

export default function HeadlineSettings({anchor, handleValues, handleClose, index, data, hideHeadline}: HeadlineProps) {
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const handle = () => {
    let isChecked = data?.hideHeadLine || false;
    handleValues('hideHeadLine', index)(!isChecked);
    handleClose();
  };

  let checked = data?.hideHeadLine === undefined || !data?.hideHeadLine;

  const customHandle = (prop: string) => () => { // @ts-ignore
    const value = data?.[prop] || false;
    handleValues(prop, index)(!value);
    handleClose();
  }

  const renderCheck1 = (checked?: boolean) => checked && <CheckIcon color="primary" sx={{ml: 2}} />;

  return (
    <>
      <Popover
        open
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        transformOrigin={{vertical: 'top', horizontal: 'left'}}
      >
        <MenuList>
          {!hideHeadline && <MenuItem onClick={handle}>
            <ListItemText><Typography>Show headline</Typography></ListItemText>
            {renderCheck1(checked)}
          </MenuItem>}
          {!hideHeadline && <MenuItem onClick={customHandle('centerHeadLine')} disabled={!checked}>
            <ListItemText><Typography>Center headline</Typography></ListItemText>
            {renderCheck1(data?.centerHeadLine)}
          </MenuItem>}
          {!hideHeadline && <MenuItem onClick={customHandle('hideHeadLineIcon')} disabled={!checked}>
            <ListItemText><Typography>Hide headline icon</Typography></ListItemText>
            {renderCheck1(data?.hideHeadLineIcon)}
          </MenuItem>}
          {!hideHeadline && <Divider />}
          <MenuItem onClick={() => setOpenSettings(true)}>
            <ListItemIcon><SettingsIcon/></ListItemIcon>
            <ListItemText><Typography>{'Section settings...'}</Typography></ListItemText>
          </MenuItem>
        </MenuList>
      </Popover>
      {openSettings && (
        <RenderHeadlineSettings
          handleValues={handleValues}
          handleClose={handleClose}
          index={index}
          data={data}
          anchor={anchor}
          allowFonts={checked && !hideHeadline}
        />
      )}
    </>
  );
}

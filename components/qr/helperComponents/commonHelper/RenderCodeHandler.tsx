import {MouseEvent, useRef, useState} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from "@mui/material/Tooltip";

import {handleCopy} from "../../../helpers/generalFunctions";

import dynamic from "next/dynamic";
import {td} from "./helpers";

const Divider = dynamic(() => import("@mui/material/Divider"));
const Menu = dynamic(() => import("@mui/material/Menu"));
const MenuItem = dynamic(() => import("@mui/material/MenuItem"));
const Typography = dynamic(() => import("@mui/material/Typography"));
const EditCustomLinkCode = dynamic(() => import("../smallpieces/EditCustomLinkCode"));
const Box = dynamic(() => import("@mui/material/Box"));
const RenderCopiedNotification = dynamic(() => import("../looseComps/RenderCopiedNotification"));
const Popover = dynamic(() => import("@mui/material/Popover"));
const ContentCopyIcon = dynamic(() => import("@mui/icons-material/ContentCopy"));
const EditIcon = dynamic(() => import("@mui/icons-material/Edit"));
const OpenInNewIcon = dynamic(() => import("@mui/icons-material/OpenInNew"));

interface CodeProps {
  code: string;
  url?: string;
}

export default function RenderCodeHandler({url, code}: CodeProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [anchorHelp, setAnchorHelp] = useState<undefined | HTMLElement>(undefined);
  const [anchorOpts, setAnchorOpts] = useState<undefined | HTMLElement>(undefined);
  const [anchorEdit, setAnchorEdit] = useState<null | HTMLDivElement>(null);

  const ref = useRef<HTMLDivElement>(null);

  const copier = (data: string) => {
    handleCopy(data, setCopied);
    setAnchorOpts(undefined);
  }

  const handleCopier = () => {
    copier(`${url}/${code}`);
  }

  const handleCopyCode = () => {
    copier(code);
  }

  const handleOpenHelp = (event: MouseEvent<HTMLElement>) => {
    setAnchorHelp(event.currentTarget);
  };

  const handleOpenOpts = (event: MouseEvent<HTMLElement>) => {
    setAnchorOpts(event.currentTarget);
  };

  const handleEdit = () => {
    setAnchorEdit(ref.current);
    setAnchorOpts(undefined);
  };

  return (
    <>
      <TextField
        size="small"
        label="QRLynk page URL"
        fullWidth
        ref={ref}
        margin="dense"
        value={code}
        sx={{"& .MuiInputBase-root": { color: 'primary.main' }}}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{padding: "19.5px 7px", ml: '-13px', backgroundColor: '#00000008'}}>
              {url || '...'}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end" sx={{mr: '-10px'}}>
              <Tooltip title="Help">
                <IconButton sx={{mr: '-3px'}} size="small" onClick={handleOpenHelp}>
                  <HelpOutlineIcon color="primary"/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Options">
                <IconButton sx={{mr: '-3px'}} size="small" onClick={handleOpenOpts}>
                  <MoreVertIcon color="primary"/>
                </IconButton>
              </Tooltip>
            </InputAdornment>
          )
        }}
      />
      {copied && <RenderCopiedNotification setCopied={() => setCopied(false)} />}
      {anchorHelp && (
        <Popover
          open={true}
          anchorEl={anchorHelp}
          onClose={() => setAnchorHelp(undefined)}
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          transformOrigin={{vertical: 'top', horizontal: 'center'}}
        >
          <Box sx={{p: 2}}>
            <table cellPadding={0} cellSpacing={0}>
              <tbody>
              <tr><td colSpan={2} style={{paddingBottom: '10px'}}>
                <span style={{fontWeight: 'bold'}}>QRLynk page URL options</span>
              </td></tr>
              <tr>
                <td style={td}><ContentCopyIcon color="primary" fontSize="small"/></td>
                <td>
                  Copy to the clipboard:
                  <ul style={{paddingLeft: '20px', marginTop: '3px', marginBottom: '1px'}}>
                    <li>The QRLynk page URL.</li>
                    <li>The QRLynk code.</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={td}><EditIcon color="primary" fontSize="small"/></td>
                <td>Edit QRLynk code.</td>
              </tr>
              <tr>
                <td style={td}><OpenInNewIcon color="primary" fontSize="small"/></td>
                <td>Open this QRLynk in another tab.</td>
              </tr>
              </tbody>
            </table>
          </Box>
        </Popover>
      )}
      {anchorEdit && <EditCustomLinkCode setAnchor={setAnchorEdit} anchor={anchorEdit} current={code}/>}
      {anchorOpts && (
        <Menu
          id="menuButton"
          MenuListProps={{ 'aria-labelledby': 'menuButton' }}
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          transformOrigin={{vertical: 'top', horizontal: 'center'}}
          anchorEl={anchorOpts}
          open onClose={() => setAnchorOpts(undefined)}
        >
          <MenuItem key="copyMenu" onClick={handleCopier}>
            <ContentCopyIcon color="primary"/>
            <Typography sx={{ml: '5px'}}>{'Copy page URL'}</Typography>
          </MenuItem>
          <MenuItem key="copyCodeMenu" onClick={handleCopyCode}>
            <ContentCopyIcon color="primary"/>
            <Typography sx={{ml: '5px'}}>{'Copy code'}</Typography>
          </MenuItem>
          <Divider/>
          <MenuItem key="editMenu" onClick={handleEdit}>
            <EditIcon color="primary"/>
            <Typography sx={{ml: '5px'}}>{'Edit'}</Typography>
          </MenuItem>
          <Divider/> {/* @ts-ignore */}
          <MenuItem key="openMenu" target="_blank" component="a" href={`${url}/${code}`} disabled={!url} onClick={() => setAnchorOpts(undefined)}>
            <OpenInNewIcon color="primary"/>
            <Typography sx={{ml: '5px'}}>{'Open'}</Typography>
          </MenuItem>
        </Menu>
      )}
    </>
  )
}

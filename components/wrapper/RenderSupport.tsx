import {MouseEvent, memo, useState} from "react";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import dynamic from "next/dynamic";

const Popover = dynamic(() => import("@mui/material/Popover"));
const MenuList = dynamic(() => import("@mui/material/MenuList"));
const MenuItem = dynamic(() => import("@mui/material/MenuItem"));
const EmailIcon = dynamic(() => import("@mui/icons-material/Email"));

const RenderSupport = () => {
  const [anchorSupport, setAnchorSupport] = useState<null | HTMLElement>(null);

  const handleSupportMenuAnchor = (event: MouseEvent<HTMLElement>) => {
    setAnchorSupport(event.currentTarget);
  };

  return (
    <>
      <IconButton sx={{ mr: '-11px' }} onClick={handleSupportMenuAnchor}>
        <ContactSupportIcon color="primary" />
      </IconButton>
      {anchorSupport && (<Popover
        open
        anchorEl={anchorSupport}
        onClose={() => setAnchorSupport(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ width: '235px', height: {sm: '88px', xs: '112px'} }}>
          <MenuList>
            <MenuItem key="help" onClick={() => setAnchorSupport(null)} // @ts-ignore
                      href="https://docs.theqr.link/" button component="a" target="_blank" rel="noopener noreferrer">
              <ContactSupportIcon color="primary" />
              <Typography sx={{ml: '5px'}}>{"Documentation"}</Typography>
            </MenuItem>
            <MenuItem key="emailSupport" onClick={() => setAnchorSupport(null)} // @ts-ignore
                      href="mailto:info@ebanux.com" button component="a" target="_blank" rel="noopener noreferrer">
              <EmailIcon color="primary" />
              <Typography sx={{ml: '5px'}}>{"info@ebanux.com"}</Typography>
            </MenuItem>
          </MenuList>
        </Box>
      </Popover>)}
    </>
  );
}

export default memo(RenderSupport);

import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import SmsIcon from "@mui/icons-material/Sms";
import LinkIcon from '@mui/icons-material/Link';
import MailIcon from "@mui/icons-material/Mail";
import CallIcon from "@mui/icons-material/Call";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import renderText from "./textHandler";

interface TxtButtonProps {
  anchor: Element;
  setAnchor: (anchor: undefined) => void;
  handler: (value: string) => void;
  type?: string;
}

export default function TextFieldButtonType({anchor, type, handler, setAnchor}: TxtButtonProps) {
  return (
    <Popover
      open
      anchorEl={anchor}
      onClose={() => setAnchor(undefined)}
      anchorOrigin={{vertical: 'top', horizontal: 'left'}}
      transformOrigin={{vertical: 'top', horizontal: 'left'}}
    >
      <MenuList>
        <MenuItem
          key="link"
          onClick={() => handler('link')}
          sx={{color: type === undefined || type === 'link' ? 'primary.dark' : 'text.disabled'}}>
          <LinkIcon fontSize="small" sx={{mr: 1}}/>
          <Typography sx={{fontWeight: type === undefined || type === 'link' ? 'bold' : undefined}}>{renderText('link', '')}</Typography>
        </MenuItem>
        <MenuItem
          key="email"
          onClick={() => handler('email')}
          sx={{color: type !== 'email' ? 'text.disabled' : 'primary.dark'}}>
          <MailIcon fontSize="small" sx={{mr: 1}}/>
          <Typography sx={{fontWeight: type === 'email' ? 'bold' : undefined}}>{renderText('email', '')}</Typography>
        </MenuItem>
        <MenuItem
          key="call"
          onClick={() => handler('call')}
          sx={{color: type !== 'call' ? 'text.disabled' : 'primary.dark'}}>
          <CallIcon fontSize="small" sx={{mr: 1}}/>
          <Typography sx={{fontWeight: type === 'cell' ? 'bold' : undefined}}>{renderText('call', '')}</Typography>
        </MenuItem>
        <MenuItem
          key="whatsapp"
          onClick={() => handler('whatsapp')}
          sx={{color: type !== 'whatsapp' ? 'text.disabled' : 'primary.dark'}}>
          <WhatsAppIcon fontSize="small" sx={{mr: 1}}/>
          <Typography sx={{fontWeight: type === 'whatsapp' ? 'bold' : undefined}}>{renderText('whatsapp', '')}</Typography>
        </MenuItem>
        <MenuItem
          key="sms"
          onClick={() => handler('sms')}
          sx={{color: type !== 'sms' ? 'text.disabled' : 'primary.dark'}}>
          <SmsIcon fontSize="small" sx={{mr: 1}}/>
          <Typography sx={{fontWeight: type === 'sms' ? 'bold' : undefined}}>{renderText('sms', '')}</Typography>
        </MenuItem>
      </MenuList>
    </Popover>
  )
}

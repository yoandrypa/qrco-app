import {memo, useState} from "react";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Public from "@mui/icons-material/Public";
import RenderCopiedNotification from "./looseComps/RenderCopiedNotification";
import {handleCopy} from "../../helpers/generalFunctions";

interface LinkOpsProps {
  link: string;
  isWide: boolean;
  iconsProps: any;
}

const RenderLinkOptions = ({link, isWide, iconsProps}: LinkOpsProps) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copier = () => {
    handleCopy(link, setCopied);
  }

  return (
    <div style={{display: 'flex', color: '#808080'}}>
      {isWide && <Public sx={{ ...iconsProps, mr: '5px' }} />}
      <Typography variant="caption" sx={{mr: '2px'}}>
        <Link href={link}>
          <a target="_blank" rel="noopener noreferrer"> {/*this is needed until next 13 is used*/}
            {link.split("//")[1]}
          </a>
        </Link>
      </Typography>
      <IconButton sx={{mt: '-5px'}} size="small" target="_blank" component="a" href={link}>
        <OpenInNewIcon sx={{width: '17px', height: '17px'}}/>
      </IconButton>
      <div style={{marginLeft: '-4px'}}>
        <IconButton size="small" sx={{mt: '-5px'}} onClick={copier}>
          <ContentCopyIcon sx={{width: '17px', height: '17px'}}/>
        </IconButton>
      </div>
      {copied && <RenderCopiedNotification setCopied={setCopied} />}
    </div>
  )
};

const notIf = (curr: LinkOpsProps, next: LinkOpsProps) => curr.link === next.link && curr.isWide === next.isWide;

export default memo(RenderLinkOptions, notIf);

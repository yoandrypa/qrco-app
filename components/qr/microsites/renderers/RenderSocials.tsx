import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import RenderIcon from "../../helperComponents/RenderIcon";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from "@mui/material/IconButton";
import ForwardIcon from "@mui/icons-material/Forward";
import GroupsIcon from '@mui/icons-material/Groups';
import {capitalize} from "@mui/material";

import {DEFAULT_COLORS, SOCIALS} from "../../constants";
import {SocialsType} from "../../types/types";

interface RenderSocialsProps {
  newData: any;
  onlyIcons?: boolean;
}

export default function RenderSocials({newData, onlyIcons}: RenderSocialsProps) {
  const handleCopy = (data: string) => {
    try {
      navigator.clipboard.writeText(data);
    } catch {
      console.log('Copy failed')
    }
  }

  const renderSocials = (item: string) => {
    let value = newData[item] as string;
    value = value.slice(value.indexOf(':') + 1);

    let url = '' as string;
    switch (item) {
      case 'facebook': {
        url = 'https://www.facebook.com/';
        break;
      }
      case 'twitter': {
        url = 'https://twitter.com/';
        break;
      }
      case 'pinterest': {
        url = 'https://www.pinterest.com/';
        break;
      }
      case 'whatsapp': {
        url = 'https://wa.me/';
        break;
      }
      case 'telegram': {
        url = 'https://t.me/';
        break;
      }
      case 'linkedin': {
        url = 'https://www.linkedin.com/in/';
        break;
      }
      case 'instagram': {
        url = 'https://www.instagram.com/';
        break;
      }
      case 'youtube': {
        url = 'https://www.youtube.com/';
        break;
      }
    }

    url += `${value}${item !== 'youtube' ? '' : '?sub_confirmation=1'}`;
    let label = item !== 'linkedin' ? capitalize(item) : 'LinkedIn';

    if (onlyIcons) {
      return (
        <Tooltip title={`Go to ${label}`}>
          <IconButton target="_blank" component="a" href={url}>
            <RenderIcon icon={item} enabled color={newData.primary || DEFAULT_COLORS.p} />
          </IconButton>
        </Tooltip>
      );
    }

    return (
      <TextField
        variant="standard"
        label=""
        size="small"
        fullWidth
        margin="dense"
        // @ts-ignore
        value={value}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <RenderIcon icon={item} enabled color={newData.secondary || DEFAULT_COLORS.s}/>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={`Copy ${label} contact info to clipboard`}>
                <IconButton onClick={() => handleCopy(url)}>
                  <ContentCopyIcon sx={{color: newData.secondary || DEFAULT_COLORS.s}}/>
                </IconButton>
              </Tooltip>
              <Tooltip title={`Go to ${label}`}>
                <IconButton target="_blank" component="a" href={url}>
                  <ForwardIcon sx={{color: newData.secondary || DEFAULT_COLORS.s}}/>
                </IconButton>
              </Tooltip>
            </InputAdornment>
          )
        }}
      />
    );
  }


  return (
    <>
      {(newData.facebook || newData.whatsapp || newData.twitter || newData.linkedin || newData.instagram ||
        newData.youtube || newData.pinterest || newData.telegram) && (<>
          {!onlyIcons ? (
            <>
              <Grid item xs={1}><GroupsIcon sx={{color: newData.primary || DEFAULT_COLORS.p}}/></Grid>
              <Grid item xs={11}>
                <Grid container spacing={1}>
                  {/* @ts-ignore */}
                  {Object.keys(newData).filter((x: string) => SOCIALS.includes(x)).map((x: SocialsType) => (
                    <Grid item xs={12} style={{paddingTop: 0}} key={`socialnw${x}`}>
                      {renderSocials(x)}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              {/* @ts-ignore */}
              {Object.keys(newData).filter((x: string) => SOCIALS.includes(x)).map((x: SocialsType) => (
                <>
                  {renderSocials(x)}
                </>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
}

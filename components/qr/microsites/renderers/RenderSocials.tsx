import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import RenderIcon from "../../helperComponents/RenderIcon";
import IconButton from "@mui/material/IconButton";
import ForwardIcon from "@mui/icons-material/Forward";
import {DEFAULT_COLORS} from "../../constants";

interface RenderSocialsProps {
  newData: any;
}

export default function RenderSocials({newData}: RenderSocialsProps) {

  const renderSocials = (item: string, label: string) => {
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

    return (
      <Grid item xs={12} style={{paddingTop: 0}}>
        <TextField
          variant="standard"
          label={label}
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
                <IconButton target="_blank" component="a" href={url}>
                  <ForwardIcon sx={{ color: newData.secondary || DEFAULT_COLORS.s }} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>
    );
  }

  return (
    <>
      {newData.facebook && renderSocials('facebook', 'Facebook')}
      {newData.whatsapp && renderSocials('whatsapp', 'Whatsapp')}
      {newData.twitter && renderSocials('twitter', 'Twitter')}
      {newData.linkedin && renderSocials('linkedin', 'LinkedIn')}
      {newData.instagram && renderSocials('instagram', 'Instagram')}
      {newData.youtube && renderSocials('youtube', 'Youtube')}
      {newData.pinterest && renderSocials('pinterest', 'Pinterest')}
      {newData.telegram && renderSocials('telegram', 'Telegram')}
    </>
  );
}

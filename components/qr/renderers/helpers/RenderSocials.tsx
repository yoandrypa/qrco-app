import {ChangeEvent, useCallback, useRef} from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SquareSelector from "../../helperComponents/SquareSelector";
import TextField from "@mui/material/TextField";
import {capitalize} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import RenderIcon from "../../helperComponents/RenderIcon";
import {DataType, SocialNetworksType, SocialsType} from "../../types/types";
import {PHONE} from "../../constants";

interface RenderSocialsProps {
  data: DataType;
  setData: Function;
}

const RenderSocials = ({data, setData}: RenderSocialsProps) => {
  const selection = useRef<SocialsType | null>(null);
  const errorDetected = useRef(false);

  const handleValues = (item: SocialsType) => (event: ChangeEvent<HTMLInputElement>) => {
    setData((prev: DataType) => {
      const tempo = {...prev};
      if (tempo.socials) {
        const network = tempo.socials.find((x: SocialNetworksType) => x.network === item);
        if (network) {
          network.value = event.target.value;
          return tempo;
        }
      }
    });
  };

  const renderSocial = (item: SocialNetworksType) => {
    if (item !== undefined) {
      let isError = !item.value?.length;

      if (item.network === 'whatsapp' && !isError && !PHONE.test(item.value || '')) {
        isError = true;
      }

      return (
        <TextField
          label={capitalize(item.network)}
          autoFocus={item.network === selection.current}
          size="small"
          fullWidth
          placeholder={`Enter just your ${item.network !== 'whatsapp' ? 'username' : 'cell number'}`}
          margin="dense"
          value={item.value || ''}
          onChange={handleValues(item.network)}
          error={isError}
          InputProps={{
            startAdornment: <InputAdornment position="start"><RenderIcon icon={item.network} enabled/></InputAdornment>
          }}
        />
      );
    }
    return null;
  };

  const renderSocialNetworks = useCallback(() => {
    errorDetected.current = false;
    const socials = data.socials || [];

    let columns:number;
    switch (socials.length) {
      case 1: {
        columns = 12;
        break;
      }
      case 2:
      case 4: {
        columns = 6;
        break;
      }
      default: {
        columns = 4;
        break;
      }
    }

    return socials.map((x: SocialNetworksType) => (
      <Grid item xs={12} sm={columns} style={{paddingTop: 0}} key={`socialnetwork${x}`}>
        {renderSocial(x)}
      </Grid>
    ))
  }, [data?.socials]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelection = (item: SocialsType) => {
    selection.current = item;
    setData((prev: DataType) => {
      const temp = {...prev};
      if (!temp.socials || !temp.socials.some((x: SocialNetworksType) => x.network === item)) {
        if (!temp.socials) {
          temp.socials = [];
        }
        temp.socials.push({ network: item, value: ''});
      } else {
        const index = temp.socials.findIndex((x: SocialNetworksType) => x.network === item);
        temp.socials.splice(index, 1);
      }
      return temp;
    });
  }

  const exists = useCallback((network: SocialsType) => (
    data.socials !== undefined && data.socials.some((x: SocialNetworksType) => x.network === network)
  ), [data.socials]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: 'fit-content', margin: '0 auto'}}>
          <SquareSelector
            selected={exists('facebook')}
            item="facebook"
            label="Facebook"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={exists('whatsapp')}
            item="whatsapp"
            label="Whatsapp"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={exists('twitter')}
            item="twitter"
            label="Twitter"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={exists('instagram')}
            item="instagram"
            label="Instagram"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={exists('youtube')}
            item="youtube"
            label="YouTube"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={exists('linkedin')}
            item="linkedin"
            label="LinkedIn"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={exists('pinterest')}
            item="pinterest"
            label="Pinterest"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={exists('telegram')}
            item="telegram"
            label="Telegram"
            handleSelection={handleSelection}/>
        </Box>
      </Grid>
      {renderSocialNetworks()}
    </Grid>
  );
}

export default RenderSocials;

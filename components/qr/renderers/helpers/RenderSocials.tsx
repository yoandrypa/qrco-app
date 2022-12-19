import {ChangeEvent, useCallback, useRef} from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {capitalize} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import RenderIcon from "../../helperComponents/smallpieces/RenderIcon";
import {DataType, SocialNetworksType, SocialsType} from "../../types/types";
import {PHONE} from "../../constants";
import SectionSelector from "../../helperComponents/SectionSelector";

import dynamic from "next/dynamic";

const RenderTitleDesc = dynamic(() => import("./RenderTitleDesc"));

interface RenderSocialsProps {
  data: DataType;
  setData: Function;
  showTitleAndDesc?: boolean;
}

const RenderSocials = ({data, setData, showTitleAndDesc}: RenderSocialsProps) => {
  const selection = useRef<SocialsType | null>(null);
  const errorDetected = useRef(false);

  const handleValues = (item: SocialsType) => (event: ChangeEvent<HTMLInputElement>) => {
    setData((prev: DataType) => {
      const tempo = {...prev};
      // data.about aims to the description for reusing the same predefined type

      if (['title', 'about'].includes(item)) { // @ts-ignore
        tempo[item] = event.target.value;
      }
      if (tempo.socials) {
        const network = tempo.socials.find((x: SocialNetworksType) => x.network === item);
        if (network) {
          network.value = event.target.value;
        }
      }
      return tempo;
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
  }, [data?.socials?.length || 0]); // eslint-disable-line react-hooks/exhaustive-deps

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
  ), [data?.socials?.length || 0]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid container spacing={1}>
      {showTitleAndDesc && (
        <Grid item xs={12}>
          <RenderTitleDesc handleValues={handleValues} title={data.title} description={data.about} />
        </Grid>
      )}
      <Grid item xs={12}>
        <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: 'fit-content', margin: '0 auto'}}>
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="facebook" selected={exists('facebook')}
            handleSelect={handleSelection} tooltip="Facebook" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="whatsapp" selected={exists('whatsapp')}
            handleSelect={handleSelection} tooltip="Whatsapp" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="twitter" selected={exists('twitter')}
            handleSelect={handleSelection} tooltip="Twitter" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="instagram" selected={exists('instagram')}
            handleSelect={handleSelection} tooltip="Instagram" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="youtube" selected={exists('youtube')}
            handleSelect={handleSelection} tooltip="YouTube" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="linkedin" selected={exists('linkedin')}
            handleSelect={handleSelection} tooltip="LinkedIn" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="pinterest" selected={exists('pinterest')}
            handleSelect={handleSelection} tooltip="Pinterest" />
          <SectionSelector
            icon="_" separate h='50px' w='55px' mw='55px' property="telegram" selected={exists('telegram')}
            handleSelect={handleSelection} tooltip="Telegram" />
        </Box>
      </Grid>
      {renderSocialNetworks()}
    </Grid>
  );
}

export default RenderSocials;

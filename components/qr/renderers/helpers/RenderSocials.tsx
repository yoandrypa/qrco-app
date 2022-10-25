import {ChangeEvent, useCallback, useMemo, useRef} from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SquareSelector from "../../helperComponents/SquareSelector";
import TextField from "@mui/material/TextField";
import {capitalize} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import RenderIcon from "../../helperComponents/RenderIcon";
import {SocialProps, SocialsType} from "../../types/types";
import {PHONE, SOCIALS} from "../../constants";

interface RenderSocialsProps {
  data: SocialProps;
  setData: Function;
  isWrong?: boolean;
  setIsWrong?: (isWrong: boolean) => void;
}

const RenderSocials = ({data, isWrong, setData, setIsWrong}: RenderSocialsProps) => {
  const selection = useRef<SocialsType | null>(null);

  const handleValues = (item: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setData((prev: SocialProps) => ({...prev, [item]: event.target.value}));
  };

  const amount = useMemo(() => {
    return Object.keys(data || {}).filter((x: string) => SOCIALS.includes(x)).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.facebook, data?.whatsapp, data?.twitter, data?.instagram, data?.linkedin, data?.pinterest, data?.telegram, data?.youtube]);

  const columns = useMemo(() => {
    switch (amount) {
      case 1: {
        return 12;
      }
      case 2:
      case 4: {
        return 6;
      }
      default: {
        return 4;
      }
    }
  }, [amount]);

  const renderSocial = (item: SocialsType) => {
    if (data[item] !== undefined) {
      let isError = !data[item]?.length;

      if (item === 'whatsapp' && !isError && !PHONE.test(data[item] || '')) {
        isError = true;
      }

      if (setIsWrong !== undefined && !isWrong) {
        setIsWrong(isError);
      }

      return (
        <TextField
          label={capitalize(item)}
          autoFocus={item === selection.current}
          size="small"
          fullWidth
          placeholder={`Enter just your ${item !== 'whatsapp' ? 'username' : 'cell number'}`}
          margin="dense"
          value={data?.[item] || ''}
          onChange={handleValues(item)}
          error={isError}
          InputProps={{
            startAdornment: <InputAdornment position="start"><RenderIcon icon={item} enabled/></InputAdornment>
          }}
        />
      );
    }
    return null;
  };

  const renderSocialNetworks = useCallback(() => {
    // @ts-ignore
    return Object.keys(data || {}).filter((x: string) => SOCIALS.includes(x)).map((x: SocialsType) => (
      <Grid item xs={12} sm={columns} style={{paddingTop: 0}} key={`socialnetwork${x}`}>
        {renderSocial(x)}
      </Grid>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.facebook, data?.whatsapp, data?.twitter, data?.instagram, data?.linkedin, data?.pinterest, data?.telegram, data?.youtube]);

  const handleSelection = (item: SocialsType) => {
    selection.current = item;
    setData((prev: SocialProps) => {
      const temp = {...prev};
      if (temp[item] === undefined) {
        temp[item] = '';
      } else {
        delete temp[item];
      }
      return temp;
    });
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: 'fit-content', margin: '0 auto'}}>
          <SquareSelector
            selected={data.facebook !== undefined}
            item="facebook"
            label="Facebook"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.whatsapp !== undefined}
            item="whatsapp"
            label="Whatsapp"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.twitter !== undefined}
            item="twitter"
            label="Twitter"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.instagram !== undefined}
            item="instagram"
            label="Instagram"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.youtube !== undefined}
            item="youtube"
            label="YouTube"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.linkedin !== undefined}
            item="linkedin"
            label="LinkedIn"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.pinterest !== undefined}
            item="pinterest"
            label="Pinterest"
            handleSelection={handleSelection}/>
          <SquareSelector
            selected={data.telegram !== undefined}
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

import {ChangeEvent, useEffect, useMemo} from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SquareSelector from "../../helperComponents/SquareSelector";
import TextField from "@mui/material/TextField";
import {capitalize} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import RenderIcon from "../../helperComponents/RenderIcon";
import {SocialProps} from "../../types/types";
import {PHONE, SOCIALS} from "../../constants";

interface RenderSocialsProps {
  data: SocialProps;
  setData: Function;
  setIsWrong?: (isWrong: boolean) => void;
}

const RenderSocials = ({data, setData, setIsWrong}: RenderSocialsProps) => {
  const handleValues = (item: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setData((prev: SocialProps) => ({...prev, [item]: event.target.value}));
  };

  const amount = useMemo(() => {
    return Object.keys(data || {}).filter((x: string) => SOCIALS.includes(x)).length;
  }, [
    data?.facebook,
    data?.whatsapp,
    data?.twitter,
    data?.instagram,
    data?.linkedin,
    data?.pinterest,
    data?.telegram,
    data?.youtube
  ]);

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

  useEffect(() => {
    if (setIsWrong !== undefined) {
      setIsWrong(amount === 0);
    }
  }, [amount]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderSocial = (item: string) => {
    // @ts-ignore
    if (data[item] !== undefined) {
      // @ts-ignore
      let isError = !data[item].length;

      // @ts-ignore
      if (item === 'whatsapp' && !isError && !PHONE.test(data[item])) {
        isError = true;
      }

      return (<Grid item xs={12} sm={columns} style={{paddingTop: 0}}>
        <TextField
          label={capitalize(item)}
          size="small"
          fullWidth
          placeholder={`Enter just your ${item !== 'whatsapp' ? 'username' : 'cell number'}`}
          margin="dense"
          // @ts-ignore
          value={data?.[item] || ''}
          // @ts-ignore
          onChange={handleValues(item)}
          error={isError}
          InputProps={{
            startAdornment: <InputAdornment position="start"><RenderIcon icon={item} enabled/></InputAdornment>
          }}
        />
      </Grid>);
    }
    return null;
  };

  const handleSelection = (item: string) => {
    // @ts-ignore
    if (data[item] === undefined) {
      setData((prev: SocialProps) => ({...prev, [item]: ''}));
    } else {
      setData((prev: SocialProps) => {
        const temp = {...prev};
        // @ts-ignore
        delete temp[item];
        return temp;
      });
    }
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
      {renderSocial('facebook')}
      {renderSocial('whatsapp')}
      {renderSocial('twitter')}
      {renderSocial('instagram')}
      {renderSocial('youtube')}
      {renderSocial('linkedin')}
      {renderSocial('pinterest')}
      {renderSocial('telegram')}
    </Grid>
  );
}

export default RenderSocials;

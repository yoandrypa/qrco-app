import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import {DataType} from "../../types/types";
import {ZIP} from "../../constants";
import RenderTextFields from "../helpers/RenderTextFields";
import Topics from "../helpers/Topics";

interface AddressProps {
  data: DataType;
  message?: string;
  handleValues: Function;
}

export default function RenderAddressData({data, handleValues, message}: AddressProps) {
  const renderItem = (item: string, label: string) => { // @ts-ignore
    const value = data?.[item] || '' as string;
    return (
      <RenderTextFields item={item} label={label} isError={item === 'zip' && value.length && !ZIP.test(value)}
                        value={value} handleValues={handleValues} />
    );
  };

  return (
    <Box sx={{width: '100%'}}>
      {message && <Topics message={message}/>}
      <Grid container spacing={1}>
        <Grid item xs={12} style={{paddingTop: 0}}>
          {renderItem('address', 'Address')}
        </Grid>
        <Grid item sm={8} xs={12} style={{paddingTop: 0}}>
          {renderItem('address2', 'Address 2')}
        </Grid>
        <Grid item sm={4} xs={6} style={{paddingTop: 0}}>
          {renderItem('city', 'City')}
        </Grid>
        <Grid item sm={4} xs={6} style={{paddingTop: 0}}>
          {renderItem('zip', 'Zip code')}
        </Grid>
        <Grid item sm={4} xs={6} style={{paddingTop: 0}}>
          {renderItem('state', 'State/Province')}
        </Grid>
        <Grid item sm={4} xs={6} style={{paddingTop: 0}}>
          {renderItem('country', 'Country')}
        </Grid>
      </Grid>
    </Box>
  )
}

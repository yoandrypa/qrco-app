import {ChangeEvent} from "react";
import Box from "@mui/material/Box";
import Topics from "../helpers/Topics";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";

import RenderTextFields from "../helpers/RenderTextFields";
import {ContentProps} from "../custom/helperFuncs";

import dynamic from "next/dynamic";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const RenderPhones = dynamic(() => import("./RenderPhones"));
const RenderEmail = dynamic(() => import("./RenderEmail"));
const RenderAddressData = dynamic(() => import("./RenderAddressData"));
const Paper = dynamic(() => import("@mui/material/Paper"));

interface PresentationProps extends ContentProps {
  message?: string;
  showExtra?: boolean;
}

export default function RenderPresentation({data, handleValues, message, index, showExtra}: PresentationProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
    handleValues(item, index)(payload);
  };

  const renderItem = (item: string, label: string) => { // @ts-ignore
    const value = data?.[item] || '' as string;
    return <RenderTextFields
      item={item} label={label} value={value} handleValues={beforeSend} required={item === 'firstName'} index={index}/>;
  };

  return (
    <Box sx={{width: '100%'}}>
      {message && <Topics message={message}/>}
      <Grid container spacing={1}>
        <Grid item sm={2} xs={12} style={{paddingTop: 0}}>
          {renderItem('prefix', 'Prefix')}
        </Grid>
        <Grid item sm={5} xs={12} style={{paddingTop: 0}}>
          {renderItem('firstName', 'First name')}
        </Grid>
        <Grid item sm={5} xs={12} style={{paddingTop: 0}}>
          {renderItem('lastName', 'Last name')}
        </Grid>
        {data?.includeExtraInfo && (
          <Grid item xs={12}>
            <Paper sx={{p: 2}} elevation={3}>
              <RenderPhones index={index} handleValues={handleValues} data={data}/>
              <RenderEmail index={index} handleValues={handleValues} data={data}/>
              <Box sx={{mt: 1}}>
                <RenderAddressData index={index} handleValues={handleValues} data={data}/>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
      {showExtra && (
        <Tooltip title="Includes phone numbers, email and address" disableHoverListener={Boolean(data?.includeExtraInfo)}>
          <FormControlLabel label="Include extra information" control={
            <Switch checked={Boolean(data?.includeExtraInfo)} inputProps={{'aria-label': 'includeExtraInfo'}}
                    onChange={beforeSend('includeExtraInfo')}/>}
          />
        </Tooltip>
      )}
    </Box>
  );
}

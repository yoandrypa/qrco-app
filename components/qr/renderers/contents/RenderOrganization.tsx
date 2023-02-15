import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import RenderTextFields from "../helpers/RenderTextFields";
import {ChangeEvent} from "react";
import {ContentProps} from "../custom/helperFuncs";
import Topics from "../helpers/Topics";

interface OrganizationProps extends ContentProps {
  message?: string;
}

export default function RenderOrganization({data, handleValues, index, message}: OrganizationProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
    handleValues(item, index)(payload);
  };

  const renderItem = (item: string, label: string) => ( // @ts-ignore
    <RenderTextFields item={item} label={label} value={data?.[item] || ''} handleValues={beforeSend}/>
  );

  return (
    <Box sx={{width: '100%'}}>
      {message && <Topics message={message}/>}
      <Grid container spacing={1}>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('organization', 'Organization')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('position', 'Position')}
        </Grid>
      </Grid>
    </Box>
  );
}

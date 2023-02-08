import Box from "@mui/material/Box";
import Topics from "../helpers/Topics";
import Grid from "@mui/material/Grid";
import {Type} from "../../types/types";
import RenderTextFields from "../helpers/RenderTextFields";
import {ChangeEvent} from "react";

interface RenderOrganizationProps {
  index: number;
  data?: Type;
  handleValues: Function;
  message?: string;
}

export default function RenderOrganization({data, handleValues, message, index}: RenderOrganizationProps) {
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

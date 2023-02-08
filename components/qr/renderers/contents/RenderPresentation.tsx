import Box from "@mui/material/Box";
import Topics from "../helpers/Topics";
import Grid from "@mui/material/Grid";
import {Type} from "../../types/types";
import RenderTextFields from "../helpers/RenderTextFields";
import {ChangeEvent} from "react";

interface RenderPersonPresentarionProps {
  index: number;
  data?: Type;
  handleValues: Function;
  message?: string;
}

export default function RenderPresentation({data, handleValues, message, index}: RenderPersonPresentarionProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
    handleValues(item, index)(payload);
  };

  const renderItem = (item: string, label: string) => { // @ts-ignore
    const value = data?.[item] || '' as string;
    return <RenderTextFields
      item={item} label={label} value={value} handleValues={beforeSend} required={item === 'firstName'} />;
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
      </Grid>
    </Box>
  );
}

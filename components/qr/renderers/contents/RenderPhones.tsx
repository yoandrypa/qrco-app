import Box from "@mui/material/Box";
import Topics from "../helpers/Topics";
import Grid from "@mui/material/Grid";
import {Type} from "../../types/types";
import {PHONE} from "../../constants";
import RenderTextFields from "../helpers/RenderTextFields";
import {ChangeEvent} from "react";

interface RenderPhonesProps {
  index: number;
  data?: Type;
  handleValues: Function;
  isCompany?: boolean;
  message?: string;
}

export default function RenderPhones({data, handleValues, message, isCompany, index}: RenderPhonesProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
    handleValues(item, index)(payload);
  }

  const renderItem = (item: string, label: string) => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[item] || '' as string;

    if (value.trim().length && !PHONE.test(value)) {
      isError = true;
    }

    return <RenderTextFields item={item} label={label} isError={isError} value={value} handleValues={beforeSend}/>;
  };

  return (
    <Box sx={{width: '100%'}}>
      {message && <Topics message={message}/>}
      <Grid container spacing={1}>
        <Grid item sm={4} xs={12} style={{paddingTop: 0}}>
          {renderItem(!isCompany ? 'cell' : 'companyCell', 'Cell number')}
        </Grid>
        <Grid item sm={4} xs={12} style={{paddingTop: 0}}>
          {renderItem(!isCompany ? 'phone' : 'companyPhone', `${!isCompany ? 'Alternative p' : 'P'}hone number`)}
        </Grid>
        <Grid item sm={4} xs={12} style={{paddingTop: 0}}>
          {renderItem(!isCompany ? 'fax' : 'companyFax', 'Fax')}
        </Grid>
      </Grid>
    </Box>
  );
}

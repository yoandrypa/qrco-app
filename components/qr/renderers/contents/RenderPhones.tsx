import Box from "@mui/material/Box";
import Topics from "../helpers/Topics";
import Grid from "@mui/material/Grid";
import {DataType} from "../../types/types";
import {PHONE} from "../../constants";
import RenderTextFields from "../helpers/RenderTextFields";

interface RenderPhonesProps {
  data: DataType;
  handleValues: Function;
  isCompany?: boolean;
  message?: string;
}

export default function RenderPhones({data, handleValues, message, isCompany}: RenderPhonesProps) {
  const renderItem = (item: string, label: string) => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[item] || '' as string;

    if (value.trim().length && !PHONE.test(value)) {
      isError = true;
    }

    return <RenderTextFields item={item} label={label} isError={isError} value={value} handleValues={handleValues}/>;
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

import Box from "@mui/material/Box";
import Topics from "../helpers/Topics";
import Grid from "@mui/material/Grid";
import {DataType} from "../../types/types";
import {PHONE} from "../../constants";
import RenderTextFields from "../helpers/RenderTextFields";

interface RenderPhonesProps {
  data: DataType;
  handleValues: Function;
  message?: string;
}

export default function RenderPhones({data, handleValues, message}: RenderPhonesProps) {
  const renderItem = (item: string, label: string) => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[item] || '' as string;

    if (value.trim().length) {
      if (['phone', 'fax'].includes(item) && !PHONE.test(value)) {
        isError = true;
      } else if (item === 'cell' && !PHONE.test(value)) {
        isError = true;
      }
    }

    return <RenderTextFields item={item} label={label} isError={isError} value={value} handleValues={handleValues}/>;
  };

  return (
    <Box sx={{width: '100%'}}>
      {message && <Topics message={message}/>}
      <Grid container spacing={1}>
        <Grid item sm={4} xs={12} style={{paddingTop: 0}}>
          {renderItem('cell', 'Cell number')}
        </Grid>
        <Grid item sm={4} xs={12} style={{paddingTop: 0}}>
          {renderItem('phone', 'Alternative phone number')}
        </Grid>
        <Grid item sm={4} xs={12} style={{paddingTop: 0}}>
          {renderItem('fax', 'Fax')}
        </Grid>
      </Grid>
      <Topics message={'Organization'}/>
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

import Box from "@mui/material/Box";
import Topics from "../helpers/Topics";
import Grid from "@mui/material/Grid";
import {DataType} from "../../types/types";
import RenderTextFields from "../helpers/RenderTextFields";

interface RenderPersonPresentarionProps {
  data: DataType;
  handleValues: Function;
  message?: string;
}

export default function RenderPresentation({data, handleValues, message}: RenderPersonPresentarionProps) {
  const renderItem = (item: string, label: string) => { // @ts-ignore
    const value = data?.[item] || '' as string;
    return <RenderTextFields item={item} label={label} value={value} handleValues={handleValues}
                             required={item === 'firstName'}/>;
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

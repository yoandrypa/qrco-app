import Box from "@mui/material/Box";
import Topics from "../helpers/Topics";
import Grid from "@mui/material/Grid";
import {DataType} from "../../types/types";
import {EMAIL, PHONE} from "../../constants";
import RenderTextFields from "../helpers/RenderTextFields";
import {isValidUrl} from "../../../../utils";

interface RenderEmailWebProps {
  data: DataType;
  sx?: Object;
  handleValues: Function;
  message?: string;
}

export default function RenderEmailWeb({data, handleValues, message, sx}: RenderEmailWebProps) {
  const renderItem = (item: string, label: string) => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[item] || '' as string;

    if (value.trim().length) {
      if (item === 'web' && !isValidUrl(value)) {
        isError = true;
      } else if (item === 'email' && !EMAIL.test(value)) {
        isError = true;
      }
    }

    return <RenderTextFields item={item} label={label} isError={isError} value={value} handleValues={handleValues}/>;
  };

  return (
    <Box sx={{width: '100%', ...sx}}>
      {message && <Topics message={message}/>}
      <Grid container spacing={1}>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('email', 'Email')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('web', 'Web')}
        </Grid>
      </Grid>
    </Box>
  );
}

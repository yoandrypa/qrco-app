import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {ChangeEvent} from "react";

interface AsButtonProps {
  extras?: any;
  sendData: Function;
  message: string;
  item: string;
  mt?: string;
}

export default function RenderAsButton({extras, sendData, message, item, mt}: AsButtonProps) {
  return (
    <>
      <FormControl sx={{mt: mt || '-10px', ml: '5px'}}>
        <FormControlLabel control={<Switch
          onChange={(event: ChangeEvent<HTMLInputElement>) => sendData(`extras.${item}`)(event.target.checked)}
          checked={extras?.[item] || false} size="small" />} label={message} />
      </FormControl>
      {extras?.[item] && (
        <FormControl sx={{mt: mt || '-10px', ml: '5px'}}>
          <FormControlLabel control={<Switch
            onChange={(event: ChangeEvent<HTMLInputElement>) => sendData(`extras.${item}Icon`)(event.target.checked)}
            checked={extras?.[`${item}Icon`] || false} size="small"/>} label="Show icons in buttons"/>
        </FormControl>
      )}
    </>
  );
}

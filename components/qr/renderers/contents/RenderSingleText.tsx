import RenderTextFields from "../helpers/RenderTextFields";
import {ChangeEvent} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

interface SingleTextProps {
  includeTextDescription?: boolean;
  text: string;
  index: number;
  handleValues: Function;
}

export default function RenderSingleText({text, handleValues, index, includeTextDescription}: SingleTextProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
    handleValues(item, index)(payload);
  };

  const setValue = (event: ChangeEvent<HTMLInputElement>) => {
    beforeSend('includeTextDescription')(event.target.checked);
  };

  return (
    <>
      <RenderTextFields item="text" label="" value={text} handleValues={beforeSend} multiline index={index} />
      <FormControlLabel label="Include section description" control={
        <Switch checked={includeTextDescription || false} inputProps={{'aria-label': 'textDescription'}} onChange={setValue}/>}
      />
    </>
  );
}

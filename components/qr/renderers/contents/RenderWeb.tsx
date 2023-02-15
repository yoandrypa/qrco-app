import Box from "@mui/material/Box";
import RenderTextFields from "../helpers/RenderTextFields";
import {ChangeEvent} from "react";
import {ContentProps} from "../custom/helperFuncs";
import {isValidUrl} from "../../../../utils";

interface RenderEmail extends ContentProps {
  sx?: Object;
}

export default function RenderWeb({data, handleValues, sx, index}: RenderEmail) {
  const renderItem = () => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.web || '' as string;

    if (value.trim().length && !isValidUrl(value)) {
      isError = true;
    }

    const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
      handleValues(item, index)(payload);
    }

    return <RenderTextFields item="web" label="Web" isError={isError} value={value} handleValues={beforeSend} index={index}/>;
  };

  return (
    <Box sx={{width: '100%', ...sx}}>
      {renderItem()}
    </Box>
  );
}

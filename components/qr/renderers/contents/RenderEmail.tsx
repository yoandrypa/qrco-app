import Box from "@mui/material/Box";
import {EMAIL} from "../../constants";
import RenderTextFields from "../helpers/RenderTextFields";
import {ChangeEvent} from "react";
import {ContentProps} from "../custom/helperFuncs";

interface RenderEmail extends ContentProps {
  sx?: Object;
}

export default function RenderEmail({data, handleValues, sx, index}: RenderEmail) {
  const renderItem = () => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.email || '' as string;

    if (value.trim().length && !EMAIL.test(value)) {
      isError = true;
    }

    const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
      handleValues(item, index)(payload);
    }

    return <RenderTextFields item="email" label="Email" isError={isError} value={value} handleValues={beforeSend} index={index}/>;
  };

  return (
    <Box sx={{width: '100%', ...sx}}>
      {renderItem()}
    </Box>
  );
}

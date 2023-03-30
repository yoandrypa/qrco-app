import Box from "@mui/material/Box";
import RenderTextFields from "../helpers/RenderTextFields";
import {ChangeEvent} from "react";
import {ContentProps} from "../custom/helperFuncs";
import {isValidUrl} from "../../../../utils";

import dynamic from 'next/dynamic';

const RenderAsButton = dynamic(() => import("../../helperComponents/smallpieces/RenderAsButton"));

interface RenderEmail extends ContentProps {
  sx?: Object;
  isCompany?: boolean;
  item?: string;
}

export default function RenderWeb({data, handleValues, sx, index, isCompany, item}: RenderEmail) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    handleValues(item, index)(payload);
  }

  const renderItem = () => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[!isCompany ? 'web' : 'companyWebSite'] || '' as string;

    if (value.trim().length && !isValidUrl(value)) {
      isError = true;
    }

    return (
      <RenderTextFields
        item={!isCompany ? 'web' : 'companyWebSite'}
        label={!isCompany ? 'Web' : 'Website'}
        isError={isError}
        value={value}
        handleValues={beforeSend}
        options={data?.extras?.[item || 'webButton']} // @ts-ignore
        customValue={data?.[`${!isCompany ? 'web' : 'companyWebSite'}_Custom`] || ''}
        index={index}
      />);
  };

  return (
    <Box sx={{width: '100%', ...sx}}>
      {renderItem()}
      {item === undefined && (
        <RenderAsButton
          sendData={beforeSend}
          message="Web as button"
          extras={data?.extras}
          item="webButton"
          mt="0"
        />
      )}
    </Box>
  );
}

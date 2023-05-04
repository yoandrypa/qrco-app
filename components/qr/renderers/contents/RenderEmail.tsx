import Box from "@mui/material/Box";
import {EMAIL} from "../../constants";
import RenderTextFields from "../helpers/RenderTextFields";
import {ChangeEvent} from "react";
import {ContentProps} from "../custom/helperFuncs";

import dynamic from 'next/dynamic';

const RenderAsButton = dynamic(() => import("../../helperComponents/smallpieces/RenderAsButton"));

interface RenderEmail extends ContentProps {
  sx?: Object;
  isCompany?: boolean;
  item?: string;
}

export default function RenderEmail({data, handleValues, sx, index, isCompany, item}: RenderEmail) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    handleValues(item, index)(payload);
  }

  const renderItem = () => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[!isCompany ? 'email' : 'companyEmail'] || '' as string;

    if (value.trim().length && !EMAIL.test(value)) {
      isError = true;
    }

    return (
      <RenderTextFields
        item={!isCompany ? 'email' : 'companyEmail'}
        label={!isCompany ? 'Email' : 'Company email'}
        isError={isError}
        value={value} // @ts-ignore
        customValue={data?.[`${!isCompany ? 'email' : 'companyEmail'}_Custom`] || ''}
        options={data?.extras?.[item || 'emailButton']}
        handleValues={beforeSend}
        index={index}/>
    );
  };

  return (
    <Box sx={{width: '100%', ...sx}}>
      {renderItem()}
      {item === undefined && (
        <RenderAsButton
          sendData={beforeSend}
          message="Email as button"
          extras={data?.extras}
          item="emailButton"
          mt="0"
        />
      )}
    </Box>
  );
}

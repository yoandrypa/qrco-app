import Grid from "@mui/material/Grid";
import {isValidUrl} from "../../../../utils";
import RenderProposalsTextFields from "../helpers/RenderProposalsTextFields";
import RenderTextFields from "../helpers/RenderTextFields";
import {ContentProps} from "../custom/helperFuncs";
import Box from "@mui/material/Box";
import {ChangeEvent} from "react";

export default function RenderCouponInfo({data, handleValues, index}: ContentProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    handleValues(item, index)(payload);
  }

  const renderItem = (item: string, label: string, required?: boolean, placeholder?: string) => {
    let isError = false as boolean;
    // @ts-ignore
    const value = data?.[item] || '' as string;

    // @ts-ignore
    if (data[item] !== undefined && (item === 'urlOptionLink' && !isValidUrl(value))) {
      isError = true;
    }

    if (['badge', 'urlOptionLabel'].includes(item)) {
      return (<RenderProposalsTextFields
        options={item === 'badge' ? ['Get coupon', '10% off', 'Get for free'] : ['Shop online', 'Buy online', 'Get a discount', 'Buy & get a discount']}
        value={value}
        item={item}
        required={required}
        label={label}
        placeholder={placeholder}
        isError={isError}
        handleValues={beforeSend}
      />);
    }

    return (
      <RenderTextFields
        handleValues={beforeSend}
        value={value}
        item={item}
        label={label}
        placeholder={placeholder}
        multiline={item === 'description'}
        isError={isError}
        required={required}
      />
    );
  };

  return (
    <Box sx={{width: '100%'}}>
      <Grid container spacing={1}>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('company', 'Company')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('title', 'Title', true)}
        </Grid>
        <Grid item xs={12} style={{paddingTop: 0}}>
          {renderItem('description', 'Description')}
        </Grid>
        <Grid item xs={12} style={{paddingTop: 0}}>
          {renderItem('badge', 'Badge')}
        </Grid>
        <Grid item xs={6} style={{paddingTop: 0}}>
          {renderItem('urlOptionLabel', 'Button text', true)}
        </Grid>
        <Grid item xs={6} style={{paddingTop: 0}}>
          {renderItem('urlOptionLink', 'Link', true)}
        </Grid>
      </Grid>
    </Box>
  );
}

import {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import Common from '../helperComponents/Common';
import {DataType} from "../types/types";
import Expander from "./helpers/Expander";

import RenderDateSelector from "./helpers/RenderDateSelector";
import {isValidUrl} from "../../../utils";

import {ZIP} from "../constants";
import RenderTextFields from "./helpers/RenderTextFields";
import Topics from "./helpers/Topics";
import socialsAreValid from "./validator";
import RenderProposalsTextFields from "./helpers/RenderProposalsTextFields";

type CouponProps = {
  data: DataType;
  setData: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

const CouponData = ({data, setData, handleValues, setIsWrong}: CouponProps) => {
  const [expander, setExpander] = useState<string | null>(null);

  const renderItem = (item: string, label: string, required?: boolean, placeholder?: string) => {
    let isError = false as boolean;
    // @ts-ignore
    const value = data?.[item] || '' as string;

    // @ts-ignore
    if (data[item] !== undefined  && (item === 'zip' && !ZIP.test(value) || (item === 'urlOptionLink' && !isValidUrl(value)))) {
      isError = true;
    }

    if (['prefix', 'urlOptionLabel'].includes(item)) {
      return (<RenderProposalsTextFields
        options={item === 'prefix' ? ['Get coupon', '10% off', 'Get for free'] : ['Shop online', 'Buy online', 'Get a discount', 'Buy & get a discount']}
        value={value}
        item={item}
        label={label}
        placeholder={placeholder}
        isError={isError}
        handleValues={handleValues}
      />);
    }

    return (
      <RenderTextFields
        handleValues={handleValues}
        value={value}
        item={item}
        label={label}
        placeholder={placeholder}
        isError={isError}
        required={required}
      />
    );
  };

  useEffect(() => {
    let errors = false;
    if (!data.urlOptionLabel?.trim().length || !data.urlOptionLink?.trim().length ||
      !isValidUrl(data.urlOptionLink) || !data.title?.trim().length || !data.name?.trim().length ||
      (data.zip?.trim && !ZIP.test(data.zip)) || !socialsAreValid(data)) {
      errors = true;
    }
    setIsWrong(errors);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // the date goes to the field value

  return (
    <Common msg="Share a coupon.">
      <Topics message={'Offer information'} />
      <Grid container spacing={1}>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('company', 'Company')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('title', 'Title', true)}
        </Grid>
        <Grid item xs={12} style={{paddingTop: 0}}>
          {renderItem('about', 'Description')}
        </Grid>
        <Grid item xs={12} style={{paddingTop: 0}}>
          {renderItem('prefix', 'Badge')}
        </Grid>
        <Grid item xs={6} style={{paddingTop: 0}}>
          {renderItem('urlOptionLabel', 'Button text', true)}
        </Grid>
        <Grid item xs={6} style={{paddingTop: 0}}>
          {renderItem('urlOptionLink', 'Link', true)}
        </Grid>
      </Grid>
      <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
        <Expander expand={expander} setExpand={setExpander} item="coupon" title="Coupon data *" required={!data?.name?.length} />
        {expander === "coupon" && (
          <Grid container spacing={1}>
            <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
              {renderItem('name', 'Coupon code', true)}
            </Grid>
            <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
              <RenderDateSelector data={data} setData={setData} label="Valid until" />
            </Grid>
            <Grid item xs={12} style={{paddingTop: 0}}>
              {renderItem('text', 'Terms and conditions')}
            </Grid>
          </Grid>
        )}
      </Paper>
      <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
        <Expander expand={expander} setExpand={setExpander} item="address" title="Address" />
        {expander === "address" && (
          <Grid container spacing={1}>
            <Grid item sm={8} xs={12} style={{paddingTop: 0}}>
              {renderItem('address', 'Address')}
            </Grid>
            <Grid item sm={4} xs={6} style={{paddingTop: 0}}>
              {renderItem('city', 'City')}
            </Grid>
            <Grid item sm={4} xs={6} style={{paddingTop: 0}}>
              {renderItem('zip', 'Zip code')}
            </Grid>
            <Grid item sm={4} xs={6} style={{paddingTop: 0}}>
              {renderItem('state', 'State/Province')}
            </Grid>
            <Grid item sm={4} xs={6} style={{paddingTop: 0}}>
              {renderItem('country', 'Country')}
            </Grid>
          </Grid>
        )}
      </Paper>
    </Common>
  );
}

export default CouponData;

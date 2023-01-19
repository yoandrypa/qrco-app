import { useMemo, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

import Common from '../helperComponents/Common';

import RenderSocials from './contents/RenderSocials';
import Expander from './helpers/Expander';
import { DataType } from '../types/types';
import Topics from './helpers/Topics';
import socialsAreValid from './validator';
import MultipleField from '../helperComponents/MultipleField';
import RenderSelectField from './helpers/RenderSelectField';
import RenderPresentation from './contents/RenderPresentation';
import RenderAddressData from './contents/RenderAddressData';
import RenderContactForm from '../helperComponents/smallpieces/RenderContactForm';
//@ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage";
import RenderProduct from './contents/RenderProduct';

interface InventoryDataProps {
  data: DataType;
  handlePayload: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

interface RenderType {
  key: 'otherDetails' | 'urls';
}

export default function InventoryData({
  data,
  handlePayload,
  handleValues,
  setIsWrong
}: InventoryDataProps) {
  const [expander, setExpander] = useState<string | null>(null);
  const { currentAccount } = session;
  const isDynamic = useMemo(() => Boolean(data?.isDynamic), []) as boolean; // eslint-disable-line react-hooks/exhaustive-deps
  
  const renderSelectItem = (item: string, label: string, options: {value: string, label: string}[], whatSave?:'label'|'value' ) => {
    let isError = false as boolean;
    // @ts-ignore
    const value = data?.[item] || ('' as string);

    return (<RenderSelectField item={item} label={label} isError={isError} value={value} handleValues={handleValues} options={options} whatSave={whatSave} /> )
  }

  const checkData = () => { 
    let band = false;
    if (!data?.firstName?.trim().length)
      band = true;

    return band;
  };
  useEffect(() => {
    let errors = false;
    if (checkData()) {
      errors = true;
    } else if (isDynamic) {
      errors = !socialsAreValid(data);
    }
    setIsWrong(errors);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg="Inventory tracking information">
      <Topics message={'Product Details'} />
      <Grid container spacing={1} sx={{mt:1}}>
        <RenderProduct data={data} handleValues={handleValues} />
        {/* <RenderPresentation data={data} handleValues={handleValues} /> */}
      </Grid>
      <Topics message={'Location'} />
      <Grid container spacing={1} sx={{mt:1}}>
        {/* <RenderAddressData data={data} handleValues={handleValues} /> */}
      </Grid>
      
    </Common>
  );
}

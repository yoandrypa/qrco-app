import { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Common from '../helperComponents/Common';
import { DataType } from '../types/types';
import Topics from './helpers/Topics';
import MultipleField from '../helperComponents/MultipleField';
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
  const dataRef = useRef<DataType>(data);
  const checkData = () => {
    let band = false;
    if (!data?.firstName?.trim().length)
      band = true;

    return band;
  };
  useEffect(() => {
    let errors = false;
    dataRef.current = {...data, ...dataRef.current};
    // if (checkData()) {
    //   errors = true;
    // } else if (isDynamic) {
    //   errors = !socialsAreValid(data);
    // }
    setIsWrong(errors);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg="Inventory tracking information">
      <Topics message={'Product Details'} />
      <Grid container spacing={1} sx={{mt:1}}>
        <RenderProduct dataRef={dataRef} handleValues={handlePayload} />
      </Grid>
      <Topics message={'Location'} />
      <Grid container spacing={1} sx={{mt:1}}>
        <MultipleField item={{ key: 'otherDetails', label: 'Location', type: 'string', requireLabel: true, requireValue: true }}/>
      </Grid>

    </Common>
  );
}

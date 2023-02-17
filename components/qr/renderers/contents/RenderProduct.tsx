import {Box, Button, ButtonGroup, Grid} from '@mui/material';
import Topics from '../helpers/Topics';
import RenderTitleDesc from './RenderTitleDesc';
import {ChangeEvent} from 'react';
import {ALLOWED_FILE_EXTENSIONS, FILE_LIMITS} from '../../../../consts';
import {conjunctMethods, toBytes} from '../../../../utils';
import FileUpload from 'react-material-file-upload';
import RenderTextFields from '../helpers/RenderTextFields';

interface RenderProductProps {
  dataRef: any;
  handleValues: Function;
}

export default function RenderProduct({
  dataRef,
  handleValues
}: RenderProductProps) {
  const handleChange = (files: File[]) => {
    if (!dataRef.current?.files || files.length === 0) {
      const newData = { ...dataRef.current, files: files};
      dataRef.current = newData
      handleValues(newData);
      // handleValues({ ...data, picture:files });
      return;
    }

    const isSameFile = (uploadedFile: File, fileToUpload: File) => {
      return (
        uploadedFile.name === fileToUpload.name &&
        uploadedFile.lastModified === fileToUpload.lastModified
      );
    };
    const A = dataRef.current.files;
    const B = files;
    let C = conjunctMethods.intersection(A, B, isSameFile);
    if (C.length === 0) {
      C = A.concat(B);
    }
    const newData = { ...dataRef.current, files:C};
    dataRef.current = newData
    handleValues(newData);
  };
  //@ts-ignore
  const handleValuesText = (item: string) =>
  (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {

    const value =
      typeof payload === 'string' || typeof payload === 'boolean'
        ? payload
        : payload.target.value;

    const newData = {
      ...dataRef.current,
      product: { ...dataRef.current.product }
    }
    //@ts-ignore
    newData.product[item] = value;
    dataRef.current =  newData
    handleValues({...newData});
}

  const handleIncrement = () => {
    const newQuantity = dataRef.current.product?.quantity ? dataRef.current.product?.quantity + 1 : 1;
    const newData = {
      ...dataRef.current,
      product: {
        ...dataRef.current.product,
        quantity: newQuantity
      }
    }
    dataRef.current = newData;
    handleValues(newData);
  };
  const handleDecrement = () => {
    const newData = {
      ...dataRef.current,
      product: {
        ...dataRef.current.product,
        quantity: dataRef.current.product?.quantity ? dataRef.current.product?.quantity - 1 : 0
      }
    };
    dataRef.current = newData;
    handleValues(newData);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={1}>
        <Grid item xs={12} style={{ paddingTop: 0 }}>
          <RenderTitleDesc
            noHeader
            noPaper
            title={dataRef.current?.product?.titleAbout || ''}
            description={dataRef.current?.product?.descriptionAbout || ''}
            handleValues={handleValuesText}
          />
        </Grid>
        <Grid item xs={12} style={{ paddingTop: 0 }}>
          <FileUpload
            onChange={handleChange}
            accept={ALLOWED_FILE_EXTENSIONS['gallery']}
            // @ts-ignore
            disabled={dataRef.current?.files?.length >= 5}
            multiple
            // @ts-ignore
            value={dataRef.current?.files || []}
            title={'Product Images'}
            maxSize={toBytes(FILE_LIMITS['gallery'].totalMbPerFile, 'MB')}
          />
        </Grid>
      </Grid>
      <Grid
        item
        container
        xs={12}
        sx={{ paddingTop: 1}}
        spacing={1}>
        <Grid container item xs={12} md={6} style={{ paddingTop: 1 }}>
          <Grid item container xs={2} alignItems={'center'} justifyContent={'center'}>
            <Topics message={'SKU:'} sx={{mb:0}}/>
          </Grid>
          <Grid xs={10}>
            <RenderTextFields
              handleValues={handleValuesText}
              value={dataRef.current?.product?.sku || ''}
              item={'sku'}
              placeholder="Insert the SKU number"
            />
            </Grid>
        </Grid>
        <Grid item container  xs={12} md={6} style={{ paddingTop: 0}}>
          <Grid item container xs={3} alignItems={'center'} justifyContent={'center'}>
            <Topics message={'Quantity:'} />
          </Grid>
          <Grid item container xs={9} alignItems={'center'}>
          <ButtonGroup
            sx={{
              size: {
                xs: 'medium',
                md: 'large'
              },
              alignItems:'center',
              justifyContent:'center'
            }}>
            <Button
              disabled={
                dataRef.current?.product?.quantity === undefined ||
                dataRef.current?.product?.quantity === 0
              }
              onClick={handleDecrement}>
              -
            </Button>
            <Button disabled>{dataRef.current?.product?.quantity || 0}</Button>
            <Button onClick={handleIncrement}>+</Button>
          </ButtonGroup>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

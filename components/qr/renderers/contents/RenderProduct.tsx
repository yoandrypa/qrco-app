import { Grid, Box, ButtonGroup, Button } from '@mui/material';
import Topics from '../helpers/Topics';
import { DataType } from '../../types/types';
import RenderTitleDesc from './RenderTitleDesc';
import { ChangeEvent } from 'react';
import { ALLOWED_FILE_EXTENSIONS, FILE_LIMITS } from '../../../../consts';
import { conjunctMethods, toBytes } from '../../../../utils';
import FileUpload from 'react-material-file-upload';
import RenderTextFields from '../helpers/RenderTextFields';

interface RenderProductProps {
  data: DataType;
  handleValues: Function;
}

export default function RenderProduct({
  data,
  handleValues
}: RenderProductProps) {
  const handleChange = (files: File[]) => {
    if (!data.product?.picture || files.length === 0) {
      handleValues({ ...data, picture:files });
      return;
    }

    const isSameFile = (uploadedFile: File, fileToUpload: File) => {
      return uploadedFile.name === fileToUpload.name && uploadedFile.lastModified === fileToUpload.lastModified;
    };
    const A = data.product?.picture;
    const B = files;
    let C = conjunctMethods.intersection(A, B, isSameFile);
    if (C.length === 0) {
      C = A.concat(B);
    }
    handleValues({ ...data, product: { ...data.product, picture: files } });
  };

  const handleIncrement = () => {
    const newQuantity = data.product?.quantity ? data.product?.quantity + 1 : 1;
    handleValues({
      ...data,
      product: {
        ...data.product,
        quantity: newQuantity
      }
    });
  };
  const handleDecrement = () => {
    handleValues({
      ...data,
      product: {
        ...data.product,
        quantity: data.product?.quantity ? data.product?.quantity - 1 : 0
      }
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={1}>
        <Grid item xs={12} style={{ paddingTop: 0 }}>
          <RenderTitleDesc
            title={data?.product?.title || ''}
            description={data?.product?.description || ''}
            handleValues={(item: string) =>
              (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
                const value =
                  typeof payload === 'string' || typeof payload === 'boolean'
                    ? payload
                    : payload.target.value;
                handleValues({
                  ...data,
                  product: { ...data.product, [item]: value }
                });
              }}
          />
        </Grid>
        <Grid item xs={12} md={6} style={{ paddingTop: 0 }}>
          <FileUpload
            onChange={handleChange}
            accept={ALLOWED_FILE_EXTENSIONS['gallery']}
            // @ts-ignore
            disabled={data?.product?.picture?.length >= 5}
            multiple
            // @ts-ignore
            value={data?.product?.picture || []}
            title={'Product Images'}
            maxSize={toBytes(FILE_LIMITS['gallery'].totalMbPerFile, 'MB')}
          />
        </Grid>
        <Grid
        item
        container
        xs={12}
        md={6}
        sx={{ paddingTop: 1, alignItems: 'center', alignContent:'center' }}>
        
          <Grid item xs={12} style={{ paddingTop: 0 }}>
            <ButtonGroup sx={{
              size: {
                xs: 'medium',
                md: 'large'
              }
            }}>
            <Button
                disabled={
                  data?.product?.quantity === undefined ||
                  data?.product?.quantity === 0
                }
                onClick={handleDecrement}>
                -
              </Button>
              <Button disabled>{data?.product?.quantity || 0}</Button>
              <Button onClick={handleIncrement}>+</Button>
            </ButtonGroup>
          </Grid>
      </Grid>
      </Grid>
      
      <Grid item xs={12} md={6} style={{ paddingTop: 0 }}>
        <RenderTextFields
          handleValues={(item: string) =>
            (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
              const value =
                typeof payload === 'string' || typeof payload === 'boolean'
                  ? payload
                  : payload.target.value;
              handleValues({
                ...data,
                product: { ...data.product, [item]: value }
              });
            }}
          value={data?.product?.sku || ''}
          item={'sku'}
          placeholder="Insert the SKU number"
        />
      </Grid>
    </Box>
  );
}

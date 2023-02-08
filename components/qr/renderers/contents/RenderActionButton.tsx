import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {DataType, Type} from "../../types/types";
import {isValidUrl} from "../../../../utils";
import RenderProposalsTextFields from "../helpers/RenderProposalsTextFields";
import RenderTextFields from "../helpers/RenderTextFields";
import {ChangeEvent, useEffect} from "react";

interface ActionButtonProps {
  data?: Type;
  index?: number;
  setData: Function;
  handleValues: Function;
}

export default function RenderActionButton({data, setData, handleValues, index}: ActionButtonProps) {
  const handleOptionButton = () => {
    setData((prev: DataType) => {
      const newData = {...prev};
      if (index === undefined || index === -1) {
        if (newData.urlOptionLabel !== undefined) {
          delete newData.urlOptionLabel;
          delete newData.urlOptionLink;
        } else {
          newData.urlOptionLabel = '';
          newData.urlOptionLink = '';
        }
      } else { // @ts-ignore
        if (newData.custom[index].data?.urlOptionLabel === undefined) { // @ts-ignore
          if (newData.custom[index].data === undefined) { newData.custom[index].data = {}; } // @ts-ignore
          newData.custom[index].data.urlOptionLabel = ''; // @ts-ignore
          newData.custom[index].data.urlOptionLabel = '';
        } else { // @ts-ignore
          delete newData.custom[index].data.urlOptionLabel; // @ts-ignore
          delete newData.custom[index].data.urlOptionLabel;
        }
      }
      return newData;
    });
  };

  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
    handleValues(item, index)(payload);
  }

  const renderItem = (item: string, label: string, required?: boolean) => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[item] || '' as string;
    if ((value.trim().length === 0 && ['urlOptionLabel', 'urlOptionLink'].includes(item)) ||
      (item === 'urlOptionLink' && !isValidUrl(value))) {
      isError = true;
    }
    if (item === 'urlOptionLabel') {
      return (<RenderProposalsTextFields
        options={['View menu', 'Shop online', 'Book now', 'Apply now', 'Learn more', 'Read more', 'More info']}
        value={value}
        item={item}
        label={label}
        isError={isError}
        handleValues={beforeSend}
      />);
    }
    return <RenderTextFields item={item} label={label} isError={isError} value={value} handleValues={beforeSend} required={required} />;
  };

  useEffect(() => {
    if (index !== undefined && index !== -1) {
      handleOptionButton()
    }
  }, []);

  return (
    <>
      {(index === undefined || index === -1) && (<Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography sx={{my: 'auto'}}>{'Action button'}</Typography>
        <Button sx={{mb: '5px'}} variant="outlined" color={data?.urlOptionLabel === undefined ? 'primary' : 'error'}
                onClick={handleOptionButton}>
          {data?.urlOptionLabel === undefined ? 'Add action button' : 'Remove action button'}
        </Button>
      </Box>)}
      {data?.urlOptionLabel !== undefined && (
        <Grid container spacing={1}>
          <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
            {renderItem('urlOptionLabel', 'Label')}
          </Grid>
          <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
            {renderItem('urlOptionLink', 'Link')}
          </Grid>
        </Grid>
      )}
    </>
  );
}

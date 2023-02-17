import Grid from "@mui/material/Grid";
import {YEAR} from "../../constants";
import RenderTextFields from "../helpers/RenderTextFields";
import RenderSelectField from "../helpers/RenderSelectField";
import {ContentProps} from "../custom/helperFuncs";
import {ChangeEvent} from "react";

const genders = [
  { value:'male', label:'Male' },
  { value:'female', label:'Female' },
  { value:'other', label:'Other' }
];

export default function RenderPetDesc({data, handleValues, index}: ContentProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    handleValues(item, index)(payload);
  }


  const renderItem = (item: string, label: string, placeholder?:string) => { // @ts-ignore
    const value = data?.[item] || ('' as string);

    return (
      <RenderTextFields
        item={item}
        label={label}
        isError={value.trim().length && item === 'petYearOfBirth' && !YEAR.test(value)}
        value={value}
        handleValues={beforeSend}
        required={item === 'petName'}
        placeholder={placeholder}
      />
    );
  };

  const renderSelectItem = (item: string, label: string, options: {value: string, label: string}[], whatSave?: 'label' | 'value') => {
    // @ts-ignore
    const value = data?.[item] || '' as string;
    return (
      <RenderSelectField
        item={item}
        label={label}
        value={value}
        handleValues={beforeSend}
        options={options}
        whatSave={whatSave}
      />
    );
  }

  return (<Grid container spacing={1} sx={{mt:1}}>
    <Grid item sm={6} xs={12} style={{ paddingTop: 0 }}>
      {renderItem('petName', 'Name')}
    </Grid>
    <Grid item sm={6} xs={12} style={{ paddingTop: 0 }}>
      {renderItem('petBreed', 'Breed')}
    </Grid>
    <Grid item sm={6} xs={12} style={{ paddingTop: 0 }}>
      {renderSelectItem('petGender','Gender', genders, 'label')}
    </Grid>
    <Grid item sm={6} xs={12} style={{ paddingTop: 0 }}>
      {renderItem('petYearOfBirth', 'Year of Birth', 'YYYY')}
    </Grid>
  </Grid>)
}

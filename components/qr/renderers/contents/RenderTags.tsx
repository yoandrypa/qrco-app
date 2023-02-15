import {ContentProps} from "../custom/helperFuncs";
import Autocomplete from "@mui/material/Autocomplete";
import {TextField} from "@mui/material";
import {KeyboardEvent, useEffect, useRef, useState} from "react";

export default function RenderTags({data, handleValues, index}: ContentProps) {
  const [options, setOptions] = useState<string[]>([
    'Art',
    'Cars',
    'Dishes',
    'Glasses',
    'Jewelry',
    'Packaging',
    'Shoes',
    'Toys',
    'Clothing'
  ]);

  const tempo = useRef<string>('');

  const handleChange = (_: any, newValue: string[]) => {
    handleValues('tags', index)(newValue);
  };

  useEffect(() => {
    if (data?.tags?.length) {
      const newOptions = [...options];
      data.tags.forEach(x => {
        const d = x.toUpperCase().trim();
        if (!newOptions.some((opt: string) => opt.toUpperCase().trim() === d)) {
          newOptions.push(x);
        }
      });
      if (newOptions.length !== options.length) {
        setOptions(newOptions);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Autocomplete
      multiple
      id="tags-outlined"
      options={options}
      onChange={handleChange}
      value={data?.tags || []}
      noOptionsText="Hit enter to add the new tag"
      autoHighlight
      filterSelectedOptions
      size="small"
      getOptionLabel={option => option}
      onInputChange={(event, newInputValue) => {
        tempo.current = newInputValue;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Tags"
          placeholder="Select a tag or type in a new one"
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            if (event?.keyCode === 13) {
              event.preventDefault();
              event.stopPropagation();

              if (!options.some((x: string) => x.toUpperCase().trim() === tempo.current?.toUpperCase().trim())) {
                setOptions([...options, tempo.current]);
                handleValues('tags', index)(tempo.current);
              }
            }
          }}
        />
      )}
    />
  );
}

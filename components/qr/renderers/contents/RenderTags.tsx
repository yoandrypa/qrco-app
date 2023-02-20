import {ContentProps} from "../custom/helperFuncs";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import {TextField} from "@mui/material";

const filter = createFilterOptions<string>();

export default function RenderTags({data, handleValues, index}: ContentProps) {
  const handleChange = (_: any, newValue: any) => {
    handleValues('tags', index)(newValue.map((x: string) => x.startsWith('Add new tag "') && x.endsWith('"') ? x.slice(13, -1) : x));
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      clearOnBlur
      selectOnFocus
      handleHomeEndKeys
      id="tags-outlined"
      options={[] as string[]}
      onChange={handleChange}
      value={data?.tags || []}
      noOptionsText="Type in the tag"
      autoHighlight
      filterSelectedOptions
      size="small"
      getOptionLabel={option => option}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;
        const isExisting = options.some((option: string) => inputValue === option);
        if (inputValue !== '' && !isExisting) {
          filtered.push(`Add new tag "${inputValue}"`);
        }
        return filtered;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Tags"
          placeholder="Type in for entering tags"
        />
      )}
    />
  );
}

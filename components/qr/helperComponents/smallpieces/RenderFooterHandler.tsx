import {ChangeEvent} from "react";
import {FormControl, InputLabel, TextField} from "@mui/material";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

import {DataType} from "../../types/types";

interface FooterProps {
  data?: DataType;
  handleValue: Function;
}

export default function RenderFooterHandler({data, handleValue}: FooterProps) {
  const handler = (event: SelectChangeEvent) => {
    handleValue('footerKind')(event.target.value);
  };

  const handleMessage = (event: ChangeEvent<HTMLInputElement>) => {
    handleValue('customFooter')(event.target.value);
  };

  return (
    <Box sx={{mt: 1, display: 'flex', flexDirection: {sm: 'row', xs: 'column'}}}>
      <FormControl fullWidth size="small" sx={{width: {sm: '200px', xs: '100%'}}}>
        <InputLabel id="footerKind">Kind of footer</InputLabel>
        <Select labelId="footerKind"
          sx={{width: '100%'}}
          label="Kind of footer"
          value={data?.footerKind || 'default'}
          onChange={handler}
        >
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="custom">Custom text</MenuItem>
          <MenuItem value="noFooter">No footer</MenuItem>
        </Select>
      </FormControl>
      {data?.footerKind === 'custom' && (<TextField
        label='Custom message'
        sx={{width: '100%', ml: 1}}
        size='small'
        placeholder='Custom message for the footer'
        variant='outlined'
        value={data?.customFooter || ''}
        onChange={handleMessage}
      />)}
    </Box>
  );
}

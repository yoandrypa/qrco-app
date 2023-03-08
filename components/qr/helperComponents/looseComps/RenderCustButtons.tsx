import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import {ChangeEvent} from "react";
import {DataType} from "../../types/types";

interface CustBtnsProps {
  handleValue: Function;
  data: DataType;
  handleHoriz?: boolean;
}

export default function RenderCustButtons({handleValue, data, handleHoriz}: CustBtnsProps) {
  const handleChange = (item: string) => (event: ChangeEvent<HTMLInputElement>) => {
    handleValue(item)(event.target.checked);
  }

  return (
    <>
      <FormControl sx={{ ml: 1}}>
        <FormControlLabel control={<Switch checked={data?.flipVertical || false} onChange={handleChange('flipVertical')} />}
                          label="Flip vertical" />
      </FormControl>
      {handleHoriz && (<FormControl sx={{ ml: 1}}>
        <FormControlLabel control={<Switch checked={data?.flipHorizontal || false} onChange={handleChange('flipHorizontal')} />}
                          label="Flip horizontal" />
        </FormControl>
      )}
      <FormControl sx={{ ml: 1}}>
        <FormControlLabel control={<Switch checked={data?.alternate || false} onChange={handleChange('alternate')} />}
                          label="Alternate" />
      </FormControl>
    </>
  );
}

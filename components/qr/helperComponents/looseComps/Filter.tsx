import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import {ChangeEvent} from "react";
import {TextField} from "@mui/material";

interface FilterProps {
  filter: string;
  setFilter: (newFilter: string) => void;
  sx?: object;
}

export default function Filter({filter, setFilter, sx}: FilterProps) {
  return (
    <TextField
      sx={{width: '250px', ...sx}}
      autoFocus
      fullWidth
      value={filter}
      size="small"
      label=""
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="primary"/>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {filter.length ? (<Tooltip title="Clear filter">
              <IconButton size="small" onClick={() => setFilter('')}>
                <ClearIcon color="error"/>
              </IconButton>
            </Tooltip>) : null}
          </InputAdornment>
        )
      }}
      onChange={(event: ChangeEvent<HTMLInputElement>) => setFilter(event.target.value)}/>
  )
}

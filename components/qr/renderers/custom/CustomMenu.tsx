import {components} from "./helperFuncs";
import React, {ChangeEvent, useState} from "react";
import MenuList from "@mui/material/MenuList";
import {MenuItem, TextField} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

interface CustomImageProps {
  handle: (item: string) => () => void;
  showOptions: HTMLButtonElement;
  setShowOptions: Function;
}

export default function CustomMenu({handle, showOptions, setShowOptions}: CustomImageProps) {
  const [filter, setFilter] = useState<string>('');

  const clearFilter = () => {
    setFilter('');
  }

  const render = () => {
    const list = components.filter(x => x.name.toUpperCase().includes(filter.toUpperCase()));
    return list.map(x => {
      return !x.notInMenu ? (
        <MenuItem onClick={handle(x.type)} key={x.type}>
          <ListItemText>{x.name}</ListItemText>
        </MenuItem>
      ) : null;
    })
  }

  return (
    <Popover
      open
      anchorEl={showOptions}
      onClose={() => setShowOptions(null)}
      anchorOrigin={{vertical: 'top', horizontal: 'left'}}
      transformOrigin={{vertical: 'top', horizontal: 'left'}}
    >
      <TextField
        sx={{width: '250px'}}
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
                <IconButton size="small" onClick={clearFilter}>
                  <ClearIcon color="error"/>
                </IconButton>
              </Tooltip>) : null}
            </InputAdornment>
          )
        }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setFilter(event.target.value)}/>
      <MenuList sx={{maxHeight: '255px', overflowY: 'auto', overflowX: 'hidden'}}>
        {render()}
      </MenuList>
    </Popover>
  )
}

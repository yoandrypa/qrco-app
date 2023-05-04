import React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { Theme } from '@mui/material/styles';

interface PropsType {
  value: string;
}

const RequiredAdornment = ({ value }: PropsType) => {
  if (value && value.trim().length > 0) return null;

  const rqSx = (theme: Theme) => ({
    position: 'absolute',
    top: theme.spacing(2.5),
    right: theme.spacing(1),
  });

  return (
    <InputAdornment position="end" sx={rqSx}>
      <Typography color="error">{'REQUIRED'}</Typography>
    </InputAdornment>
  )
};

export default RequiredAdornment;

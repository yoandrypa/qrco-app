import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";

const LinksCreateFormOptions = ({ domains, parentValues, parentHandleChange }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel id="domain-select-label">Domain</InputLabel>
          <Select
            labelId="domain-select-label"
            id="domain-select"
            value={parentValues.domain}
            label="Domain"
            onChange={parentHandleChange("domain")}
            size="small"
            fullWidth
          >
            {domains && domains.map((domain: DomainType) => <MenuItem key={domain.createdAt}
                                                                      value={domain.createdAt}>{domain.address}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <TextField
          id="address-text"
          autoComplete="off"
          value={parentValues.customUrl}
          label="/"
          onChange={parentHandleChange("customUrl")}
          size="small"
          fullWidth
        />
      </Grid>
      <Grid item xs={4}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="password-text-label">Password</InputLabel>
          <OutlinedInput
            id="password-text"
            autoComplete="off"
            type={showPassword ? "text" : "password"}
            value={parentValues.password}
            onChange={parentHandleChange("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            size="small"
          />
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <TextField
          id="expires-in-text"
          value={parentValues.expireIn}
          label="Expires in"
          placeholder="2 minutes/hours/days"
          onChange={parentHandleChange("expireIn")}
          size="small"
          fullWidth
        />
      </Grid>
      <Grid item xs={8}>
        <TextField
          id="description-text"
          value={parentValues.description}
          label="Description"
          onChange={parentHandleChange("description")}
          size="small"
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default LinksCreateFormOptions;

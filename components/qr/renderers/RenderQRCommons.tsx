import {useContext, useState} from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Context from "../../context/Context";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import Expander from "./helpers/Expander";
import {alpha} from "@mui/material/styles";
import {DEFAULT_COLORS} from "../constants";
import ColorSelector from "../helperComponents/ColorSelector";
import {ColorTypes} from "../types/types";

interface QRCommonsProps {
  omitColorSel?: boolean;
  qrName?: string;
  primary?: string;
  secondary?: string;
  handleValue: Function;
}

const colors = [DEFAULT_COLORS, {p: '#187510', s: '#9ece99'}, {p: '#aa8412', s: '#d7c89a'},
  {p: '#b30909', s: '#dba8a8'}, {p: '#8c0f4a', s: '#dd9ebc'}, {p: '#40310f', s: '#a8a6a1'}] as ColorTypes[];

function RenderQRCommons({omitColorSel, qrName, primary, secondary, handleValue}: QRCommonsProps) {
  // @ts-ignore
  const {userInfo} = useContext(Context);
  const [expander, setExpander] = useState<string | null>(null);

  const renderColors = () => (
    <>
      <Grid container spacing={1}>
        {colors.map(x => {
          const selected = (!primary && !secondary && x.p === DEFAULT_COLORS.p && x.s === DEFAULT_COLORS.s) ||
            (x.p === primary && x.s === secondary);
          return (
            <Grid item lg={2} md={2} sm={4} xs={4} style={{paddingTop: 0}} key={`${x.p}${x.s}`}>
              <Box
                onClick={() => { handleValue('both')(x); }}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  p: 1,
                  mt: 1,
                  border: theme => `solid ${selected ? 2 : 1}px ${!selected ? theme.palette.text.disabled : theme.palette.warning.light}`,
                  borderRadius: '5px',
                  '&:hover': {
                    backgroundColor: theme => alpha(theme.palette.info.light, 0.1)
                  }
              }}>
                <Box sx={{background: x.p, width: '100%', height: '30px', borderRadius: '5px 0 0 5px'}} />
                <Box sx={{background: x.s, width: '100%', height: '30px', borderRadius: '0 5px 5px 0'}} />
              </Box>
            </Grid>
          )
        })}
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <ColorSelector label="Primary color" color={primary || DEFAULT_COLORS.p} handleData={handleValue} property="primary" />
        </Grid>
        <Grid item xs={6}>
          <ColorSelector label="Secondary color" color={secondary || DEFAULT_COLORS.s} handleData={handleValue} property="secondary" />
        </Grid>
      </Grid>
    </>
  );

  if (!userInfo) {
    return null;
  }

  return (
    <>
      <TextField
        label="QR name"
        required
        size="small"
        fullWidth
        margin="dense"
        value={qrName || ''}
        onChange={handleValue('qrName')}
        InputProps={{
          endAdornment: (
            !Boolean(qrName?.trim().length) ? (<InputAdornment position="end">
              <Typography color="error">{'REQUIRED'}</Typography>
            </InputAdornment>) : null
          )
        }}
      />
      {!omitColorSel && (
        <Paper elevation={2} sx={{p: 1, mt: 1}}>
          <Expander expand={expander} setExpand={setExpander} item="design" title="Design" bold/>
          {expander === "design" && renderColors()}
        </Paper>
      )}
      <Divider sx={{my: '10px'}}/>
    </>
  );
}

export default RenderQRCommons;

import {memo} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import {areEquals} from "../../../helpers/generalFunctions";
import {NameSecretProps} from "./helpers";

import RenderSecretHandler from "./RenderSecretHandler";
import RenderCodeHandler from "./RenderCodeHandler";

function RenderNameAndSecret({handleValue, qrName, secret, secretOps, hideSecret, code, errors, openValidationErrors}: NameSecretProps) {
  const disabled = !qrName?.trim()?.length;

  return (
    <>
      <TextField
        label="QRLynk name"
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
      {!hideSecret && (
        <Box sx={{display: 'flex', flexDirection: {sm: 'row', xs: 'column'}}}>
          <RenderCodeHandler code={code} url={`${process.env.MICRO_SITES_BASE_URL}/`} />
          <RenderSecretHandler disabled={disabled} openValidationErrors={openValidationErrors} handleValue={handleValue}
                               errors={errors} secret={secret} secretOps={secretOps} />
        </Box>
      )}
    </>
  );
}

const notIf = (current: NameSecretProps, next: NameSecretProps) =>
  current.qrName === next.qrName && current.secret === next.secret && current.secretOps === next.secretOps &&
  current.code === next.code && areEquals(current.errors, next.errors);

export default memo(RenderNameAndSecret, notIf);

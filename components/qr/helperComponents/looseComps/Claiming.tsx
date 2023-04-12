import {ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState} from "react";
import {findByAddress} from "../../../../handlers/links";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

interface ClaimingProps {
  code?: string;
  URL?: string;
  buttonMessage?: string;
  handleCurrent?: (curr: string) => void;
  handleOk: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function Claiming({code, URL, handleOk, buttonMessage, handleCurrent}: ClaimingProps) {
  const [custom, setCustom] = useState<string>(code || '');
  const [available, setAvailable] = useState<boolean>(true);
  const [checking, setChecking] = useState<boolean>(true);

  const lynk = useRef<string>(`${URL}${custom}`);

  const handleCustom = (event: ChangeEvent<HTMLInputElement>) => {
    setAvailable(true);
    const { value }: { value: string } = event.target;
    lynk.current = URL ? `${URL}${value}` : value;
    if (handleCurrent) { handleCurrent(lynk.current); }
    setCustom(value);
  }

  const sameCode = custom === code && custom.length > 0;
  const isError = !sameCode && !custom.trim().length;

  useEffect(() => {
    setChecking(true);
    const checkData = setTimeout(async () => { //this implements a debounce for checking the availability
      if (!sameCode) {
        if (!isError) {
          setChecking(true);
          const links = await findByAddress({address: {eq: custom}});
          setAvailable(links.length === 0);
          setChecking(false);
        }
      } else {
        setChecking(false);
        setAvailable(false);
      }
    }, 1000);
    return () => clearTimeout(checkData);
  }, [custom]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{ mt: '10px' }}>
      <Box sx={{ display: 'flex', mt: '-5px', height: '85px' }}>
        <TextField
          onKeyDown={(evt: KeyboardEvent<HTMLInputElement>) => !/^[a-zA-Z0-9_]+$/.test(evt.key) && evt.preventDefault()}
          label=""
          autoFocus
          size="small"
          fullWidth
          margin="dense"
          value={custom}
          error={isError || (!available && !sameCode)}
          helperText={sameCode ? 'Enter a different code' : (checking && !isError ? 'Checking code availability...' :
            (isError ? 'Make sure you entered a code' : (available ? 'The code is available' : 'The entered code is already taken')))
          }
          sx={{ '& fieldset': { borderRadius: '5px 0 0 5px' } }}
          onChange={handleCustom}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 0 }}>
                {URL && <Typography sx={{ mt: '2px' }}>{URL.slice(8)}</Typography>}
              </InputAdornment>
            )
          }} />
        <Button
          onClick={handleOk}
          variant="outlined" sx={{ height: '40px', mt: '8px', borderRadius: '0 5px 5px 0' }}
          disabled={isError || !available || checking}>
          <Typography sx={{ mx: '5px' }}>{buttonMessage || 'Ok'}</Typography>
        </Button>
      </Box>
    </Box>
  );
}

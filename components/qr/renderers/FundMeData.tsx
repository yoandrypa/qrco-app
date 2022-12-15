import React from 'react'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

import FileUpload from 'react-material-file-upload'
import { ALLOWED_FILE_EXTENSIONS, FILE_LIMITS } from "../../../consts"
import { toBytes } from "../../../utils"

type FundMeProps = {
  data: {
    files?: File[];
    title?: string;
    about?: string;
  };
  handleValues: Function;
  setData: Function;
}

const FundMe = ({ data, setData }: FundMeProps) => {
  const [value, setValue] = React.useState('female');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const totalFiles = FILE_LIMITS['gallery'].totalFiles;
  let title = "Drag 'n' drop some files here, or click to select files.";
  if (totalFiles > 1) {
    title += ` Selected ${data["files"]?.length || 0} of ${totalFiles} allowed`;
  }

  return (
    <>
      <Grid container >
        <Grid item >
          <FormControl size='small' >
            <FormLabel id="demo-controlled-radio-buttons-group">
              What kind of fund raising so you plan to be?
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel value="personal" control={<Radio sx={{ padding: 0.5 }} size='small' />} label="For a personal use" />
              <FormControlLabel value="behalf" control={<Radio sx={{ padding: 0.5 }} size='small' />} label="On behalf on someone else" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item lg={4}>
          <FileUpload
            onChange={() => { }}
            accept={ALLOWED_FILE_EXTENSIONS['gallery']}
            multiple={["gallery", "video"].includes('gallery')}
            // @ts-ignore
            disabled={data["files"]?.length >= totalFiles}
            // @ts-ignore
            value={data["files"]}
            title={title}
            maxFiles={FILE_LIMITS['gallery'].totalFiles}
            maxSize={toBytes(FILE_LIMITS['gallery'].totalMbPerFile, "MB")}
          />
        </Grid>

        <Grid item direction='column' >
          <TextField
            sx={{ mb: 2 }}
            variant='outlined'
            placeholder='Living Live with Anna'
            label='Campaing title'
            size='small'
          />
          <br />
          <TextField
            variant='outlined'
            placeholder='Barton Willows is organizing fundraing on behalf of Jhon Smith.'
            label='Short Description'
            size='small'
          />
          <br />
          <TextField
            id="outlined-textarea"
            label="Multiline Placeholder"
            placeholder="Placeholder"
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item lg={8}>
          <Typography>
            Add a Goal
          </Typography>
          <Alert>
            Adding a goal can increase your supporters by 5 times.
          </Alert>
          <TextField
            inputProps={{ inputMode: 'numeric', step: "any", min: 1, max: 100, pattern: ' ^[-,0-9]+$' }}
            type='number'
            label='Add a Goal'
            sx={{ width: 150, marginBottom: 2 }}
            placeholder='10'
            size='small'
          // value={coffeePrice}
          // onChange={handleValues('donationUnitAmount')}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default FundMe
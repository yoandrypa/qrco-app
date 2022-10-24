import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import ColorSelector from '../helperComponents/ColorSelector';
import SectionSelector from '../helperComponents/SectionSelector';
import { FramesType } from '../types/types';
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import {FRAMES_LENGTH} from "../constants";

interface FramesProps {
  frame: FramesType;
  handleFrame: Function;
  handleMainFrame: Function;
}

const Frames = ({ frame, handleFrame, handleMainFrame }: FramesProps) => {
  const isOnlyColor = ['/frame/frame0.svg', '/frame/frame5.svg', '/frame/frame7.svg'].includes(frame.type || '');

  return (
    <>
      <Box sx={{ width: '100%', overflow: 'auto' }}>
        <Stack direction="row" spacing={2}>
          <SectionSelector
            icon={null}
            label="No frame"
            isFrame
            selected={!frame?.type}
            handleSelect={handleMainFrame} />
          <SectionSelector
            icon="/frame/frame0.svg"
            label="Simple"
            isFrame
            selected={frame?.type === '/frame/frame0.svg'}
            handleSelect={handleMainFrame} />
          <SectionSelector
            icon="/frame/frame1.svg"
            label="Frame 1"
            isFrame
            selected={frame?.type === '/frame/frame1.svg'}
            handleSelect={handleMainFrame} />
          <SectionSelector
            icon="/frame/frame2.svg"
            label="Frame 2"
            isFrame
            selected={frame?.type === '/frame/frame2.svg'}
            handleSelect={handleMainFrame} />
          <SectionSelector
            icon="/frame/frame3.svg"
            label="Frame 3"
            isFrame
            selected={frame?.type === '/frame/frame3.svg'}
            handleSelect={handleMainFrame} />
          <SectionSelector
            icon="/frame/frame4.svg"
            label="Frame 4"
            isFrame
            selected={frame?.type === '/frame/frame4.svg'}
            handleSelect={handleMainFrame} />
          <SectionSelector
            icon="/frame/frame5.svg"
            label="Frame 5"
            isFrame
            selected={frame?.type === '/frame/frame5.svg'}
            handleSelect={handleMainFrame} />
          <SectionSelector
            icon="/frame/frame6.svg"
            label="Frame 6"
            isFrame
            selected={frame?.type === '/frame/frame6.svg'}
            handleSelect={handleMainFrame} />
          <SectionSelector
            icon="/frame/frame7.svg"
            label="Frame 7"
            isFrame
            selected={frame?.type === '/frame/frame7.svg'}
            handleSelect={handleMainFrame} />
        </Stack>
      </Box>
      {frame.type && (
        <Grid container spacing={2} sx={{ mt: '1px' }}>
          <Grid item sm={isOnlyColor ? 12 : 6} xs={12}>
            <ColorSelector label="Frame color" color={frame.color} handleData={handleFrame} property="color" />
          </Grid>
          {!isOnlyColor && (<>
            <Grid item sm={6} xs={12}>
              <ColorSelector label="Text color" color={frame.textColor} handleData={handleFrame} property="textColor" />
            </Grid>
            <Grid item sm={frame?.type !== '/frame/frame6.svg' ? 8 : 12} xs={12}>
              <TextField
                size="small"
                fullWidth
                margin="dense"
                variant="outlined"
                label="Frame text"
                onChange={handleFrame('text')}
                value={frame.text}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography>{`${(FRAMES_LENGTH - (frame?.text?.length || 0))} chars left`}</Typography>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            {frame?.type !== '/frame/frame6.svg' && (
              <Grid item sm={4} xs={12}>
                <FormControlLabel
                  sx={{ mt: { sm: '7px', xs: 0 }, float: 'right' }}
                  control={<Switch checked={frame.textUp || false} onChange={handleFrame('textUp')} />}
                  label="Text up" />
              </Grid>
            )}
          </>)}
        </Grid>
      )}
    </>
  );
};

export default Frames;

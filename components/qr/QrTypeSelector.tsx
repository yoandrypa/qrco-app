import {useContext, useState} from 'react';

import Context from '../context/Context';
import RenderTypeSelector from "./helperComponents/RenderTypeSelector";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface QrTypeSelectorProps {
  setSelected: Function;
  selected?: string | null;
}

const QrTypeSelector = () => {
  // @ts-ignore
  const {setSelected, selected}: QrTypeSelectorProps = useContext(Context);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleSelect = (payload: string, target: HTMLDivElement): void => {
    // setAnchorEl(selected === payload && target !== null ? null : target);
    setSelected((prev: string) => prev === payload ? null : payload);
  };

  return (
    <>
      <RenderTypeSelector selected={selected} handleSelect={handleSelect}/>
      {anchorEl && (
        <Popper open anchorEl={anchorEl} placement="bottom" transition>
        {({TransitionProps}) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Typography sx={{p: 2}}>The content of the Popper.</Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
      )}
    </>
  );
}

export default QrTypeSelector;

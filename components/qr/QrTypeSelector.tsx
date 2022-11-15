import {useContext, useState} from 'react';
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import ClickAwayListener from '@mui/material/ClickAwayListener';

import Context from '../context/Context';
import RenderTypeSelector from "./helperComponents/RenderTypeSelector";
import RenderIframe from "../RenderIframe";

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
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <Popper open anchorEl={anchorEl} placement="bottom" transition>
            {({TransitionProps}) => (
              <Fade {...TransitionProps} timeout={350}>
                  <Paper sx={{ p: '5px' }}>
                    <RenderIframe src={`http://localhost:3000/sample/${selected}`} width={400} height={700} />
                  </Paper>
              </Fade>
            )}
          </Popper>
        </ClickAwayListener>
      )}
    </>
  );
}

export default QrTypeSelector;

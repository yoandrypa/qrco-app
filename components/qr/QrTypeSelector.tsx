import {useContext, useState} from 'react';
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";

import Context from '../context/Context';
import RenderTypeSelector from "./helperComponents/RenderTypeSelector";
import RenderIframe from "../RenderIframe";
import Button from "@mui/material/Button";
import {NO_MICROSITE} from "./constants";

interface QrTypeSelectorProps {
  setSelected: Function;
  selected?: string | null;
}

const QrTypeSelector = () => {
  // @ts-ignore
  const {setSelected, selected}: QrTypeSelectorProps = useContext(Context);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleSelect = (payload: string, target: HTMLDivElement): void => {
    if (!NO_MICROSITE.includes(payload)) {
      setAnchorEl(selected === payload && target !== null ? null : target);
    } else if (anchorEl !== null) {
      setAnchorEl(null);
    }
    setSelected((prev: string) => prev === payload ? null : payload);
  };

  return (
    <>
      <RenderTypeSelector selected={selected} handleSelect={handleSelect}/>
      {anchorEl && (
        <Popper open anchorEl={anchorEl} placement="auto" transition>
          {({TransitionProps}) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper sx={{p: '5px', textAlign: 'center'}}>
                <RenderIframe src={`${process.env.REACT_MICROSITES_ROUTE}/sample/${selected}`} width={370} height={500}/>
                <Button onClick={() => setAnchorEl(null)}>{'Close preview'}</Button>
              </Paper>
            </Fade>
          )}
        </Popper>
      )}
    </>
  );
}

export default QrTypeSelector;

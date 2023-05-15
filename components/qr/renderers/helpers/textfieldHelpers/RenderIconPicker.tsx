import {useEffect, useRef, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";

import RenderIcon from "../../../helperComponents/smallpieces/RenderIcon";
import Filter from "../../../helperComponents/looseComps/Filter";
import {IconsProps} from "./textHandler";

interface IconPickerProps {
  handleClose: () => void;
  handleAccept: (icon: string) => void;
  icons: IconsProps[];
}

export default function RenderIconPicker({handleClose, handleAccept, icons}: IconPickerProps) {
  const [newIcons, setNewIcons] = useState<IconsProps[]>([...icons]);
  const [filter, setFilter] = useState<string>('');

  const doneFirst = useRef<boolean>(false);

  useEffect(() => {
    const filtering = setTimeout(() => {
      if (doneFirst.current) {
        const newData: IconsProps[] = [];
        const filterBy = filter.toLowerCase();
        icons.forEach((x: IconsProps) => {
          if (x.alt?.replaceAll(',', '').includes(filterBy) || (x.name || x.icon).toLowerCase().includes(filterBy)) {
            newData.push(x);
          }
        });
        setNewIcons(newData);
      }
    }, 250);
    return () => clearTimeout(filtering);
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    doneFirst.current = true;
  }, []);

  return (
    <Dialog onClose={handleClose} open={true}>
      <DialogContent dividers>
        <Paper elevation={2} sx={{p: 2}}>
          <Filter filter={filter} setFilter={setFilter} sx={{mb: '10px', width: '300px'}} />
          <Box sx={{ width: {xs: '100%', sm: '300px'}, height: {xs: '100%', sm: '250px'}, overflowX: 'none', overflowY: 'auto'}}>
            <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: 'fit-content', margin: '0 auto', textAlign: 'center'}}>
              {newIcons.map(x => (
                <Tooltip key={`tooltip${x}`} title={x.name || x.icon} arrow>
                  <Box
                    key={x.icon}
                    onClick={() => handleAccept(x.icon)}
                    sx={{
                      width: '34px',
                      height: '34px',
                      mr: '5px',
                      mb: '5px',
                      pt: '3px',
                      cursor: 'pointer !important',
                      borderRadius: '3px',
                      border: theme => `solid 1px ${theme.palette.text.disabled}`,
                      '&:hover': {
                        boxShadow: '0 0 2px 2px #849abb'
                      }
                  }}>
                  <RenderIcon icon={x.icon} enabled />
                </Box>
              </Tooltip>))}
            </Box>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button variant="outlined" onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

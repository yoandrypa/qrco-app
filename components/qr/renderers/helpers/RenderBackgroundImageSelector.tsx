import Box from "@mui/material/Box";

import {DataType} from "../../types/types";
import {useState} from "react";
import Notifications from "../../../notifications/Notifications";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import ButtonGroup from "@mui/material/ButtonGroup";

interface BackImgProps {
  data?: DataType;
  handleValue: Function;
}

interface ErrorProps {
  msg: string;
  title: string;
  warning?: boolean;
}

export default function RenderBackgroundImageSelector({data, handleValue}: BackImgProps) {
  const [error, setError] = useState<ErrorProps | null>(null);

  const handleAcept = (f: File) => {

  }

  const handleSelectFile = (kind: string) => () => {

  };

  return (
    <>
      <Box sx={{mt: 1}}>
        <ButtonGroup>
          <Tooltip title="Click for selecting the microsite's background image">
            <Button
              sx={{width: '100%'}}
              startIcon={<WallpaperIcon sx={{ color: theme => theme.palette.error.dark }}/>}
              variant="outlined"
              color="primary"
              onClick={handleSelectFile('backgndImg')}>
              {'Background image'}
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Box>
      {error && (
        <Notifications
          onClose={() => setError(null)}
          title={error.title}
          autoHideDuration={7500}
          severity={!error.warning ? 'error' : 'warning'}
          vertical="bottom"
          showProgress
          message={error.msg}/>
      )}
    </>
  );
}

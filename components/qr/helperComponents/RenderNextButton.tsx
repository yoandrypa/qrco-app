import SaveIcon from "@mui/icons-material/Save";
import DoneIcon from "@mui/icons-material/Done";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StepperButtons from "./StepperButtons";
import IconButton from '@mui/material/IconButton';
import Tooltip from "@mui/material/Tooltip";
import {alpha} from "@mui/material/styles";

interface RenderNextProps {
  handleNext: () => void;
  isLogged: boolean;
  loading: boolean;
  step: number;
  mode?: string;
  selected?: string;
  qrName?: string;
  isWrong: boolean;
  display?: boolean;
}

const RenderNextButton = ({handleNext, isLogged, loading, step, mode, selected, qrName, isWrong, display}: RenderNextProps) => {
  const disabled = loading || (isWrong && step > 0) || !selected || (step === 1 && isLogged && !Boolean(qrName?.trim()?.length));
  const renderIcon = step >= 2 ? (isLogged ? <SaveIcon/> : <DoneIcon/>) : <ChevronRightIcon/>;
  const text = step >= 2 ? (isLogged ? (mode === undefined ? "Save" : "Update") : "Done") : "Next";

  if (display) {
    return (
      <Tooltip title={`${text === 'Next' ? 'Go ' : ''}${text}`}>
        <IconButton
          disabled={disabled}
          onClick={handleNext}
          size="small"
          sx={{
            backgroundColor: theme => alpha(theme.palette.primary.light, 0.3),
            '&:hover, &.Mui-focusVisible': { backgroundColor: theme => theme.palette.primary.light, color: 'white' }
          }}>
          {renderIcon}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <StepperButtons
      onClick={handleNext}
      endIcon={renderIcon}
      disabled={disabled}
      variant={step >= 2 ? "outlined" : "contained"}>
      {text}
    </StepperButtons>
  )
};

export default RenderNextButton;

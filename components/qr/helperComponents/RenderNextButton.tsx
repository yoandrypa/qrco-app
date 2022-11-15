import SaveIcon from "@mui/icons-material/Save";
import DoneIcon from "@mui/icons-material/Done";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StepperButtons from "./StepperButtons";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

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
        <Button variant="contained" disabled={disabled} onClick={handleNext} sx={{ height: '30px' }}>
          {renderIcon}
        </Button>
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

import SaveIcon from "@mui/icons-material/Save";
import DoneIcon from "@mui/icons-material/Done";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StepperButtons from "./StepperButtons";
import Tooltip from "@mui/material/Tooltip";
import {alpha} from "@mui/material/styles";
import Button from "@mui/material/Button";

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

const RenderNextButton = ({handleNext, isLogged, loading, step, mode, selected, qrName, isWrong, display}: RenderNextProps) => (
  <StepperButtons
    onClick={handleNext}
    endIcon={step >= 2 ? (isLogged ? <SaveIcon/> : <DoneIcon/>) : <ChevronRightIcon/>}
    disabled={loading || (isWrong && step > 0) || !selected || (step === 1 && isLogged && !Boolean(qrName?.trim()?.length))}
    variant={step >= 2 ? "outlined" : "contained"}>
    {step >= 2 ? (isLogged ? (mode === undefined ? "Save" : "Update") : "Done") : "Next"}
  </StepperButtons>
);

export default RenderNextButton;

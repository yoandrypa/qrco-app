import SaveIcon from "@mui/icons-material/Save";
import DoneIcon from "@mui/icons-material/Done";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { StepperButtons } from "../looseComps/StyledComponents";

interface RenderNextProps {
  handleNext: () => void;
  isLogged: boolean;
  loading: boolean;
  step: number;
  selected?: string;
  qrName?: string;
  isWrong: boolean;
}

const RenderNextButton = ({handleNext, isLogged, loading, step, selected, qrName, isWrong}: RenderNextProps) => (
  <StepperButtons
    id="buttonNext"
    onClick={handleNext}
    endIcon={step >= 2 ? (isLogged ? <SaveIcon/> : <DoneIcon/>) : <ChevronRightIcon/>}
    disabled={loading || (isWrong && step > 0) || !selected || (step === 1 && isLogged && !Boolean(qrName?.trim()?.length))}
    variant="contained">
    {step >= 2 ? (isLogged ? "Save" : "Done") : "Next"}
  </StepperButtons>
);

export default RenderNextButton;

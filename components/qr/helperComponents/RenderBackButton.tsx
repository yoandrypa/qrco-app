import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import StepperButtons from "./StepperButtons";

interface RenderBackProps {
  loading: boolean;
  step: number;
  selected?: string;
  mode?: string;
  isDynamic: boolean;
  handleBack: () => void;
}

const RenderBackButton = ({loading, step, selected, mode, isDynamic, handleBack}: RenderBackProps) => (
  <StepperButtons
    variant="contained"
    startIcon={<ChevronLeftIcon/>}
    disabled={loading || step === 0 || !selected || (mode === "edit" && ((isDynamic && step <= 1) || (!isDynamic && step <= 2)))}
    onClick={handleBack}>
    {"Back"}
  </StepperButtons>
);

export default RenderBackButton;

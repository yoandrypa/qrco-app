import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { StepperButtons } from "../looseComps/StyledComponents";

interface RenderBackProps {
  loading: boolean;
  step: number;
  selected?: string;
  handleBack: () => void;
}

const RenderBackButton = (
  {loading, step, selected, handleBack}: RenderBackProps
) => (
  <StepperButtons
    variant="contained"
    startIcon={<ChevronLeftIcon/>}
    disabled={loading || step === 0 || !selected}
    onClick={handleBack}
  >
    {"Back"}
  </StepperButtons>
);

export default RenderBackButton;

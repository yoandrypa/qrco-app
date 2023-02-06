import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { StepperButtons } from "../looseComps/StyledComponents";

interface RenderBackProps {
  loading: boolean;
  step: number;
  selected?: string;
  editingStatic: boolean;
  cloneMode: boolean;
  handleBack: () => void;
}

const RenderBackButton = ({loading, step, selected, editingStatic, handleBack, cloneMode}: RenderBackProps) => (
  <StepperButtons
    variant="contained"
    startIcon={<ChevronLeftIcon/>}
    disabled={loading || step === 0 || (cloneMode && step === 1) || !selected || editingStatic}
    onClick={handleBack}>
    {"Back"}
  </StepperButtons>
);

export default RenderBackButton;

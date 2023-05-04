import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { StepperButtons } from "../looseComps/StyledComponents";

interface RenderBackProps {
  loading: boolean;
  step: number;
  selected?: string;
  editingStatic: boolean;
  cloneMode: boolean;
  secretMode: boolean;
  handleBack: () => void;
}

const RenderBackButton = ({loading, step, selected, editingStatic, handleBack, cloneMode, secretMode}: RenderBackProps) => (
  <StepperButtons
    variant="contained"
    startIcon={<ChevronLeftIcon/>}
    disabled={loading || step === 0 || ((cloneMode || secretMode) && step === 1) || !selected || editingStatic}
    onClick={handleBack}>
    {"Back"}
  </StepperButtons>
);

export default RenderBackButton;

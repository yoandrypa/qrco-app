import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import StepperButtons from "./StepperButtons";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

interface RenderBackProps {
  loading: boolean;
  step: number;
  selected?: string;
  mode?: string;
  isDynamic: boolean;
  handleBack: () => void;
  display?: boolean;
}

const RenderBackButton = ({display, loading, step, selected, mode, isDynamic, handleBack}: RenderBackProps) => {
  const disabled = loading || step === 0 || !selected || (mode === "edit" && ((isDynamic && step <= 1) || (!isDynamic && step <= 2)));

  if (display) {
    return (
      <Tooltip title="Go back">
        <Button variant="contained" disabled={disabled} onClick={handleBack} sx={{ height: '30px' }}>
          <ChevronLeftIcon/>
        </Button>
      </Tooltip>
    );
  }

  return (
    <StepperButtons
      variant="contained"
      startIcon={<ChevronLeftIcon/>}
      disabled={disabled}
      onClick={handleBack}>
      {"Back"}
    </StepperButtons>
  )
};

export default RenderBackButton;

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import StepperButtons from "./StepperButtons";
import IconButton from '@mui/material/IconButton';
import Tooltip from "@mui/material/Tooltip";
import {alpha} from "@mui/material/styles";

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
        <IconButton
          disabled={disabled}
          onClick={handleBack}
          size="small"
          sx={{
            backgroundColor: theme => alpha(theme.palette.primary.light, 0.3),
            '&:hover, &.Mui-focusVisible': { backgroundColor: theme => theme.palette.primary.light, color: 'white' }
          }}>
          <ChevronLeftIcon/>
        </IconButton>
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

import RenderBackButton from "./RenderBackButton";
import RenderNextButton from "./RenderNextButton";
import Box from "@mui/material/Box";

interface RenderFloatingButtons {
  size: number;
  loading: boolean;
  step: number;
  selected?: string;
  mode?: string;
  isDynamic: boolean;
  isLogged: boolean;
  qrName?: string;
  isWrong: boolean;
  handleBack: () => void;
  handleNext: () => void;
}

export default function RenderFloatingButtons(
  { loading, step, selected, mode, isDynamic, handleBack, handleNext, qrName, isWrong, isLogged, size}:
    RenderFloatingButtons) {
  return (
    <Box sx={{ position: 'fixed', width: `${size}px`, top: '115px', display: 'flex', justifyContent: 'space-between' }}>
      <RenderBackButton
        step={step}
        handleBack={handleBack}
        loading={loading}
        isDynamic={isDynamic}
        mode={mode}
        selected={selected}
      />
      <RenderNextButton
        step={step}
        handleNext={handleNext}
        loading={loading}
        isLogged={isLogged}
        isWrong={isWrong}
        selected={selected}
        mode={mode}
        qrName={qrName}
      />
    </Box>
  );
}

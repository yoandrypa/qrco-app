import RenderBackButton from "./RenderBackButton";
import RenderNextButton from "./RenderNextButton";
import Box from "@mui/material/Box";

interface RenderFloatingButtons {
  size: number;
  loading: boolean;
  step: number;
  selected?: string;
  isLogged: boolean;
  qrName?: string;
  isWrong: boolean;
  editingStatic: boolean;
  handleBack: () => void;
  handleNext: () => void;
}

export default function RenderFloatingButtons(
  {loading, step, selected, handleBack, handleNext, qrName, isWrong, isLogged, size, editingStatic}: RenderFloatingButtons) {
  return (
    <Box sx={{ position: 'fixed', width: `${size}px`, top: '100px', display: 'flex', justifyContent: 'space-between' }}>
      {step > 0 ? <RenderBackButton
        step={step}
        handleBack={handleBack}
        loading={loading}
        selected={selected}
        editingStatic={editingStatic}
      /> : <Box />}
      {!isWrong ? <RenderNextButton
        step={step}
        handleNext={handleNext}
        loading={loading}
        isLogged={isLogged}
        isWrong={isWrong}
        selected={selected}
        qrName={qrName}
      /> : <Box />}
    </Box>
  );
}

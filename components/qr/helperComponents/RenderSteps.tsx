import {memo} from "react";
import Stepper from "@mui/material/Stepper";
import {steps} from "../auxFunctions";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

interface RenderStepsProps {
  step: number;
  isWide: boolean;
}

const RenderSteps = ({step, isWide}: RenderStepsProps) => (
  <Stepper
    activeStep={step}
    alternativeLabel={!isWide}
    sx={{width: "100%", mt: {xs: 2, sm: 0}, mb: {xs: 1, sm: 0}}}
  >
    {steps.map((label: string) => (
      <Step key={label}>
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </Stepper>
);

export default memo(RenderSteps, (current: RenderStepsProps, next: RenderStepsProps) => (current.step === next.step && current.step === next.step));

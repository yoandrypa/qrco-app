import React, { ReactNode } from "react";
import Typography from "@mui/material/Typography";

interface PropsType {
  text: string;
  children?: ReactNode;
}

const Caption = ({ text, children }: PropsType) => {
  return <Typography variant="body2">{children || text}</Typography>
};

export default Caption;

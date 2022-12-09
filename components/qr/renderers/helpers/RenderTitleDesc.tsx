import Typography from "@mui/material/Typography";
import RenderTextFields from "./RenderTextFields";
import Paper from "@mui/material/Paper";
import React from "react";

interface RenderTitleDescProps {
  title?: string;
  description?: string;
  handleValues: Function;
}

export default function RenderTitleDesc({title, description, handleValues}: RenderTitleDescProps) {
  return (
    <Paper sx={{ p: 2, my: 2}}>
      <Typography sx={{ fontSize: 'small', color: theme => theme.palette.text.disabled }}>{'Optional'}</Typography>
      <RenderTextFields item="title" label="Title" value={title || ''} handleValues={handleValues} />
      <RenderTextFields multiline item="about" label="Description" value={description || ''} handleValues={handleValues} />
    </Paper>
  );
}

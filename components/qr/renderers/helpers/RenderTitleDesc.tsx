import Typography from '@mui/material/Typography';
import RenderTextFields from './RenderTextFields';
import Paper from '@mui/material/Paper';
import React from 'react';

interface RenderTitleDescProps {
  title?: string;
  description?: string;
  handleValues: Function;
  header?: string;
  elevation?: number;
  sx?: object;
}

export default function RenderTitleDesc({
  title,
  description,
  handleValues,
  header,
  elevation,
  sx
}: RenderTitleDescProps) {
  return (
    <Paper sx={{ p: 2, my: 2 , ...sx}} elevation={elevation !== undefined ? elevation : 1}>
      <Typography
        sx={{ fontSize: 'small', color: theme => theme.palette.text.disabled }}>
        {header ? header : 'Optional'}
      </Typography>
      <RenderTextFields
        item="title"
        label="Title"
        value={title || ''}
        handleValues={handleValues}
      />
      <RenderTextFields
        multiline
        item="about"
        label="Description"
        value={description || ''}
        handleValues={handleValues}
      />
    </Paper>
  );
}

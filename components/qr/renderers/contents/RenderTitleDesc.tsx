import Typography from '@mui/material/Typography';
import RenderTextFields from '../helpers/RenderTextFields';
import Paper from '@mui/material/Paper';
import React from 'react';
import Box from "@mui/material/Box";

interface RenderTitleDescProps {
  title?: string;
  description?: string;
  handleValues: Function;
  header?: string;
  elevation?: number;
  sx?: object;
  noHeader?: boolean;
  noPaper?: boolean;
}

export default function RenderTitleDesc({
  title,
  description,
  handleValues,
  header,
  elevation,
  noHeader,
  noPaper,
  sx
}: RenderTitleDescProps) {

  const renderContent = () => (
    <Box>
      {!noHeader && <Typography sx={{fontSize: 'small', color: theme => theme.palette.text.disabled}}>
        {header ? header : 'Optional'}
      </Typography>}
      <RenderTextFields
        item="titleAbout"
        label="Title"
        value={title || ''}
        handleValues={handleValues}
      />
      <RenderTextFields
        multiline
        item="descriptionAbout"
        label="Description"
        value={description || ''}
        handleValues={handleValues}
      />
    </Box>
  );

  if (noPaper) {
    return renderContent();
  }

  return (
    <Paper sx={{ p: 2, my: 2 , ...sx}} elevation={elevation !== undefined ? elevation : 1}>
      {renderContent()}
    </Paper>
  );
}

import Typography from '@mui/material/Typography';
import RenderTextFields from '../helpers/RenderTextFields';
import Paper from '@mui/material/Paper';
import React, {ChangeEvent} from 'react';
import Box from "@mui/material/Box";

interface RenderTitleDescProps {
  index?: number;
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
  index, title, description, handleValues, header, elevation, noHeader, noPaper, sx
}: RenderTitleDescProps) {

  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
    handleValues(item, index)(payload);
  };

  const renderContent = () => (
    <Box>
      {!noHeader && <Typography sx={{fontSize: 'small', color: theme => theme.palette.text.disabled}}>
        {header ? header : 'Optional'}
      </Typography>}
      <RenderTextFields
        index={index}
        item="titleAbout"
        label="Title"
        value={title || ''}
        handleValues={beforeSend}
      />
      <RenderTextFields
        multiline
        index={index}
        item="descriptionAbout"
        label="Description"
        value={description || ''}
        handleValues={beforeSend}
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

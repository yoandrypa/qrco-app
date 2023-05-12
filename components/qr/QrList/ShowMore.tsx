import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

interface IProps {
  count: number;
  total: number;
  nextPageKey?: string;
  onShowMore: Function;
}

import sxClasses from "./styles.sx";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ShowMoreIcon from '@mui/icons-material/DownloadingOutlined';
import IconButton from "@mui/material/IconButton";
import React from "react";

export default function ShowMore({ total, count, nextPageKey, onShowMore }: IProps) {
  const { sxRow, sxPaginator, sxFlexStart, sxFlexEnd } = sxClasses;

  function onLoadNextPage() {
    if (nextPageKey) onShowMore();
  }

  return (
    <Stack spacing={2} sx={{ mt: '5px' }}>
      <Paper sx={{ ...sxRow, ...sxPaginator }} elevation={3}>
        <Grid container sx={{ width: '100%' }}>
          <Grid item xs={6} sx={sxFlexStart}>
            <Typography variant={"subtitle2"}>
              Shown: [ {count} / {total} ]
            </Typography>
          </Grid>
          <Grid item xs={6} sx={sxFlexEnd}>
            <IconButton title="Show more..." color="primary" disabled={!nextPageKey} onClick={onLoadNextPage}>
              <ShowMoreIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  )
}

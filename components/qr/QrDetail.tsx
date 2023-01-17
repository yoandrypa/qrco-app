import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import PublicIcon from "@mui/icons-material/Public";
import PauseIcon from "@mui/icons-material/Pause";
import Link from "next/link";
import { humanDate } from "../helpers/generalFunctions";
import { sanitize } from "../../utils";
import { capitalize } from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import AbcIcon from "@mui/icons-material/Abc";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import TodayIcon from "@mui/icons-material/Today";
import EventIcon from "@mui/icons-material/Event";
import { useTheme } from "@mui/system";
import { getSx } from "../../helpers/qr/helpers";

const QrDetail = ({ qrData }: any) => {
  const qrLink = qrData.shortLinkId ? sanitize.link(qrData.shortLinkId) : null;
  const theme = useTheme();

  return (
    <Grid container spacing={1} columnSpacing={1}>
      <Grid container xs={8} alignItems="center">
        <Grid item xs={1}>
          {/*<Avatar sx={{ bgcolor: themeConfig().palette.primary.main }}>*/}
          <AbcIcon fontSize="medium" sx={getSx(theme)}/>
          {/*</Avatar>*/}
        </Grid>
        <Grid item ml={3}>
          <Typography variant="caption">Name</Typography>
          <Typography>{qrData.qrName}</Typography>
        </Grid>
      </Grid>
      {/*-----*/}
      <Grid container xs={8} alignItems="center" mt={0.5}>
        <Grid item xs={1}>
          {/*<Avatar*/}
          {/*  sx={{ bgcolor: themeConfig().palette.primary.main }}>*/}
          <FormatSizeIcon fontSize="small" sx={getSx(theme)}/>
          {/*</Avatar>*/}
        </Grid>
        <Grid item ml={3}>
          <Typography variant="caption">Type</Typography>
          <Typography>{capitalize(qrData.qrType || "")}</Typography>
        </Grid>
      </Grid>
      {/*-----*/}
      <Grid container xs={8} alignItems="center" mt={0.5}>
        <Grid item xs={1}>
          {/*<Avatar*/}
          {/*  sx={{ bgcolor: themeConfig().palette.primary.main }}>*/}
          <ElectricBoltIcon sx={getSx(theme)}/>
          {/*</Avatar>*/}
        </Grid>
        <Grid item ml={3}>
          <Typography variant="caption">Mode</Typography>
          <Typography>{qrData.isDynamic ? "Dynamic" : "Static"}</Typography>
        </Grid>
      </Grid>
      {/*-----*/}
      <Grid container xs={8} alignItems="center" mt={0.5}>
        <Grid item xs={1}>
          {/*<Avatar*/}
          {/*  sx={{ bgcolor: themeConfig().palette.primary.main }}>*/}
          <PublicIcon sx={getSx(theme)}/>
          {/*</Avatar>*/}
        </Grid>
        <Grid item alignItems="center" ml={3}>
          <Typography variant="caption">Link</Typography>
          {qrLink ? (<div><Link href={qrLink.link}>{qrLink.link.split(
            "//")[1]}</Link></div>) : <div>No
            link</div>}
        </Grid>
      </Grid>
      {/*-----*/}
      <Grid container xs={8} alignItems="center" mt={0.5}>
        <Grid item xs={1}>
          {/*<Avatar*/}
          {/*  sx={{ bgcolor: themeConfig().palette.primary.main }}>*/}
          <PauseIcon sx={getSx(theme)}/>
          {/*</Avatar>*/}
        </Grid>
        <Grid item xs={3} alignItems="center" ml={3}>
          <Typography variant="caption">Paused?</Typography>
          <Typography>{qrLink?.paused ? "Yes" : "No"}</Typography>
        </Grid>

        {qrLink?.pausedById ?
          <>
            <Grid item xs={1}>
              {/*<Avatar*/}
              {/*  sx={{ bgcolor: themeConfig().palette.primary.main }}>*/}
              <PauseIcon sx={getSx(theme)}/>
              {/*</Avatar>*/}
            </Grid>
            <Grid item xs={3} ml={1} alignItems="center">
              <Typography variant="caption">Paused by</Typography>
              {/*@ts-ignore*/}
              <Typography>{qrLink.pausedById.name}</Typography>
            </Grid>
          </> : null
        }
      </Grid>
      {/*-----*/}
      <Grid container xs={8} alignItems="center" mt={0.5}>
        <Grid item xs={1}>
          {/*<Avatar*/}
          {/*  sx={{ bgcolor: themeConfig().palette.primary.main }}>*/}
          <TodayIcon sx={getSx(theme)}/>
          {/*</Avatar>*/}
        </Grid>
        <Grid item ml={3} alignItems="center">
          <Typography variant="caption">Created at</Typography>
          <Typography>{humanDate(
            new Date(qrData.createdAt).getTime())}</Typography>
        </Grid>
      </Grid>
      {/*-----*/}
      <Grid container xs={8} alignItems="center" mt={0.5}>
        <Grid item xs={1}>
          {/*<Avatar*/}
          {/*  sx={{ bgcolor: themeConfig().palette.primary.main }}>*/}
          <EventIcon sx={getSx(theme)}/>
          {/*</Avatar>*/}
        </Grid>
        <Grid item ml={3} alignItems="center">
          <Typography variant="caption">Last update</Typography>
          <Typography>{humanDate(
            new Date(qrData.updatedAt).getTime())}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QrDetail;

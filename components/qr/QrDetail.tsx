import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import PublicIcon from "@mui/icons-material/Public";
import PauseIcon from "@mui/icons-material/Pause";
import Link from "next/link";
import {humanDate} from "../helpers/generalFunctions";
import {sanitize} from "../../utils";
import {capitalize} from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import AbcIcon from "@mui/icons-material/Abc";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import TodayIcon from "@mui/icons-material/Today";
import EventIcon from "@mui/icons-material/Event";
import {useTheme} from "@mui/system";
import {getSx} from "../../helpers/qr/helpers";
import useMediaQuery from "@mui/material/useMediaQuery";

const QrDetail = ({qrData}: any) => {
  const qrLink = qrData.shortLinkId ? sanitize.link(qrData.shortLinkId) : null;
  const theme = useTheme();

  const isWide = useMediaQuery("(min-width:925px)", {noSsr: true});

  return (
    <Grid container spacing={2}>
      <Grid item xs={isWide ? 1 : 2}>
        <AbcIcon fontSize="medium" sx={getSx(theme)}/>
      </Grid>
      <Grid item xs={isWide ? 11 : 10}>
        <Typography sx={{fontWeight: 'bold'}}>Name</Typography>
        <Typography>{qrData.qrName}</Typography>
      </Grid>
      <Grid item xs={isWide ? 1 : 2}>
        <FormatSizeIcon fontSize="small" sx={getSx(theme)}/>
      </Grid>
      <Grid item xs={isWide ? 11 : 10}>
        <Typography sx={{fontWeight: 'bold'}}>Type</Typography>
        <Typography>{capitalize(qrData.qrType || "")}</Typography>
      </Grid>
      <Grid item xs={isWide ? 1 : 2}>
        <ElectricBoltIcon sx={getSx(theme)}/>
      </Grid>
      <Grid item xs={isWide ? 11 : 10}>
        <Typography sx={{fontWeight: 'bold'}}>Mode</Typography>
        <Typography>{qrData.isDynamic ? "Dynamic" : "Static"}</Typography>
      </Grid>
      <Grid item xs={isWide ? 1 : 2}>
        <PublicIcon sx={getSx(theme)}/>
      </Grid>
      <Grid item alignItems="center" xs={isWide ? 11 : 10}>
        <Typography sx={{fontWeight: 'bold'}}>Link</Typography>
        {qrLink ? (<div><Link href={qrLink.link}>{qrLink.link.split("//")[1]}</Link></div>) : <div>Nolink</div>}
      </Grid>
      <Grid item xs={isWide ? 1 : 2}>
        <PauseIcon sx={getSx(theme)}/>
      </Grid>
      <Grid item xs={isWide ? 11 : 10} alignItems="center">
        <Typography sx={{fontWeight: 'bold'}}>Paused?</Typography>
        <Typography>{qrLink?.paused ? "Yes" : "No"}</Typography>
      </Grid>

      {qrLink?.pausedById ?
        <>
          <Grid item xs={isWide ? 1 : 2}>
            <PauseIcon sx={getSx(theme)}/>
          </Grid>
          <Grid item xs={isWide ? 11 : 10} alignItems="center">
            <Typography sx={{fontWeight: 'bold'}}>Paused by</Typography>  {/* @ts-ignore */}
            <Typography>{qrLink.pausedById.name}</Typography>
          </Grid>
        </> : null
      }
      <Grid item xs={isWide ? 1 : 2}>
        <TodayIcon sx={getSx(theme)}/>
      </Grid>
      <Grid item xs={isWide ? 11 : 10} alignItems="center">
        <Typography sx={{fontWeight: 'bold'}}>Created</Typography>
        <Typography>{humanDate(new Date(qrData.createdAt).getTime())}</Typography>
      </Grid>
      <Grid item xs={isWide ? 1 : 2}>
        <EventIcon sx={getSx(theme)}/>
      </Grid>
      <Grid item xs={isWide ? 11 : 10} alignItems="center">
        <Typography sx={{fontWeight: 'bold'}}>Last update</Typography>
        <Typography>{humanDate(new Date(qrData.updatedAt).getTime())}</Typography>
      </Grid>
    </Grid>
  );
};

export default QrDetail;

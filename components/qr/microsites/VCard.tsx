import {useMemo} from "react";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RingVolumeIcon from '@mui/icons-material/RingVolume';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import WorkIcon from '@mui/icons-material/Work';

import MainMicrosite from "./MainMicrosite";
import RenderSocials from "./renderers/RenderSocials";
import {downloadVCard, getColors} from "./renderers/helper";

import {ColorTypes} from "../types/types";

import RenderField from "./renderers/RenderField";
import RenderAddress from "./renderers/RenderAddress";

interface VCardProps {
  newData: any;
}

export default function VCard({newData}: VCardProps) {
  function downloadFile() {
    downloadVCard({...newData});
  }

  const colors = useMemo(() => (getColors(newData)), []) as ColorTypes; // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainMicrosite colors={colors} url={newData.shortlinkurl} type={newData.qrType}>
      <CardContent>
        <Grid container spacing={1}>
          {(newData.prefix || newData.firstName || newData.lastName) && (
            <>
              <Grid item xs={1}>
                <AccountBoxIcon sx={{ color: colors.p }} />
              </Grid>
              <Grid item xs={11}>
                <Grid container spacing={1}>
                  {newData.prefix && <RenderField label="Prefix" value={newData.prefix}/>}
                  {newData.firstName && <RenderField label="First name"value={newData.firstName}/>}
                  {newData.lastName && <RenderField label="Last name" value={newData.lastName}/>}
                </Grid>
              </Grid>
            </>
          )}
          {(newData.cell || newData.phone || newData.fax) && (
            <>
              <Grid item xs={1}>
                <RingVolumeIcon sx={{ color: colors.p }} />
              </Grid>
              <Grid item xs={11}>
                <Grid container spacing={1}>
                  {newData.cell &&
                    <RenderField value={newData.cell} icon="cell" color={newData.secondary} size={newData.phone ? 6 : 12}/>}
                  {newData.phone &&
                    <RenderField value={newData.phone} icon="phone" color={newData.secondary}  size={newData.cellkate ? 6 : 12}/>}
                  {newData.fax && <RenderField label="Fax" value={newData.fax}/>}
                </Grid>
              </Grid>
            </>
          )}
          {(newData.organization || newData.position) && (
            <>
            <Grid item xs={1}>
              <WorkIcon sx={{ color: colors.p }} />
            </Grid>
            <Grid item xs={11}>
              <Grid container spacing={1}>
                {newData.organization && <RenderField label="Organization" value={newData.organization}/>}
                {newData.position && <RenderField label="Position" value={newData.position}/>}
              </Grid>
            </Grid>
            </>
          )}
          <RenderAddress newData={newData} colors={colors} />
          {(newData.email || newData.web) && (
            <>
            <Grid item xs={1}>
              <MarkAsUnreadIcon sx={{ color: colors.p }} />
            </Grid>
            <Grid item xs={11}>
              <Grid container spacing={1}>
                {newData.email && <RenderField label="Email" value={newData.email}/>}
                {newData.web && <RenderField label="Web" value={newData.web}/>}
              </Grid>
            </Grid>
            </>
          )}
          <RenderSocials newData={newData}/>
        </Grid>
      </CardContent>
      <CardActions>
        <Button variant="outlined" sx={{mt: "10px"}} onClick={downloadFile}>Get Contact</Button>
      </CardActions>
    </MainMicrosite>
  );
}

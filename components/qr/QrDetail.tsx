import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import React from "react";
import PublicIcon from "@mui/icons-material/Public";
import Link from "next/link";
import { humanDate } from "../helpers/generalFunctions";
import { sanitize } from "../../utils";
import Container from "@mui/material/Container";
import { capitalize } from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import AbcIcon from "@mui/icons-material/Abc";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import TodayIcon from "@mui/icons-material/Today";
import EventIcon from "@mui/icons-material/Event";
import RenderPreview from "./renderers/RenderPreview";
import { handleDesignerString } from "../../helpers/qr/helpers";
import { themeConfig } from "../../utils/theme";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import QrCodeIcon from "@mui/icons-material/QrCode";
import WebIcon from "@mui/icons-material/Web";
import RenderCellPhoneShape from "./helperComponents/RenderCellPhoneShape";
import RenderIframe from "../RenderIframe";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={ value !== index }
      id={ `preview-tabpanel-${ index }` }
      aria-labelledby={ `preview-tab-${ index }` }
      { ...other }
    >
      { value === index && (
        <Box sx={ { p: 3 } }>
          { children }
        </Box>
      ) }
    </div>
  );
};

const QrDetail = ({ qrData }: any) => {
  const [ value, setValue ] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const qrLink = qrData.shortLinkId ? sanitize.link(qrData.shortLinkId) : null;

  const renderQr = (qrOptions: any, value: string, qr: any) => {
    const options = { ...qrOptions };
    if (!options.image?.trim().length) {
      options.image = null;
    }
    options.data = value;
    // @ts-ignore
    return <RenderPreview qrDesign={ options } qr={ qr } width={ 250 } />;
  };

  const renderPreview = (src: string, forbidStyle?: boolean) => (
    <Box sx={ { ml: !forbidStyle ? "20px" : 0, mt: !forbidStyle ? "60px" : 0 } }>
      <RenderCellPhoneShape width={ 270 } height={ 570 } offlineText="The selected card has no available sample">
        <RenderIframe width="256px" height="536px" src={ src } />
      </RenderCellPhoneShape>
    </Box>
  );

  return (
    <Grid container>
      <Grid item xs={ 8 }>
        <Grid container>
          <Grid container xs={ 8 } alignItems="center">
            <Grid item xs={ 1 }>
              <AbcIcon fontSize="large" sx={ { color: themeConfig().palette.primary.main } } />
            </Grid>
            <Divider orientation="vertical" />
            <Grid item xs={ 7 } mb={ 2 } ml={ 1 } alignItems="center">
              <Typography variant="caption">Name</Typography>
              <Typography>{ qrData.qrName }</Typography>
            </Grid>
          </Grid>
          {/*-----*/ }
          <Grid container xs={ 8 } alignItems="center">
            <Grid item xs={ 1 }>
              <FormatSizeIcon sx={ { color: themeConfig().palette.primary.main } } />
            </Grid>
            <Divider orientation="vertical" />
            <Grid item xs={ 7 } mb={ 2 } ml={ 1 } alignItems="center">
              <Typography variant="caption">Type</Typography>
              <Typography>{ capitalize(qrData.qrType) }</Typography>
            </Grid>
          </Grid>
          {/*-----*/ }
          <Grid container xs={ 8 } alignItems="center">
            <Grid item xs={ 1 }>
              <ElectricBoltIcon sx={ { color: themeConfig().palette.primary.main } } />
            </Grid>
            <Divider orientation="vertical" />
            <Grid item xs={ 7 } mb={ 2 } ml={ 1 } alignItems="center">
              <Typography variant="caption">Mode</Typography>
              <Typography>{ qrData.isDynamic ? "Dynamic" : "Static" }</Typography>
            </Grid>
          </Grid>
          {/*-----*/ }
          <Grid container xs={ 8 } alignItems="center">
            <Grid item xs={ 1 }>
              <PublicIcon sx={ { color: themeConfig().palette.primary.main } } />
            </Grid>
            <Divider orientation="vertical" />
            <Grid item xs={ 7 } mb={ 2 } ml={ 1 } alignItems="center">
              <Typography variant="caption">Link</Typography>
              { qrLink ? (<div><Link href={ qrLink.link }>{ qrLink.link.split("//")[1] }</Link></div>) : <div>No
                link</div> }
            </Grid>
          </Grid>

          <Grid container xs={ 8 } alignItems="center">
            <Grid item xs={ 1 }>
              <TodayIcon sx={ { color: themeConfig().palette.primary.main } } />
            </Grid>
            <Divider orientation="vertical" />
            <Grid item xs={ 7 } mb={ 2 } ml={ 1 } alignItems="center">
              <Typography variant="caption">Created at</Typography>
              <Typography>{ humanDate(new Date(qrData.createdAt).getTime()) }</Typography>
            </Grid>
          </Grid>

          <Grid container xs={ 8 } alignItems="center">
            <Grid item xs={ 1 }>
              <EventIcon sx={ { color: themeConfig().palette.primary.main } } />
            </Grid>
            <Divider orientation="vertical" />
            <Grid item xs={ 7 } mb={ 2 } ml={ 1 } alignItems="center">
              <Typography variant="caption">Last update</Typography>
              <Typography>{ humanDate(new Date(qrData.updatedAt).getTime()) }</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={ 4 }>
        <Box sx={ { borderBottom: 1, borderColor: "divider", width: "100%" } }>
          <Tabs
            value={ value }
            onChange={ handleChange }
            variant="fullWidth"
            sx={ { height: "30px", alignItems: "center" } }

          >
            <Tab icon={ <QrCodeIcon /> } iconPosition="start" label="QR Code" />
            <Tab icon={ <WebIcon /> } iconPosition="start" label="Microsite" />
          </Tabs>
        </Box>
        <TabPanel value={ value } index={ 0 }>
          <Container fixed>
            { renderQr(qrData.qrOptionsId, !qrData.isDynamic ? handleDesignerString(qrData.qrType, qrData) : qrData.qrOptionsId.data, qrData) }
          </Container>
        </TabPanel>
        <TabPanel value={ value } index={ 1 }>
          { qrLink ? renderPreview(qrLink.link, true) : "Static QRs do not have a microsite" }
        </TabPanel>
      </Grid>
    </Grid>
  );
};

export default QrDetail;
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import LaptopIcon from "@mui/icons-material/Laptop";
import MapIcon from "@mui/icons-material/Map";
import VisitTechnologyDetails from "./VisitTechnologyDetails";
import VisitLocationDetails from "./VisitLocationDetails";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {getSx} from "../../helpers/qr/helpers";
import {useTheme} from "@mui/system";

interface VisitDetailsProps {
  visitData: any;
  visitCount: number;
}

const VisitDetailsSections = ({ visitData, visitCount }: VisitDetailsProps) => {
  const theme = useTheme();
  const total = visitCount || visitData?.total || 0;

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper", mt: '-20px' }}>
      <ListItem sx={{width: '100%', background: 'rgba(181,181,181,0.05)'}}>
        <Stack direction="row" alignItems="center" spacing={2} justifyContent="end">
          <Typography variant="h3" sx={{color: total > 0 ? "blue" : "red"}}>{total}</Typography>
          <Typography>Visits</Typography>
        </Stack>
      </ListItem>
      <ListItem>
        <ListItemAvatar><LaptopIcon sx={getSx(theme)} /></ListItemAvatar>
        <ListItemText primary="Technology"
          secondary="What apps have accessed the Short URL, either by scanning the QR code or by visiting the link directly?" />
      </ListItem>
      <ListItem>
        <VisitTechnologyDetails visitData={ visitData || {} } />
      </ListItem>
      <ListItem>
        <ListItemAvatar><MapIcon sx={getSx(theme)}/></ListItemAvatar>
        <ListItemText primary="Locations"
          secondary="What continents, countries and cities are your visitors from?" />
      </ListItem>
      <ListItem>
        <VisitLocationDetails visitData={ visitData || {} } />
      </ListItem>
    </List>
  );
};

export default VisitDetailsSections;

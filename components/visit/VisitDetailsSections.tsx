import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import LaptopIcon from "@mui/icons-material/Laptop";
import MapIcon from "@mui/icons-material/Map";
import ListContext from "@mui/material/List/ListContext";
import VisitTechnologyDetails from "./VisitTechnologyDetails";
import VisitLocationDetails from "./VisitLocationDetails";

const VisitDetailsSections = ({ visitData }: any) => {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <LaptopIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Technology"
          secondary="What apps and websites have accessed the link attached to your QR?" />
      </ListItem>
      <ListItem>
        <VisitTechnologyDetails visitData={visitData}/>
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <MapIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Locations"
          secondary="What continents, countries and cities are your visitors from?" />
      </ListItem>
      <ListItem>
        <VisitLocationDetails visitData={visitData}/>
      </ListItem>
    </List>
  );
};

export default VisitDetailsSections;
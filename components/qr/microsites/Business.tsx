import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import MainMicrosite from "./MainMicrosite";
import RenderSocials from "./renderers/RenderSocials";
import Box from "@mui/material/Box";
import WorkIcon from "@mui/icons-material/Work";
import MarkAsUnreadIcon from "@mui/icons-material/MarkAsUnread";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DoneAllIcon from '@mui/icons-material/DoneAll';

import SquareSelector from "../helperComponents/SquareSelector";
import {DAYS} from "../constants";
import {ColorTypes, OpeningObjType} from "../types/types";
import {useMemo} from "react";
import {getColors} from "./renderers/helper";
import RenderField from "./renderers/RenderField";
import RenderAddress from "./renderers/RenderAddress";

interface BusinessProps {
  newData: any;
}

export default function Business({newData}: BusinessProps) {
  const colors = useMemo(() => (getColors(newData)), []) as ColorTypes; // eslint-disable-line react-hooks/exhaustive-deps

  const renderEasiness = (item: string, label: string) => (
    <SquareSelector
      selected={false}
      tooltips
      item={item}
      label={label}
      colors={colors}
    />
  );

  const handleTiming = (value: string): string => {
    let hours = +value.slice(0, 2);
    let mins = +value.slice(2);
    let minutes = mins < 10 ? `0${mins}` : `${mins}`;
    if (newData.is12hours) {
      if (hours >= 12) {
        hours = 24 - hours;
        hours = 12 - hours;
        minutes += ' pm';
      } else {
        minutes += ' am';
      }
    }
    return `${hours}:${minutes}`;
  }

  return (
    <MainMicrosite colors={colors} url={newData.shortlinkurl} type={newData.qrType}>
      <CardContent>
        <Grid container spacing={1}>
          {(newData.company || newData.title || newData.subtitle || newData.web || newData.email || newData.contact ||
            newData.phone || newData.about) && (
            <>
              <Grid item xs={1}>
                <WorkIcon sx={{color: colors.p}}/>
              </Grid>
              <Grid item xs={11}>
                <Grid container spacing={1}>
                  {newData.company && <RenderField label="Company" value={newData.company}/>}
                  {newData.title && <RenderField label="Title" value={newData.title}/>}
                  {newData.subtitle && <RenderField label="Sub title" value={newData.subtitle}/>}
                  {newData.web && <RenderField label="Web" value={newData.web} icon="world" color={newData.secondary}/>}
                  {newData.contact && <RenderField label="Contact" value={newData.contact} icon="contact" color={newData.secondary}/>}
                  {newData.email && <RenderField label="" value={newData.email} icon="emailIcon" color={newData.secondary}/>}
                  {newData.phone && <RenderField label="" value={newData.phone} icon="phone" color={newData.secondary}/>}
                  {newData.about && <RenderField label="" value={newData.about} icon="about" color={newData.secondary}/>}
                </Grid>
              </Grid>
            </>
          )}
          <RenderAddress newData={newData} colors={colors} />
          {(newData.email || newData.web) && (
            <>
              <Grid item xs={1}>
                <MarkAsUnreadIcon sx={{color: colors.p}}/>
              </Grid>
              <Grid item xs={11}>
                <Grid container spacing={1}>
                  {newData.email && <RenderField label="Email" value={newData.email}/>}
                  {newData.web && <RenderField label="Web" value={newData.web}/>}
                </Grid>
              </Grid>
            </>
          )}
          {newData.easiness && (
            <>
              <Grid item xs={1}>
                <DoneAllIcon sx={{color: colors.p}}/>
              </Grid>
              <Grid item xs={11}>
                <Typography sx={{ fontWeight: 'bold' }}>{'Easiness'}</Typography>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: 'fit-content'
                  // margin: '0 auto'
                }}>
                  {newData.easiness.wifi && renderEasiness('wifi', 'WiFi')}
                  {newData.easiness.accessible && renderEasiness('accessible', 'Accessible')}
                  {newData.easiness.health && renderEasiness('health', 'Health')}
                  {newData.easiness.toilet && renderEasiness('toilet', 'Toilets')}
                  {newData.easiness.seat && renderEasiness('seat', 'Seats')}
                  {newData.easiness.child && renderEasiness('child', 'Children friendly')}
                  {newData.easiness.pets && renderEasiness('pets', 'Pets friendly')}
                  {newData.easiness.park && renderEasiness('park', 'Parks or open spaces')}
                  {newData.easiness.restaurant && renderEasiness('restaurant', 'Restaurant')}
                  {newData.easiness.cafe && renderEasiness('cafe', 'Cafeteria')}
                  {newData.easiness.bar && renderEasiness('bar', 'Bar')}
                  {newData.easiness.fastfood && renderEasiness('fastfood', 'Fast food')}
                  {newData.easiness.bed && renderEasiness('bed', 'Bedrooms')}
                  {newData.easiness.shower && renderEasiness('shower', 'Showers')}
                  {newData.easiness.gym && renderEasiness('gym', 'Sports friendly')}
                  {newData.easiness.smoking && renderEasiness('smoking', 'Smoking areas')}
                  {newData.easiness.climate && renderEasiness('climate', 'Climate')}
                  {newData.easiness.training && renderEasiness('training', 'Training')}
                  {newData.easiness.parking && renderEasiness('parking', 'Parking')}
                  {newData.easiness.train && renderEasiness('train', 'Train')}
                  {newData.easiness.bus && renderEasiness('bus', 'Bus')}
                  {newData.easiness.taxi && renderEasiness('taxi', 'Taxi')}
                </Box>
              </Grid>
            </>)}
          {Object.keys(newData.openingTime || []).length ? (
            <>
            <Grid item xs={1}>
              <ScheduleIcon sx={{color: colors.p}}/>
            </Grid>
            <Grid item xs={11}>
              {Object.keys(newData.openingTime).map((x: string) => (
                <>
                  {/* @ts-ignore */}
                  <Typography sx={{fontWeight: 'bold', ml: 2}}>{DAYS[x]}</Typography>
                  {newData.openingTime[x].map((open: OpeningObjType) => {
                    return (<Box sx={{display: 'inline-flex', ml: 4}} key={`day${x}`}>
                      <Typography
                        sx={{display: 'inline-flex', mr: '5px'}}>{'From ' + handleTiming(open.ini)}</Typography>
                      <Typography sx={{display: 'inline-flex'}}>{' to ' + handleTiming(open.end)}</Typography>
                    </Box>);
                  })}
                </>
              ))}
            </Grid>
            </>
          ) : null}
          <RenderSocials newData={newData}/>
        </Grid>
      </CardContent>
    </MainMicrosite>
  );
}

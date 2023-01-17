import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import {CardDataProps, DataType, OpeningDaysType, OpeningType} from "../../types/types";
import {DAYS} from "../../constants";
import RenderTimeSelector from "../helpers/RenderTimeSelector";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import {getHM} from "../../../helpers/generalFunctions";

const getInitial = () => ({ini: getHM(new Date()), end: getHM(new Date())});

export default function RenderOpeningTime({data, setData}: CardDataProps) {
  const handleFormat = (is: boolean) => () => {
    if (is) {
      setData((prev: DataType) => ({...prev, is12hours: is}));
    } else if (data.is12hours !== undefined) {
      setData((prev: DataType) => {
        const dt = {...prev};
        delete dt.is12hours;
        return dt;
      });
    }
  }

  const handleWorkingDay = (day: string) => () => {
    setData((prev: DataType) => {
      const dt = {...prev};
      if (!dt.openingTime) {
        dt.openingTime = {};
      } // @ts-ignore
      if (!dt.openingTime[day]) { // @ts-ignore
        dt.openingTime[day] = [getInitial()];
      } else { // @ts-ignore
        delete dt.openingTime[day];
      }
      return dt;
    });
  }

  const renderWorkingDay = (day: string) => { // @ts-ignore
    const selected = data.openingTime?.[day] !== undefined as boolean;
    return (<Button key={`btn${day}`} sx={{minWidth: '38px'}} onClick={handleWorkingDay(day)}
                    variant={selected ? 'contained' : 'outlined'}>{day}</Button>);
  }

  const handleOption = (x: string, index: number) => () => {
    setData((prev: DataType) => {
      const d = {...prev};
      if (index === 0) { //aims to add
        // @ts-ignore
        d.openingTime[x].push(getInitial());
      } else { // @ts-ignore
        d.openingTime[x].splice(index, 1);
      }
      return d;
    })
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={3}>
        <Typography>{'Format'}</Typography>
        <ButtonGroup size="small" aria-label="timing" disableElevation fullWidth>
          {[
            <Button onClick={handleFormat(true)} key="twelve" variant={data.is12hours ? 'contained' : 'outlined'}>
              {'12hrs'}
            </Button>,
            <Button onClick={handleFormat(false)} key="twentyfour" variant={!data.is12hours ? 'contained' : 'outlined'}>
              {'24hrs'}
            </Button>
          ]}
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Typography>{'Working days'}</Typography>
        <ButtonGroup size="small" aria-label="timing" disableElevation fullWidth>
          {[renderWorkingDay('sun'), renderWorkingDay('mon'), renderWorkingDay('tue'),
            renderWorkingDay('wed'), renderWorkingDay('thu'), renderWorkingDay('fri'),
            renderWorkingDay('sat')]}
        </ButtonGroup>
      </Grid>
      {Object.keys(data.openingTime || {}).length ? (
        <Grid item xs={12}>
          <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%'}}>
          {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((x: string) => { // @ts-ignore
            if (!data.openingTime[x]) { return null; } // @ts-ignore
            const values = data.openingTime?.[x] || [] as OpeningType; // @ts-ignore
            const day = DAYS[x];
            return (
              <Paper elevation={2} sx={{mr: '10px', mb: '5px', p: 1, minWidth: '318px', maxWidth: 'calc(50% - 15px)'}} key={`day${day}`}>
                <Typography sx={{fontWeight: 'bold'}}>{day}</Typography>
                {values.map((timing: OpeningDaysType, index: number) => {
                  const disabled = index === 0 && values.length === 2;
                  return (
                    <Box sx={{width: '100%', display: 'flex'}} key={`item${day}`}>
                      <Box sx={{width: 'calc(50% - 20px)'}}>
                        <RenderTimeSelector data={data} setData={setData} day={x} ini index={index}/>
                      </Box>
                      <Box sx={{width: 'calc(50% - 20px)', ml: '5px'}}>
                        <RenderTimeSelector data={data} setData={setData} day={x} ini={false} index={index}/>
                      </Box>
                      <Box sx={{width: '30px', ml: '5px'}}>
                        <IconButton disabled={disabled} onClick={handleOption(x, index)} sx={{mt: '5px'}}>
                          {index === 0 ? <AddIcon color={!disabled ? "primary" : "disabled"}/> :
                            <DeleteIcon color="error"/>}
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Paper>
            );
          })}
          </Box>
        </Grid>
      ) : null}
    </Grid>
  );
}

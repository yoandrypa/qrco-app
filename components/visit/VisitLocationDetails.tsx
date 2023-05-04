import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

const createData = (name: string, visits: number) => ({ name, visits });

const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

const updater = (list: any, value: number): void => {
  const other = list.find((x: {name: string}) => x.name === 'undefined');
  if (other !== undefined) {
    other.visits += value;
  } else {
    list.push(createData('undefined', value));
  }
}

interface Row { name: string, visits: number }

export default function VisitTechnologyDetails({ visitData, total }: any) {
  const countriesRows: Row[] = [];
  // @ts-ignore
  Object.keys(visitData.countries || {}).forEach(country => countriesRows.push(createData(country, visitData.countries[country])));

  const countryTotal = countriesRows.reduce((acum, x) => acum + x.visits, 0);
  if (countryTotal < total) { updater(countriesRows, total - countryTotal); }

  const citiesRows: Row[] = [];
  // @ts-ignore
  Object.keys(visitData.cities || {}).forEach((city) => citiesRows.push(createData(city, visitData.cities[city])));
  const cityTotal = citiesRows.reduce((acum, x) => acum + x.visits, 0);
  if (cityTotal < total) { updater(citiesRows, total - cityTotal); }

  return (
    <Stack direction="column" spacing={2} width={"100%"}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          {/*Countries*/}
          <TableHead>
            <TableRow>
              <TableCell>Countries</TableCell>
              <TableCell align="center" sx={{ width: 100 }}>Visits</TableCell>
              <TableCell align="right" sx={{ width: 100 }}>%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countriesRows.map((row, index) => {
              let name;
              try {
                name = regionNames.of(row.name);
              } catch {
                name = 'Unknown';
              }
              const percent = Math.round((row.visits * 100 / total) * 100) / 100;
              return (
                <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">{name}</TableCell>
                  <TableCell align="right" sx={{ width: 400 }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-around">
                      <LinearProgress variant="determinate" value={percent} sx={{width: "90%"}}/>
                      <>{row.visits}</>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">{percent}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          {/*Cities*/}
          <TableHead>
            <TableRow>
              <TableCell>Cities</TableCell>
              <TableCell align="center" sx={{ width: 100 }}>Visits</TableCell>
              <TableCell align="right" sx={{ width: 100 }}>%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citiesRows.map((row, index) => {
              const percent = Math.round((row.visits * 100 / total) * 100) / 100;
              return (
                <TableRow key={index} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                  <TableCell component="th" scope="row">{!row.name || row.name === 'undefined' ? 'Unknown' : row.name}</TableCell>
                  <TableCell align="right" sx={{width: 400}}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-around">
                      <LinearProgress variant="determinate" value={percent} sx={{width: "90%"}}/>
                      <>{row.visits}</>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">{percent}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

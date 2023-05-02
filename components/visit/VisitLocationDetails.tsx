import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

const createData = (name: string, visits: number, total: number) => (
  { name, visits, percent: Math.round((visits * 100 / total) * 10) / 10 }
);

const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

export default function VisitTechnologyDetails({ visitData }: any) {
  let countriesRows: { name: string, visits: number, percent: number }[] = [];
  // @ts-ignore
  Object.keys(visitData.countries || {}).forEach(country => countriesRows.push(
    createData(country, visitData.countries[country], visitData.total)
  ));

  let citiesRows: { name: string, visits: number, percent: number }[] = [];
  // @ts-ignore
  Object.keys(visitData.cities || {}).forEach((city) => citiesRows.push(
    createData(city, visitData.cities[city], visitData.total)
  ));

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
            {countriesRows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">{regionNames.of(row.name)}</TableCell>
                <TableCell align="right" sx={{ width: 400 }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-around">
                    <LinearProgress variant="determinate" value={row.percent} sx={{width: "90%"}}/>
                    <>{row.visits}</>
                  </Stack>
                </TableCell>
                <TableCell align="right">{row.percent}</TableCell>
              </TableRow>
            ))}
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
            {citiesRows.map((row, index) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">{row.name}</TableCell>
                <TableCell align="right" sx={{ width: 400 }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-around">
                    <LinearProgress variant="determinate" value={row.percent} sx={{width: "90%"}}/>
                    <>{row.visits}</>
                  </Stack>
                </TableCell>
                <TableCell align="right">{row.percent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

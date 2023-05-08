import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

const createData = (name: string, visits: number) => ({name, visits});

const updater = (list: any, value: number): void => {
  const other = list.find((x: {name: string}) => x.name === 'Other');
  if (other !== undefined) {
    other.visits += value;
  } else {
    list.push(createData("Other", value));
  }
}

export default function VisitTechnologyDetails({ visitData, total }: any) {
  const deviceRows = [];
  if (visitData.dv_mobile > 0) { deviceRows.push(createData("Mobile", visitData.dv_mobile)); }
  if (visitData.dv_desktop > 0) { deviceRows.push(createData("Desktop", visitData.dv_desktop)); }
  if (visitData.dv_laptop > 0) { deviceRows.push(createData("Laptop", visitData.dv_laptop)); }
  if (visitData.dv_tablet > 0) { deviceRows.push(createData("Tablet", visitData.dv_tablet)); }
  if (visitData.dv_smarttv > 0) { deviceRows.push(createData("Smart TV", visitData.dv_smarttv)); }
  if (visitData.dv_hybrid > 0) { deviceRows.push(createData("Hybrid", visitData.dv_hybrid)); }
  if (visitData.dv_other > 0) { deviceRows.push(createData("Other", visitData.dv_other)); }

  if (visitData.dv_undefined > 0) { updater(deviceRows, visitData['dv_undefined']); }
  const dvTotal = deviceRows.reduce((acum, x) => acum + x.visits, 0);
  if (dvTotal < total) { updater(deviceRows, total - dvTotal); }

  const osRows = [];
  if (visitData.os_android > 0) { osRows.push(createData("Android", visitData.os_android)); }
  if (visitData.os_ios > 0) { osRows.push(createData("iOS", visitData.os_ios)); }
  if (visitData.os_linux > 0) { osRows.push(createData("Linux", visitData.os_linux)); }
  if (visitData.os_macos > 0) { osRows.push(createData("MacOS", visitData.os_macos)); }
  if (visitData.os_windows > 0) { osRows.push(createData("Windows", visitData.os_windows)); }
  if (visitData.os_chromeos > 0) { osRows.push(createData("Chrome OS", visitData.os_chromeos)); }
  if (visitData.os_tizen > 0) { osRows.push(createData("Tizen", visitData.os_tizen)); }
  if (visitData.os_other > 0) { osRows.push(createData("Other", visitData.os_other)); }

  if (visitData.os_undefined > 0) { updater(osRows, visitData['os_undefined']); }
  const osTotal = osRows.reduce((acum, x) => acum + x.visits, 0);
  if (osTotal < total) { updater(osRows, total - osTotal); }

  const browserRows = [];
  if (visitData.br_chrome > 0) { browserRows.push(createData("Chrome", visitData.br_chrome)); }
  if (visitData.br_firefox > 0) { browserRows.push(createData("Firefox", visitData.br_firefox)); }
  if (visitData.br_edge > 0) { browserRows.push(createData("Edge", visitData.br_edge)); }
  if (visitData.br_samsungBrowser > 0) { browserRows.push(createData("Samsung Browser", visitData.br_samsungBrowser)); }
  if (visitData.br_opera > 0) { browserRows.push(createData("Opera", visitData.br_opera)); }
  if (visitData.br_safari > 0) { browserRows.push(createData("Safari", visitData.br_safari)); }
  if (visitData.br_ie > 0) { browserRows.push(createData("IE", visitData.br_ie)); }
  if (visitData.br_other > 0) { browserRows.push(createData("Other", visitData.br_other)); }

  if (visitData.br_undefined > 0) { updater(browserRows, visitData['br_undefined']); }
  const brTotal = browserRows.reduce((acum, x) => acum + x.visits, 0);
  if (brTotal < total) { updater(browserRows, total - brTotal); }

  return (
    <Stack direction="column" spacing={2} width={"100%"}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          {/*Devices*/}
          <TableHead>
            <TableRow>
              <TableCell>Devices</TableCell>
              <TableCell align="center" sx={{ width: 100 }}>Visits</TableCell>
              <TableCell align="right" sx={{ width: 100 }}>%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceRows.map((row, index) => {
              const percent = Math.round((row.visits * 100 / total) * 100) / 100;
              return (
                <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">{row.name}</TableCell>
                  <TableCell align="right" sx={{ width: 400 }}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-around">
                      <LinearProgress variant="determinate" value={percent} sx={{width: "90%"}}/>
                      <>{row.visits}</>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ width: 100 }}>{percent}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          {/*OS*/}
          <TableHead>
            <TableRow>
              <TableCell>Operating Systems</TableCell>
              <TableCell align="center" sx={{ width: 100 }}>Visits</TableCell>
              <TableCell align="right" sx={{ width: 100 }}>%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {osRows.map((row, index) => {
              const percent = Math.round((row.visits * 100 / total) * 100) / 100;
              return (
                <TableRow key={index} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                <TableCell component="th" scope="row">{row.name}</TableCell>
                <TableCell align="right" sx={{width: 400}}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-around">
                    <LinearProgress variant="determinate" value={percent} sx={{width: "90%"}}/>
                    <>{row.visits}</>
                  </Stack>
                </TableCell>
                <TableCell align="right" sx={{width: 100}}>{percent}</TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          {/*OS*/}
          <TableHead>
            <TableRow>
              <TableCell>Browsers</TableCell>
              <TableCell align="center" sx={{ width: 100 }}>Visits</TableCell>
              <TableCell align="right" sx={{ width: 100 }}>%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {browserRows.map((row, index) => {
              const percent = Math.round((row.visits * 100 / total) * 100) / 100;
              return (
                <TableRow key={index} sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                  <TableCell component="th" scope="row">{row.name}</TableCell>
                  <TableCell align="right" sx={{width: 400}}>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-around">
                      <LinearProgress variant="determinate" value={percent} sx={{width: "90%"}}/>
                      <>{row.visits}</>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{width: 100}}>{percent}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

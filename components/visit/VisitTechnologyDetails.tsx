import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

function createData(
  name: string,
  visits: number,
  total: number
) {
  return {
    name,
    visits,
    percent: Math.round((visits * 100 / total) * 100) / 100
  };
}

export default function VisitTechnologyDetails({ visitData }: any) {
  let deviceRows = [];
  if (visitData.dv_mobile > 0) {
    deviceRows.push(createData("Movile", visitData.dv_mobile, visitData.total));
  }
  if (visitData.dv_desktop > 0) {
    deviceRows.push(createData("Desktop", visitData.dv_desktop, visitData.total));
  }
  if (visitData.dv_tablet > 0) {
    deviceRows.push(createData("Tablet", visitData.dv_tablet, visitData.total));
  }
  if (visitData.dv_smarttv > 0) {
    deviceRows.push(createData("Smart TV", visitData.dv_smarttv, visitData.total));
  }

  let osRows = [];
  if (visitData.os_android > 0) {
    osRows.push(createData("Android", visitData.os_android, visitData.total));
  }
  if (visitData.os_ios > 0) {
    osRows.push(createData("iOS", visitData.os_ios, visitData.total));
  }
  if (visitData.os_linux > 0) {
    osRows.push(createData("Linux", visitData.os_linux, visitData.total));
  }
  if (visitData.os_macos > 0) {
    osRows.push(createData("MacOS", visitData.os_macos, visitData.total));
  }
  if (visitData.os_other > 0) {
    osRows.push(createData("Other", visitData.os_other, visitData.total));
  }

  return (
    <Stack direction="column" spacing={2} width={"100%"}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          {/*Devices*/}
          <TableHead>
            <TableRow>
              <TableCell>Devices</TableCell>
              <TableCell align="right">Visits</TableCell>
              <TableCell align="right">%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceRows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">{row.name}</TableCell>
                <TableCell align="right" sx={{ width: 100 }}>{row.visits}</TableCell>
                <TableCell align="right" sx={{ width: 100 }}>{row.percent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          {/*OS*/}
          <TableHead>
            <TableRow>
              <TableCell>Operating Systems</TableCell>
              <TableCell align="right">Visits</TableCell>
              <TableCell align="right">%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {osRows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">{row.name}</TableCell>
                <TableCell align="right" sx={{ width: 100 }}>{row.visits}</TableCell>
                <TableCell align="right" sx={{ width: 100 }}>{row.percent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
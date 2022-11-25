import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(
  name: string,
  visits: number,
  total: number
) {
  return {
    name,
    visits,
    percent: visits * 100 / total
  };
}

export default function VisitTechnologyDetails({ visitData }: any) {
  let continentRows: { name, visits, percent }[] = [];
  Object.keys(visitData.continents).forEach(continent => continentRows.push(continent, visitData.continents[continent], visitData.total));
  let countriesRows = [];
  Object.keys(visitData.countries).forEach(country => countriesRows.push(country, visitData.countries[country], visitData.total));
  let citiesRows = [];
  Object.keys(visitData.cities).forEach(city => citiesRows.push(city, visitData.cities[city], visitData.total));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        {/*Continents*/}
        <TableHead>
          <TableRow>
            <TableCell>Continent</TableCell>
            <TableCell align="right">Visits</TableCell>
            <TableCell align="right">%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {continentRows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">{row.name}</TableCell>
              <TableCell align="right">{row.visits}</TableCell>
              <TableCell align="right">{row.percent}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/*Countries*/}
        <TableHead>
          <TableRow>
            <TableCell>Country</TableCell>
            <TableCell align="right">Visits</TableCell>
            <TableCell align="right">%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countriesRows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">{row.name}</TableCell>
              <TableCell align="right">{row.visits}</TableCell>
              <TableCell align="right">{row.percent}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/*Cities*/}
        <TableHead>
          <TableRow>
            <TableCell>City</TableCell>
            <TableCell align="right">Visits</TableCell>
            <TableCell align="right">%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {citiesRows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">{row.name}</TableCell>
              <TableCell align="right">{row.visits}</TableCell>
              <TableCell align="right">{row.percent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
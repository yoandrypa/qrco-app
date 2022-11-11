import React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Router from "next/router";
import * as DomainHandler from "../../handlers/domains";

interface Column {
  id: "id" |
    "address" |
    "homepage" |
    "actions";
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: string) => any;
}

const columns: readonly Column[] = [
  {
    id: "address",
    label: "Domain",
    minWidth: 300,
    maxWidth: 300
  },
  {
    id: "homepage",
    label: "Homepage",
    minWidth: 150,
    maxWidth: 150
  },
  {
    id: "actions",
    label: "",
    minWidth: 140,
    maxWidth: 140,
    align: "right"
  }
];

interface Data extends DomainType {
  actions: any;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  }
}));

const deleteDomain = async (userId: string, createdAt: number) => {
  const deleted = await DomainHandler.remove({ userId, createdAt });
  if (deleted) {
    Router.push("/settings");
  }
};

// @ts-ignore
const DomainsTable = ({ domains }) => {
  const createData = (
    banned: boolean | undefined,
    bannedById: string | undefined,
    address: string,
    homepage: string | undefined,
    userId: string,
    createdAt: number
  ): Data => {
    const actions = (
      <IconButton size="small" onClick={() => deleteDomain(userId, createdAt)}>
        <DeleteIcon fontSize="small" color="error" />
      </IconButton>
    );
    return {
      banned,
      bannedById,
      address,
      homepage,
      userId,
      createdAt,
      actions
    };
  };

  const rows = domains.map((domain: DomainType) => {
    return createData(
      domain.banned,
      domain.bannedById,
      domain.address,
      domain.homepage,
      domain.userId,
      domain.createdAt
    );
  });

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }} variant="outlined">
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableCell
                    key={column.id + "_head"}
                    align={column.align}
                  >
                    {column.label}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .map((row: Data) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.createdAt}>
                      {columns.map((column) => {
                        // @ts-ignore
                        const value = row[column.id];
                        return (
                          <StyledTableCell
                            key={column.id + "_body"}
                            align={column.align}
                            style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                          >
                            {column.format && typeof value === "string"
                              ? column.format(value)
                              : value}
                          </StyledTableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default DomainsTable;

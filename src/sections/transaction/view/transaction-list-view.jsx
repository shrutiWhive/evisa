import { useState, useEffect } from "react";
import { useSetState } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";

import { paths } from "src/routes/paths";

import { fIsAfter, fIsBetween } from "src/utils/format-time";

import { DashboardContent } from "src/layouts/dashboard";

import { Scrollbar } from "src/components/scrollbar";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "src/components/table";

import { useGetTransactions } from "src/api";

import { TransactionTableRow } from "../transaction-table-row";
import { TransactionTableToolbar } from "../transaction-table-toolbar";
import { TransactionTableFiltersResult } from "../transaction-table-filters-result";

const TABLE_HEAD = [
  { id: "sn", label: "SN" },
  { id: "amount", label: "Amount" },
  { id: "type", label: "Type" },
  { id: "balance_after", label: "Balance After" },
  { id: "created_at", label: "Created At" },
];

// ----------------------------------------------------------------------

export function TransactionListView() {
  const table = useTable();

  const { transactions } = useGetTransactions();

  const [tableData, setTableData] = useState(transactions);

  useEffect(() => {
    setTableData(transactions);
  }, [transactions]);

  const filters = useSetState({
    name: "",
    role: [],
    startDate: null,
    endDate: null,
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const canReset =
    !!currentFilters.name ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Transaction", href: paths.dashboard.transaction.root },
          { name: "List" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <TransactionTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
        />

        {canReset && (
          <TransactionTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: "relative" }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
              )
            }
          />

          <Scrollbar>
            <Table
              size={table.dense ? "small" : "medium"}
              sx={{ minWidth: 960 }}
            >
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <TransactionTableRow
                      key={row.id}
                      serialNumber={index + 1}
                      row={row}
                      index ={index}
                    />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    dataFiltered.length
                  )}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, role, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((user) =>
      user.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) =>
        fIsBetween(order.created_at, startDate, endDate)
      );
    }
  }

  return inputData;
}

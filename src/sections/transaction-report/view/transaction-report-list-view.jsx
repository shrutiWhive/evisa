import { Box, Card, CardHeader, Table, TableBody } from "@mui/material";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from "src/components/table";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { selectReport } from "src/redux/selectors";
import { useEffect } from "react";
import { useSetState } from "minimal-shared/hooks";
import { Scrollbar } from "src/components/scrollbar";
import { fetchTransactionRequest } from "src/redux/actions/report-action";
import { TransactionTableRow } from "../transaction-report-item";
import { ReportTableToolbar } from "src/sections/documents/documents-toolbar";

const TABLE_HEAD = [
  { id: "sn", label: "SN" },
  { id: "total_debits", label: "Debit" },
  { id: "total_credits", label: "Credit" },
  { id: "net_balance", label: "Net Balance" },
  { id: "total_sms_debits", label: "SMS Debit" },
  { id: "total_topup_debits", label: "Topup Debit" },
  { id: "total_package_debits", label: " Package Debit" },
];

export function TransactionReportListView() {
  const table = useTable();
  const dispatch = useAppDispatch();

  const { transactionReport } = useAppSelector(selectReport);

  useEffect(() => {
    dispatch(fetchTransactionRequest());
  }, [dispatch]);

  const filters = useSetState({
    type: "",
  });

  const { state: currentFilters } = filters;

  const dataFiltered = transactionReport ? [transactionReport] : [];

  // const dataFiltered = applyFilter({
  //   inputData: flattenedReport,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filters: currentFilters,
  // });

  const canReset = !!currentFilters.name;
  const notFound = dataFiltered.length === 0;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Transaction Reports",
            href: paths.dashboard.reports.transaction,
          },
          { name: "List" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CardHeader
        title="Transaction Reports"
        sx={{ mb: { xs: 3, md: 5 }, textAlign: "left" }}
      />

      <Card>
        {/* <ReportTableToolbar
          name={filters.state.name}
          onChangeName={(value) => filters.setState({ name: value })}
          onResetPage={table.onResetPage}
        /> */}

        {/* {canReset && (
                <AppointmentTableFiltersResult
                  filters={filters}
                  totalResults={dataFiltered.length}
                  onResetPage={table.onResetPage}
                  sx={{ p: 2.5, pt: 0 }}
                />
              )} */}

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
                    />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 76}
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

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((item) =>
      item.name?.toLowerCase().includes(name.toLowerCase())
    );
  }

  return inputData;
}

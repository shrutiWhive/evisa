import {
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  Typography,
} from "@mui/material";
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
import { fetchTopupRequest } from "src/redux/actions/report-action";
import { ReportTableToolbar } from "src/sections/team-report/team-report-toolbar";
import { SmsTableRow } from "src/sections/sms-report/sms-report-item";
import { Iconify } from "src/components/iconify";
import { Label } from "src/components/label";
import { fIsAfter, fIsBetween } from "src/utils";
import { SmsTableToolbar } from "src/sections/sms-report/sms-table-toolbar";
import { SmsReportTableFiltersResult } from "src/sections/sms-report/sms-report-table-filter-result";

const TABLE_HEAD = [
  { id: "sn", label: "SN" },
  { id: "description", label: "Description" },
  { id: "amount", label: "Amount" },
  { id: "type", label: "Type" },
  { id: "reference", label: "Reference" },
  { id: "created_at", label: "Date" },
];

export function TopupReportListView() {
  const table = useTable();

  const dispatch = useAppDispatch();

  const { topupReport } = useAppSelector(selectReport);

  useEffect(() => {
    dispatch(fetchTopupRequest());
  }, [dispatch]);

  const filters = useSetState({
    type: "",
    startDate: null,
    endDate: null,
  });

  const { state: currentFilters } = filters;
  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const flattenedReport = topupReport?.topup_debits || [];

  const dataFiltered = applyFilter({
    inputData: flattenedReport,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const canReset =
    !!currentFilters.type ||
    (!!currentFilters.startDate && !!currentFilters.endDate);
  const notFound = dataFiltered.length === 0;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Topup Reports",
            href: paths.dashboard.reports.smsReport,
          },
          { name: "List" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CardHeader
        title="Topup Reports"
        sx={{ mb: { xs: 3, md: 5 }, textAlign: "left" }}
        action={
          <Box
            sx={{
              gap: 1,
              display: "flex",
              alignItems: "center",
              color: "primary.main",
            }}
          >
            <Iconify icon="mdi:package" width={22} />
            <Label color="primary">
              Total Topup debit: {topupReport?.total_topup_debits || 0}
            </Label>
          </Box>
        }
      />

      <Card>
        <SmsTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
          dateError={dateError}
        />

        {canReset && (
          <SmsReportTableFiltersResult
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
                    <SmsTableRow
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

// ----------------------------------------------------------------------
function applyFilter({ inputData, comparator, filters, dateError }) {
  const { type, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (type) {
    inputData = inputData.filter((item) =>
      item.type?.toLowerCase().includes(type.toLowerCase())
    );
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

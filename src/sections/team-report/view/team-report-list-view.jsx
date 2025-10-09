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
import { ReportTableToolbar } from "../team-report-toolbar";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { selectReport } from "src/redux/selectors";
import { fetchTeamReport } from "src/api/report";
import { useEffect } from "react";
import { fetchReportRequest } from "src/redux/actions/report-action";
import { useSetState } from "minimal-shared/hooks";
import { ReportTableRow } from "../team-report-item";
import { Scrollbar } from "src/components/scrollbar";
import { fIsAfter, fIsBetween } from "src/utils";
import { TeamReportTableFiltersResult } from "../team-report-result-filter";

const TABLE_HEAD = [
  { id: "sn", label: "SN" },
  { id: "name", label: "Name" },
  { id: "created_at", label: "Date" },
  { id: "totalSms", label: "SMS" },
  { id: "totalEmails", label: "Email" },
  { id: "totalCalls", label: "Call" },
  { id: "totalMeetings", label: "Meeting" },
  { id: "totalFollowupsScheduled", label: " Followup Schedule" },
  { id: "totalContacted", label: " Contacted" },
  { id: "totalInProgress", label: " In-Progress" },
  { id: "totalLost", label: " Lost" },
  { id: "totalConverted", label: " Converted" },
];

export function TeamReportListView() {
  const table = useTable();

  const dispatch = useAppDispatch();

  const { teamReport } = useAppSelector(selectReport);

  useEffect(() => {
    dispatch(fetchReportRequest());
  }, [dispatch]);

  const filters = useSetState({
    name: "",
    startDate: null,
    endDate: null,
  });

  const { state: currentFilters } = filters;
  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const flattenedReport = Object.entries(teamReport).map(([id, item]) => ({
    id: Number(id),
    ...item.user,
    ...item,
  }));

  const dataFiltered = applyFilter({
    inputData: flattenedReport,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const canReset =
    !!currentFilters.name ||
    (!!currentFilters.startDate && !!currentFilters.endDate);
  const notFound = !dataFiltered.length && canReset;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Team Reports",
            href: paths.dashboard.reports.root,
          },
          { name: "List" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CardHeader
        title="Team Reports"
        sx={{ mb: { xs: 3, md: 5 }, textAlign: "left" }}
      />

      <Card>
        <ReportTableToolbar filters={filters} onResetPage={table.onResetPage} />

        {canReset && (
          <TeamReportTableFiltersResult
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
                    <ReportTableRow
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
  const { name, startDate, endDate } = filters;

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

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) =>
        fIsBetween(order.created_at, startDate, endDate)
      );
    }
  }

  return inputData;
}

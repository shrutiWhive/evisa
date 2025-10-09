import { useEffect } from "react";
import { useSetState } from "minimal-shared/hooks";

import { Box, Card, Table, TableBody, Typography } from "@mui/material";

import { fIsAfter, fIsBetween } from "src/utils/format-time";

import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "src/components/table";
import { Scrollbar } from "src/components/scrollbar";

import { CampaignDetailLeadsTableToolbar } from "./campaign-detail-leads-table-toolbar";
import { CampaignDetailLeadsTableFiltersResult } from "./campaign-detail-leads-table-filters-result";
import { CampaignDetailLeadsTableRow } from "./campaign-detail-leads-table-row";
import { useSelector } from "react-redux";
import {
  setPaginationState,
  setSelectedLeadId,
} from "src/redux/actions/lead-actions";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import {
  selectPageIndex,
  selectPageSize,
  selectSelectedLeadId,
} from "./selectors/paginationSelectors";

export function CampaignDetailLeadsTable({ leads, status, onRemoveStatus }) {
  // const table = useTable();
  const dispatch = useAppDispatch();
  const pageIndex = useAppSelector(selectPageIndex);
  const pageSize = useAppSelector(selectPageSize);
  const selectedLeadId = useAppSelector(selectSelectedLeadId);

  // const table = useTable({
  //   initialPage: pageIndex,
  //   initialRowsPerPage: pageSize,
  // });

  const table = useTable({
    defaultCurrentPage: pageIndex,
    defaultRowsPerPage: pageSize,
  });

  useEffect(() => {
    dispatch(
      setPaginationState({ pageIndex: table.page, pageSize: table.rowsPerPage })
    );
  }, [table.page, table.rowsPerPage]);

  const filters = useSetState({
    keyword: "",
    startDate: null,
    endDate: null,
    status: "",
  });

  const { state: currentFilters, setState: updateFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: leads,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const canReset =
    !!currentFilters.keyword ||
    !!currentFilters.status ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const phoneNumberTableHead = [{ id: "phone_number", label: "Phone Number" }];

  const staticTableHead = [{ id: "created_at", label: "Timestamp" }];

  const dynamicKeys = Array.from(
    new Set(
      Array.isArray(leads)
        ? leads.flatMap((lead) => Object.keys(lead.meta_data || {}))
        : []
    )
  ).slice(0, 3);

  const dynamicTableHead = dynamicKeys.map((key) => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  const tableHead = [
    ...phoneNumberTableHead,
    ...dynamicTableHead,
    { id: "lead_activities", label: "Last Activity" },
    { id: "topup_status", label: "Topup Status" },
    { id: "status", label: "Lead Status" },
    { id: "lead_followups", label: "Lead Followup" },
    { id: "reward_lead", label: "Reward Lead" },
    // ...staticTableHead,
  ];

  useEffect(() => {
    updateFilters({ status: status });
  }, [status]);

  const handleChangePage = (event, newPage) => {
    table.onChangePage(event, newPage);
    dispatch(
      setPaginationState({ pageIndex: newPage, pageSize: table.rowsPerPage })
    );
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    table.onChangeRowsPerPage(event);
    dispatch(setPaginationState({ pageIndex: 0, pageSize: newRowsPerPage })); // reset page to 0
  };

  // useEffect(() => {
  //   dispatch(setSelectedLeadId(null));
  // }, []);

  return (
    <>
      <Card>
        <CampaignDetailLeadsTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
        />

        {canReset && (
          <CampaignDetailLeadsTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
            //
            onRemoveStatus={onRemoveStatus}
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
                headCells={tableHead}
                numSelected={table.selected.length}
                onSort={table.onSort}
                rowCount={dataFiltered.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <CampaignDetailLeadsTableRow
                      key={row.id}
                      row={row}
                      metaKeys={dynamicKeys}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableNoData
                  title="No responses have been submitted yet"
                  notFound={notFound}
                />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          // onPageChange={table.onChangePage}
          // onChangeDense={table.onChangeDense}
          // onRowsPerPageChange={table.onChangeRowsPerPage}

          onPageChange={handleChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { keyword, startDate, endDate, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (keyword) {
    inputData = inputData.filter((lead) =>
      lead.phone_number.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  if (status) {
    inputData = inputData.filter((lead) => lead.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((lead) =>
        fIsBetween(lead.created_at, startDate, endDate)
      );
    }
  }

  return inputData;
}

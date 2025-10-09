import { useEffect } from "react";

import { Stack } from "@mui/material";

import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchEmployeeDetailRequest } from "src/redux/actions";
import { selectEmployeeState } from "src/redux/selectors";

import { EmployeeDetailToolbar } from "../employee-detail-toolbar";
import { SkeletonEmployeeDetailToolbar } from "../employee-detail-skeleton";

export function EmployeeDetailView({ id }) {
  const dispatch = useAppDispatch();

  const { employeeDetail, isLoading } = useAppSelector(selectEmployeeState);

  const { name, created_at, is_active, contact_number } = employeeDetail || {};


  useEffect(() => {
    if (!id) return;

    dispatch(fetchEmployeeDetailRequest(id));
  }, [dispatch, id]);

  return (
    <DashboardContent>
      {isLoading ? (
        <SkeletonEmployeeDetailToolbar />
      ) : (
        <>
          <EmployeeDetailToolbar
            status={is_active ? "Active" : "Inactive"}
            createdAt={created_at}
            name={name}
            contactNumber = {contact_number}
            backHref={paths.dashboard.employee.root}
            editHref={paths.dashboard.employee.edit(id)}
          />

          <Stack spacing={3}>Hello</Stack>
        </>
      )}
    </DashboardContent>
  );
}

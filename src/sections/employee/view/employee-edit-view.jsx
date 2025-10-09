import { useEffect } from "react";

import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";

import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchEmployeeDetailRequest } from "src/redux/actions";
import { selectEmployeeState } from "src/redux/selectors";

import { EmployeeNewEditForm } from "../employee-new-edit-form";

// ----------------------------------------------------------------------

export function EmployeeEditView({ id }) {
  const dispatch = useAppDispatch();

  const { employeeDetail } = useAppSelector(selectEmployeeState);

  useEffect(() => {
    dispatch(fetchEmployeeDetailRequest(id));
  }, [dispatch, id]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Employee", href: paths.dashboard.employee.root },
          { name: employeeDetail?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <EmployeeNewEditForm currentEmployee={employeeDetail} />
    </DashboardContent>
  );
}

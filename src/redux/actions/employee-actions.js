import { employeeSlice } from "../reducer/employee/employee-slice";

export const {
  fetchEmployeesRequest,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  //
  fetchEmployeeDetailRequest,
  fetchEmployeeDetailSuccess,
  fetchEmployeeDetailFailure,
} = employeeSlice.actions;

import { permissionSlice } from "../reducer/permission/permission-slice";

export const {
  fetchAllPermissionsRequest,
  fetchAllPermissionsSuccess,
  fetchAllPermissionsFailure,
  //
  fetchCurrentUserPermissionsRequest,
  fetchCurrentUserPermissionsSuccess,
  fetchCurrentUserPermissionsFailure,
  //
  fetchSelectedEmployeePermissionsRequest,
  fetchSelectedEmployeePermissionsSuccess,
  fetchSelectedEmployeePermissionsFailure,
} = permissionSlice.actions;

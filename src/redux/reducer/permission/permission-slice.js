import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  allPermissions: [],
  currentUserPermissions: [],
  selectedEmployeePermissions: [],
};

export const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    fetchAllPermissionsRequest: (state) => {
      state.isLoading = true;

      state.allPermissions = [];
    },

    fetchAllPermissionsSuccess: (state, action) => {
      state.isLoading = false;

      state.allPermissions = action.payload;
    },

    fetchAllPermissionsFailure: (state) => {
      state.isLoading = false;
    },

    fetchCurrentUserPermissionsRequest: (state) => {
      state.isLoading = true;

      state.currentUserPermissions = [];
    },

    fetchCurrentUserPermissionsSuccess: (state, action) => {
      state.isLoading = false;

      state.currentUserPermissions = action.payload;
    },

    fetchCurrentUserPermissionsFailure: (state) => {
      state.isLoading = false;
    },

    fetchSelectedEmployeePermissionsRequest: (state) => {
      state.isLoading = true;

      state.selectedEmployeePermissions = [];
    },

    fetchSelectedEmployeePermissionsSuccess: (state, action) => {
      state.isLoading = false;

      state.selectedEmployeePermissions = action.payload;
    },

    fetchSelectedEmployeePermissionsFailure: (state) => {
      state.isLoading = false;
    },
  },
});

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  employees: [],
  employeeDetail: {},
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    fetchEmployeesRequest: (state) => {
      state.isLoading = true;

      state.employees = [];
    },

    fetchEmployeesSuccess: (state, action) => {
      state.isLoading = false;

      state.employees = action.payload;
    },

    fetchEmployeesFailure: (state) => {
      state.isLoading = false;

      state.employees = [];
    },

    fetchEmployeeDetailRequest: (state) => {
      state.isLoading = true;

      state.employeeDetail = {};
    },

    fetchEmployeeDetailSuccess: (state, action) => {
      state.isLoading = false;

      state.employeeDetail = action.payload;
    },

    fetchEmployeeDetailFailure: (state) => {
      state.isLoading = false;

      state.employeeDetail = {};
    },
  },
});

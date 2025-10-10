import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
  employee: {},
  token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setOrganization: (state, action) => {
      const { employee, token } = action.payload;

      state.isLogin = true;

      state.employee = employee;

      state.token = token;
      
    },

    clearOrganization: (state) => {
      state.isLogin = false;

      state.employee = {};

      state.token = "";
    },
  },
});

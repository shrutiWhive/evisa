import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
  user: {},
  organization: {},
  token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setOrganization: (state, action) => {
      const { organization, user, token } = action.payload;

      state.isLogin = true;

      state.user = user;

      state.organization = organization;

      state.token = token;
      
    },

    clearOrganization: (state) => {
      state.isLogin = false;

      state.user = {};

      state.organization = {};

      state.token = "";
    },
  },
});

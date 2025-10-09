import { profileSlice } from "../reducer/profile/profile-slice";

export const { fetchProfileRequest, fetchProfileSuccess, fetchProfileFailure, updateOrg } =
  profileSlice.actions;

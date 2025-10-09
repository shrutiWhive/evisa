import { siteSettingSlice } from "../reducer/site-setting/site-setting-slice";

export const { fetchSiteSettingRequest, fetchSiteSettingSuccess, fetchSiteSettingFailure } =
  siteSettingSlice.actions;

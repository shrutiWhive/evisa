import { combineSlices } from "@reduxjs/toolkit";

import { authSlice } from "./auth/auth-slice";

import { campaignSlice } from "./campaign/campaign-slice";

import { formTemplateSlice } from "./form-template/form-template-slice";

import { profileSlice } from "./profile/profile-slice";

import { leadSlice } from "./lead/leaddetail-slice";

import { employeeSlice } from "./employee/employee-slice";

import { permissionSlice } from "./permission/permission-slice";

import { appointmentSlice } from "./appointment/appointment-slice";

import { appointmentCategorySlice } from "./appointment-category/appointment-category-slice";

import { appointmentTimeSlotSlice } from "./appointment-time-slot/appointment-time-slot-slice";
import { creditlogSlice } from "./credit-logs/creditlogs-slice";
import { campaignNoAuthSlice } from "./campaign/campaign-noauth-slice";
import { siteSettingSlice } from "./site-setting/site-setting-slice";
import { reportSlice } from "./reports/reports-slice";

export const rootReducer = combineSlices(
  authSlice,

  campaignSlice,
  
  campaignNoAuthSlice,

  formTemplateSlice,

  profileSlice,

  leadSlice,

  employeeSlice,

  permissionSlice,

  appointmentSlice,

  appointmentCategorySlice,

  appointmentTimeSlotSlice,

  creditlogSlice,

  siteSettingSlice,

  reportSlice,

);

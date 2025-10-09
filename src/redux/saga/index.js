import { all } from "redux-saga/effects";

import { watchFormTemplateSaga } from "./form-template-saga";

import { watchCampaignSaga } from "./campaign-saga";

import { watchProfileSaga } from "./profile-saga";

import { watchLeadDetailSaga } from "./leaddetail-saga";

import { watchEmployeeSaga } from "./employee-saga";

import { watchPermissionSaga } from "./permission-saga";

import { watchAppointmentSaga } from "./appointment-saga";

import { watchAppointmentCategorySaga } from "./appointment-category-saga";

import { watchAppointmentTimeSlotSaga } from "./appointment-time-slot-saga";
import { watchCreditLogsSaga } from "./credit-logs-saga";
import { watchCampaignNoAuthSaga } from "./campaign-noauth-saga";
import { watchSiteSettingSaga } from "./site-setting-saga";
import { watchReportSaga } from "./report-saga";

export function* rootSaga() {
  yield all([
    watchFormTemplateSaga(),

    watchCampaignSaga(),

    watchProfileSaga(),

    watchLeadDetailSaga(),

    watchEmployeeSaga(),

    watchPermissionSaga(),

    watchAppointmentSaga(),

    watchAppointmentCategorySaga(),

    watchAppointmentTimeSlotSaga(),
    
    watchCreditLogsSaga(),

    watchCampaignNoAuthSaga(),

    watchSiteSettingSaga(),

    watchReportSaga(),
  ]);
}

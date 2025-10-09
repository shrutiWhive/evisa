import { all, call, put, takeLatest } from "redux-saga/effects";

import {  fetchCampaignDetailWithoutAuth } from "src/api";
import { fetchCampaignDetailFailureNoAuth, fetchCampaignDetailRequestNoAuth, fetchCampaignDetailSuccessNoAuth } from "../actions/campaign-noauth-actions";



function* fetchCampaignWithoutAuthSaga({ payload }) {
  try {
    const response = yield call(fetchCampaignDetailWithoutAuth, payload);

    yield put(fetchCampaignDetailSuccessNoAuth(response));
  } catch (error) {
    yield put(fetchCampaignDetailFailureNoAuth());
  }
}


export function* watchCampaignNoAuthSaga() {
  yield all([
    takeLatest(fetchCampaignDetailRequestNoAuth, fetchCampaignWithoutAuthSaga),
  ]);
}

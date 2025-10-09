import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  fetchCampaignDetailRequest,
  fetchCampaignDetailSuccess,
  fetchCampaignDetailFailure,
} from "../actions/campaign-actions";

import { fetchCampaignDetail } from "src/api";

function* fetchCampaignDetailSaga({ payload }) {
  try {
    const response = yield call(fetchCampaignDetail, payload);

    yield put(fetchCampaignDetailSuccess(response));
  } catch (error) {
    yield put(fetchCampaignDetailFailure());
  }
}




export function* watchCampaignSaga() {
  yield all([takeLatest(fetchCampaignDetailRequest, fetchCampaignDetailSaga),
   
  ]);
}

import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
} from "../actions";

import { fetchProfile } from "src/api";

function* fetchProfileSaga({ payload }) {
  try {
    const response = yield call(fetchProfile, payload);

    // Extract the nested data from response.data.data
    // const profileData = response?.data?.data || {};

    yield put(fetchProfileSuccess(response));
  } catch (error) {
    yield put(fetchProfileFailure());
  }
}

export function* watchProfileSaga() {
  yield all([takeLatest(fetchProfileRequest, fetchProfileSaga)]);
}

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

    yield put(fetchProfileSuccess(response));
  } catch (error) {
    yield put(fetchProfileFailure());
  }
}

export function* watchProfileSaga() {
  yield all([takeLatest(fetchProfileRequest, fetchProfileSaga)]);
}

import { all, call, put, takeLatest } from "redux-saga/effects";

import { fetchCreditLogs } from "src/api/credit-logs";
import { fetchCreditLogsFailure, fetchCreditLogsRequest, fetchCreditLogsSuccess } from "../actions/credit-logs-actions";


function* fetchCreditLogsSaga() {
  try {
    const response = yield call(fetchCreditLogs);

    yield put(fetchCreditLogsSuccess(response));
  } catch (error) {
    yield put(fetchCreditLogsFailure());
  }
}

export function* watchCreditLogsSaga() {
  yield all([takeLatest(fetchCreditLogsRequest, fetchCreditLogsSaga)]);
}

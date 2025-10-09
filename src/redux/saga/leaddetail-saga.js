import { all, call, put, takeLatest } from "redux-saga/effects";
import { fetchActivityDetail, fetchLeadDetail } from "src/api";
import { fetchActivityDetailFailure, fetchActivityDetailRequest, fetchActivityDetailSuccess, fetchLeadDetailFailure, fetchLeadDetailRequest, fetchLeadDetailSuccess } from "../actions/lead-actions";


function* fetchLeadDetailsaga({ payload }) {
  try {
    const response = yield call(fetchLeadDetail, payload);
    yield put(fetchLeadDetailSuccess(response));
  } catch (error) {
    yield put(fetchLeadDetailFailure());
  }
}

function* fetchActivityDetailsaga({ payload }) {
  try {
    const response = yield call(fetchActivityDetail, payload);
    yield put(fetchActivityDetailSuccess(response));
  } catch (error) {
    yield put(fetchActivityDetailFailure());
  }
}


export function* watchLeadDetailSaga() {
  yield all([takeLatest(fetchLeadDetailRequest, fetchLeadDetailsaga),
    takeLatest(fetchActivityDetailRequest, fetchActivityDetailsaga)
  ]);
}

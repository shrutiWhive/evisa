import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  fetchEmployeesRequest,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  //
  fetchEmployeeDetailRequest,
  fetchEmployeeDetailSuccess,
  fetchEmployeeDetailFailure,
} from "../actions";

import { fetchEmployees, fetchEmployeeDetail } from "src/api";

function* fetchEmployeesSaga() {
  try {
    const response = yield call(fetchEmployees);

    yield put(fetchEmployeesSuccess(response || []));
  } catch (error) {
    yield put(fetchEmployeesFailure());
  }
}

function* fetchEmployeeDetailSaga({ payload }) {
  try {
    const response = yield call(fetchEmployeeDetail, payload);

    yield put(fetchEmployeeDetailSuccess(response));
  } catch (error) {
    yield put(fetchEmployeeDetailFailure());
  }
}

export function* watchEmployeeSaga() {
  yield all([
    takeLatest(fetchEmployeesRequest, fetchEmployeesSaga),
    takeLatest(fetchEmployeeDetailRequest, fetchEmployeeDetailSaga),
  ]);
}

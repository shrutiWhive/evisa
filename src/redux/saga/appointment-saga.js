import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  fetchAppointmentsRequest,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
} from "../actions";

import { fetchAppointments } from "src/api";

function* fetchAppointmentsSaga() {
  try {
    const response = yield call(fetchAppointments);

    yield put(fetchAppointmentsSuccess(response));
  } catch (error) {
    yield put(fetchAppointmentsFailure());
  }
}

export function* watchAppointmentSaga() {
  yield all([takeLatest(fetchAppointmentsRequest, fetchAppointmentsSaga)]);
}

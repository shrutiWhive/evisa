import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  fetchAppointmentTimeSlotsRequest,
  fetchAppointmentTimeSlotsSuccess,
  fetchAppointmentTimeSlotsFailure,
} from "../actions";

import { fetchAppointmentTimeSlots } from "src/api";

function* fetchAppointmentTimeSlotsSaga() {
  try {
    const response = yield call(fetchAppointmentTimeSlots);

    yield put(fetchAppointmentTimeSlotsSuccess(response));
  } catch (error) {
    yield put(fetchAppointmentTimeSlotsFailure());
  }
}

export function* watchAppointmentTimeSlotSaga() {
  yield all([
    takeLatest(fetchAppointmentTimeSlotsRequest, fetchAppointmentTimeSlotsSaga),
  ]);
}

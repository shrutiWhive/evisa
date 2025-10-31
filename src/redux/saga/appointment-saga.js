import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  fetchAppointmentsRequest,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
} from "../actions";
import { fetchAppointmentDate } from "src/api";

function* fetchAppointmentsSaga() {
  try {
    const response = yield call(fetchAppointmentDate);
    // Extract the data array from the API response
    // const appointmentsData = response || [];

    yield put(fetchAppointmentsSuccess(response));
  } catch (error) {
    console.error("Fetch appointments error:", error);
    yield put(
      fetchAppointmentsFailure(error?.message || "Failed to fetch appointments")
    );
  }
}

export function* watchAppointmentSaga() {
  yield all([takeLatest(fetchAppointmentsRequest, fetchAppointmentsSaga)]);
}

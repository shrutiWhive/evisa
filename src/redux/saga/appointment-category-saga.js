import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  fetchAppointmentCategoriesRequest,
  fetchAppointmentCategoriesSuccess,
  fetchAppointmentCategoriesFailure,
} from "../actions";

import { fetchAppointmentCategories } from "src/api";

function* fetchAppointmentCategoriesSaga() {
  try {
    const response = yield call(fetchAppointmentCategories);

    yield put(fetchAppointmentCategoriesSuccess(response));
  } catch (error) {
    yield put(fetchAppointmentCategoriesFailure());
  }
}

export function* watchAppointmentCategorySaga() {
  yield all([
    takeLatest(
      fetchAppointmentCategoriesRequest,
      fetchAppointmentCategoriesSaga
    ),
  ]);
}

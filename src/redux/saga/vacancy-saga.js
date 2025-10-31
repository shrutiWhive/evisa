import { all, call, put, takeLatest } from "redux-saga/effects";
import { fetchVacancy } from "src/api/vacancy";
import { fetchVacancyFailure, fetchVacancyRequest, fetchVacancySuccess } from "../actions/vacancy-actions";



function* fetchVacancySaga() {
  try {
    const response = yield call(fetchVacancy);

    yield put(fetchVacancySuccess(response));
  } catch (error) {
    yield put(fetchVacancyFailure());
  }
}

export function* watchVacancySaga() {
  yield all([takeLatest(fetchVacancyRequest, fetchVacancySaga)]);
}

import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  fetchFormTemplatesRequest,
  fetchFormTemplatesSuccess,
  fetchFormTemplatesFailure,
  //
  fetchFormTemplateDetailRequest,
  fetchFormTemplateDetailSuccess,
  fetchFormTemplateDetailFailure,
  //
  fetchValidationRulesRequest,
  fetchValidationRulesSuccess,
  fetchValidationRulesFailure,
} from "../actions";

import {
  fetchFormTemplateDetail,
  fetchFormTemplates,
  fetchValidationRules,
} from "src/api";

function* fetchFormTemplatesSaga() {
  try {
    const response = yield call(fetchFormTemplates);

    yield put(fetchFormTemplatesSuccess(response || []));
  } catch (error) {
    yield put(fetchFormTemplatesFailure());
  }
}

function* fetchFormTemplateDetailSaga({ payload }) {
  try {
    const response = yield call(fetchFormTemplateDetail, payload);

    yield put(fetchFormTemplateDetailSuccess(response));
  } catch (error) {
    yield put(fetchFormTemplateDetailFailure());
  }
}

function* fetchValidationRulesSaga() {
  try {
    const response = yield call(fetchValidationRules);

    yield put(fetchValidationRulesSuccess(response));
  } catch (error) {
    yield put(fetchValidationRulesFailure());
  }
}

export function* watchFormTemplateSaga() {
  yield all([
    takeLatest(fetchFormTemplatesRequest, fetchFormTemplatesSaga),
    takeLatest(fetchFormTemplateDetailRequest, fetchFormTemplateDetailSaga),
    takeLatest(fetchValidationRulesRequest, fetchValidationRulesSaga),
  ]);
}

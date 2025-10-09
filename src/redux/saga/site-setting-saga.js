import { all, call, put, takeLatest } from "redux-saga/effects";
import { fetchSiteSetting } from "src/api/site-setting";
import { fetchSiteSettingFailure, fetchSiteSettingRequest, fetchSiteSettingSuccess } from "../actions/site-setting-actions";



function* fetchSiteSettingSaga({ payload }) {
  try {
    const response = yield call(fetchSiteSetting, payload);

    yield put(fetchSiteSettingSuccess(response));
  } catch (error) {
    yield put(fetchSiteSettingFailure());
  }
}

export function* watchSiteSettingSaga() {
  yield all([takeLatest(fetchSiteSettingRequest, fetchSiteSettingSaga)]);
}

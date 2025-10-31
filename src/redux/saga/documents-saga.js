import { all, call, put, takeLatest } from "redux-saga/effects";
import { fetchContract } from "src/api/document";
import {
  fetchDocumentsFailure,
  fetchDocumentsRequest,
  fetchDocumentsSuccess,
} from "../actions/documents-actions";

function* fetchDocumentsSaga({ payload }) {
  try {
    // API currently returns { status, success, message, data: [...] }
    // fetchContract returns response.data, so grab .data array
    const response = yield call(fetchContract, payload);
    // const list = response?.data || [];
    yield put(fetchDocumentsSuccess(response));
  } catch (error) {
    yield put(fetchDocumentsFailure(error?.message));
  }
}

export function* watchDocumentsSaga() {
  yield all([takeLatest(fetchDocumentsRequest, fetchDocumentsSaga)]);
}

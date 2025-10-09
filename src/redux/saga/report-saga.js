import { all, call, put, takeLatest } from "redux-saga/effects";
import { fetchCreditFailure, fetchCreditRequest, fetchCreditSuccess, fetchPackageFailure, fetchPackageRequest, fetchPackageSuccess, fetchReportFailure, fetchReportRequest, fetchReportSuccess, fetchSmsFailure, fetchSmsRequest, fetchSmsSuccess, fetchTopupFailure, fetchTopupRequest, fetchTopupSuccess, fetchTransactionFailure, fetchTransactionRequest, fetchTransactionSuccess } from "../actions/report-action";
import { fetchCreditReport, fetchPackageReport, fetchSmsReport, fetchTeamReport, fetchTopupReport, fetchTransactionReport } from "src/api/report";



function* fetchReportSaga() {
  try {
    const response = yield call(fetchTeamReport);

    yield put(fetchReportSuccess(response));
  } catch (error) {
    yield put(fetchReportFailure());
  }
}

function* fetchTransactionSaga() {
    try {
      const response = yield call(fetchTransactionReport);
  
      yield put(fetchTransactionSuccess(response));
    } catch (error) {
      yield put(fetchTransactionFailure());
    }
  }

  function* fetchSmsSaga() {
    try {
      const response = yield call(fetchSmsReport);
  
      yield put(fetchSmsSuccess(response));
    } catch (error) {
      yield put(fetchSmsFailure());
    }
  }

  function* fetchTopupSaga() {
    try {
      const response = yield call(fetchTopupReport);
  
      yield put(fetchTopupSuccess(response));
    } catch (error) {
      yield put(fetchTopupFailure());
    }
  }

  function* fetchPackageSaga() {
    try {
      const response = yield call(fetchPackageReport);
  
      yield put(fetchPackageSuccess(response));
    } catch (error) {
      yield put(fetchPackageFailure());
    }
  }

  function* fetchCreditSaga() {
    try {
      const response = yield call(fetchCreditReport);
  
      yield put(fetchCreditSuccess(response));
    } catch (error) {
      yield put(fetchCreditFailure());
    }
  }


export function* watchReportSaga() {
  yield all([
    takeLatest(fetchReportRequest, fetchReportSaga),
    takeLatest(fetchTransactionRequest, fetchTransactionSaga),
    takeLatest(fetchSmsRequest, fetchSmsSaga),
    takeLatest(fetchTopupRequest, fetchTopupSaga),
    takeLatest(fetchPackageRequest, fetchPackageSaga),
    takeLatest(fetchCreditRequest, fetchCreditSaga),

  ]);
}

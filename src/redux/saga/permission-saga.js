import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  fetchAllPermissionsRequest,
  fetchAllPermissionsSuccess,
  fetchAllPermissionsFailure,
  //
  fetchCurrentUserPermissionsRequest,
  fetchCurrentUserPermissionsSuccess,
  fetchCurrentUserPermissionsFailure,
  //
  fetchSelectedEmployeePermissionsRequest,
  fetchSelectedEmployeePermissionsSuccess,
  fetchSelectedEmployeePermissionsFailure,
} from "../actions";

import {
  fetchAllPermissions,
  fetchCurrentUserPermissions,
  fetchSelectedEmployeePermissions,
} from "src/api";

function* fetchAllPermissionsSaga() {
  try {
    const response = yield call(fetchAllPermissions);

    yield put(fetchAllPermissionsSuccess(response || []));
  } catch (error) {
    yield put(fetchAllPermissionsFailure());
  }
}

function* fetchCurrentUserPermissionsSaga() {
  try {
    const response = yield call(fetchCurrentUserPermissions);

    yield put(fetchCurrentUserPermissionsSuccess(response));
  } catch (error) {
    yield put(fetchCurrentUserPermissionsFailure());
  }
}

function* fetchSelectedEmployeePermissionsSaga({ payload }) {
  try {
    const response = yield call(fetchSelectedEmployeePermissions, payload);

    yield put(fetchSelectedEmployeePermissionsSuccess(response));
  } catch (error) {
    yield put(fetchSelectedEmployeePermissionsFailure());
  }
}

export function* watchPermissionSaga() {
  yield all([
    takeLatest(fetchAllPermissionsRequest, fetchAllPermissionsSaga),

    takeLatest(
      fetchCurrentUserPermissionsRequest,
      fetchCurrentUserPermissionsSaga
    ),

    takeLatest(
      fetchSelectedEmployeePermissionsRequest,
      fetchSelectedEmployeePermissionsSaga
    ),
  ]);
}

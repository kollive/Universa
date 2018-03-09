import {
  all,
  actionChannel,
  call,
  put,
  take,
  takeEvery,
  takeLatest,
  select,
  cancel,
  cancelled,
  fork,
  race,
  apply
} from "redux-saga/effects";
import { delay, buffers, eventChannel, END } from "redux-saga";
import * as _ from "lodash";
import * as io from "socket.io-client";
import { types as authTypes } from "reducers/authreducer";
import * as utils from "Utils/common"

//import { push } from 'react-router-redux';

const authApi = {
  login(userData) {
    ////debugger;
    console.log(userData.user);
    console.log(userData.password);

    //new Promise((resolve, reject) => {
    //return fetch("http://localhost:4003/loginsvc/", {
      return fetch("http://hvs.selfip.net:4003/loginsvc/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usr: userData.user,
        pwd: userData.password
      })
    })
      //.then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  }

  //.then(data => data)
};

function statusHelper(response) {
  ////debugger;
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
    //throw Error(response);
  }
  return response;
}

function* login(userData) {
  ////debugger;
  try {
    //yield call(delay, 5000)
    console.log(userData.payload.user);
    console.log(userData.payload.password);
    //yield put({ type: authTypes.LOGIN_REQUEST, isLoading: false })
    let resultObj = yield call(authApi.login, userData.payload);
    if (utils.isJSON(resultObj)) {
      
      resultObj = JSON.parse(resultObj);
      //console.log("99999999999")
      //console.log(resultObj)
      if (resultObj.message == "ok") {
        //alert(JSON.parse(resultObj).roles)
        yield put({
          type: authTypes.NAME,
          name: resultObj.name
        });
        //alert(resultObj.hv_staff_id)
        yield put({
          type: authTypes.STAFFID,
          hv_staff_id: resultObj.hv_staff_id
        });
      }

      //alert("1")
      //alert(resultObj.message);

      yield put({
        type: authTypes.MESSAGE,
        message: {
          val: resultObj.result,
          msg: resultObj.message,
        }
      });
      //console.log(JSON.parse(resultObj))    
    } else {
      
      yield put({
        type: authTypes.MESSAGE,
        message: { val: resultObj.val, msg: resultObj.result }
      });
    }
    //yield put({ type: "LOGIN_STATUS", message: JSON.parse(resultObj).token })
  } catch (e) {
    /*
    //debugger;
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      default:
        message = "Something went wrong! " + error.statusText;
    }
    */
    //debugger;
    yield put({ type: authTypes.MESSAGE, message: { val: -1, msg: e } });
  } finally {
    //debugger;
    if (yield cancelled())
      yield put({
        type: authTypes.MESSAGE,
        message: { val: -1, msg: "Task Cancelled" }
      });
  }
}

export function* handleRequest(action) {
  //debugger;
  console.log("authSaga request", action);
  console.log(action.payload);
  //yield put({ type: "ITEMS_IS_LOADING", isLoading: true });
  //yield call(updateStatus);
  try {
    switch (action.type) {
      
      case authTypes.LOGIN_REQUEST: {
        //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
        //debugger;
        const fetchTask = yield fork(login, action.payload);
        //debugger;
        break;
      }

      default: {
        return null;
        break;
      }
    }
  } catch (e) {
    yield put({ type: authTypes.LOGIN_FAILURE, error: e });
  }
}

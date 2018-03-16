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
  import { types as timeoutTypes } from "../reducers/timeoutreducer";
  import { API_ROOT } from '../apiconfig';
  //import { push } from 'react-router-redux';

  const authApi = {
    login(userData) {
      debugger;
      console.log(userData.user);
      console.log(userData.password);

      //new Promise((resolve, reject) => {
      //return fetch("http://localhost:4003/loginsvc/", {
      const RestAPIURL = API_ROOT.backendAPIGWsvc;
      const requestURL = `${RestAPIURL}loginsvc/`;
      return fetch(requestURL, {
      //return fetch("http://hvs.selfip.net:4003/loginsvc/", {
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
        .then(statusHelper)
        .then(response => response.json())
        .catch(error => error);
    }

    //.then(data => data)
  };

  function statusHelper(response) {
    debugger;
    if (!response.ok) {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
      //throw Error(response);
    }
    return response;
  }

  function* login(userData) {
    debugger;
    try {
      //yield call(delay, 5000)
      console.log(userData.payload.user);
      console.log(userData.payload.password);
      //yield put({ type: timeoutTypes.LOGIN_REQUEST, isLoading: false })
      const resultObj = yield call(authApi.login, userData.payload);

      debugger;
      if (resultObj.response && !resultObj.response.ok) {
        debugger;
        yield put({
          type: timeoutTypes.MESSAGE,
          message: { val: -1, msg: resultObj.response.statusText }
        });
      } else {
        //alert("Message" + JSON.parse(resultObj).message)
        //alert("name" + JSON.parse(resultObj).name)

        if (JSON.parse(resultObj).message == "ok") {
          sessionStorage.setItem("token", JSON.parse(resultObj).token);
          //alert(JSON.parse(resultObj).name)
          yield put({
            type: timeoutTypes.NAME,
            name: JSON.parse(resultObj).name
          });
        }
        yield put({
          type: timeoutTypes.MESSAGE,
          message: {
            val: JSON.parse(resultObj).result,
            msg: JSON.parse(resultObj).message,
          }
        });
        console.log(JSON.parse(resultObj))
        //

      }
      //yield put({ type: "LOGIN_STATUS", message: JSON.parse(resultObj).token })
    } catch (e) {
      /*
      debugger;
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
      debugger;
      yield put({ type: timeoutTypes.MESSAGE, message: { val: -1, msg: e } });
    } finally {
      debugger;
      if (yield cancelled())
        yield put({
          type: timeoutTypes.MESSAGE,
          message: { val: -1, msg: "Task Cancelled" }
        });
    }
  }


  export function* handleRequest(action) {
    debugger;
    //console.log("authSaga request", action);
    console.log(action.payload);
    //yield put({ type: "ITEMS_IS_LOADING", isLoading: true });
    //yield call(updateStatus);
    try {
      switch (action.type) {

        case timeoutTypes.LOGIN_REQUEST: {
          //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
          debugger;
          const fetchTask = yield fork(login, action.payload);
          debugger;
          break;
        }

        default: {
          return null;
          break;
        }
      }
    } catch (e) {
      yield put({ type: timeoutTypes.LOGIN_FAILURE, error: e });
    }
  }

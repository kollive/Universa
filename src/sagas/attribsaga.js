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
  import { types as attribTypes } from "../reducers/attribreducer";
  
  //import { push } from 'react-router-redux';
  
  const attribApi = {
    
    getAttribTables(tableTag) {
      debugger;
      //console.log(userData.user);
      //console.log(userData.password);
      //alert("Before call")
      //new Promise((resolve, reject) => {
      return fetch("http://hvs.selfip.net:4003/getTables/", {
        //return fetch("http://localhost:4003/db/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tableTag : tableTag
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
  
  function* getAttribTables(tableTag) {
    debugger;
    try {
      //yield call(delay, 5000)
      //yield put({ type: attribTypes.LOGIN_REQUEST, isLoading: false })
      const resultObj = yield call(attribApi.getAttribTables, tableTag);
  
      debugger;
      if (resultObj.response && !resultObj.response.ok) {
        debugger;
        yield put({
          type: attribTypes.MESSAGE,
          message: resultObj.response.statusText
        });
      } else {
        debugger;
        //sessionStorage.setItem("token", JSON.parse(resultObj).token);
        yield put({
          type: attribTypes.ITEMS,
          items: JSON.parse(resultObj).result
        });
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
      yield put({ type: attribTypes.MESSAGE, message: e });
    } finally {
      debugger;
      if (yield cancelled())
        yield put({ type: attribTypes.MESSAGE, message: "Task Cancelled" });
    }
  }
  
  
  export function* handleRequest(action) {
    debugger;
    console.log("authSaga request", action);
    console.log(action.payload);
    //yield put({ type: "ITEMS_IS_LOADING", isLoading: true });
    //yield call(updateStatus);
    try {
      switch (action.type) {
      
        case attribTypes.FETCH_TABLES_REQUEST: {
          //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
          debugger;
          const fetchTask = yield fork(getAttribTables, action.tableTag);
          debugger;
          break;
        }
  
        default: {
          return null;
          break;
        }
      }
    } catch (e) {
      yield put({ type: attribTypes.LOGIN_FAILURE, error: e });
    }
  }
  
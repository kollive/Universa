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
  import { types as purchaseTypes } from "../reducers/purchasereducer";
  
  //import { push } from 'react-router-redux';
  
  const purchaseApi = {
    
    getPurchaseTables(cname) {
      //debugger;
      //alert("getPurchaseTables")
      //alert(cname)
      //console.log(userData.user);
      //console.log(userData.password);
    //alert("in Cadets")
      //new Promise((resolve, reject) => {
      return fetch("http://hvs.selfip.net:4003/getPurchases/", {
        //return fetch("http://hvs.selfip.net:4003/getCadets/", {
        //return fetch("http://localhost:4003/getCadets/", {
        
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: cname
        })
      })
        .then(statusHelper)
        .then(response => response.json())
        .catch(error => error);
    }
    //.then(data => data)
  };
  
  function statusHelper(response) {
    //debugger;
    if (!response.ok) {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
      //throw Error(response);
    }
    return response;
  }
  
  function* getPurchaseTables(cname) {
    //debugger;
    try {
      //yield call(delay, 5000)
      //yield put({ type: purchaseTypes.LOGIN_REQUEST, isLoading: false })
      const resultObj = yield call(purchaseApi.getPurchaseTables, cname);
  
      //debugger;
      if (resultObj.response && !resultObj.response.ok) {
        //debugger;
        yield put({
          type: purchaseTypes.MESSAGE,
          message: {val: -1, msg: resultObj.response.statusText}
        });
      } else {
        //debugger;
        //sessionStorage.setItem("token", JSON.parse(resultObj).token);
        yield put({
          type: purchaseTypes.ITEMS,
          items: JSON.parse(resultObj).result.items
        });
      }
      //yield put({ type: "LOGIN_STATUS", message: JSON.parse(resultObj).token })
    } catch (e) {
     
      //debugger;
      yield put({ type: purchaseTypes.MESSAGE, message: {val:-1, msg:e} });
    } finally {
      //debugger;
      if (yield cancelled())
        yield put({ type: purchaseTypes.MESSAGE, message: {val: -1, msg:"Task Cancelled" }});
    }
  }
  
 
  export function* handleRequest(action) {
    //debugger;
    //console.log("authSaga request", action);
    //console.log(action.payload);
    //yield put({ type: "ITEMS_IS_LOADING", isLoading: true });
    //yield call(updateStatus);
    try {
      switch (action.type) {
      
        case purchaseTypes.FETCH_TABLES_REQUEST: {
          //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
          //debugger;
          const fetchTask = yield fork(getPurchaseTables, action.cname);
          //debugger;
          break;
        }
  
        default: {
          return null;
          break;
        }
      }
    } catch (e) {
      yield put({ type: purchaseTypes.LOGIN_FAILURE, error: e });
    }
  }
  
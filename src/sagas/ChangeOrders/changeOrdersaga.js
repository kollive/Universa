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
  import { types as ChangeOrderActions, permissions as Permissions } from "../../reducers/ChangeOrders/changeOrderreducer";
  import * as utils from "../../Utils/common";
  import { API_ROOT } from '../../apiconfig';

  function insertChangeOrder(Order) {
   debugger;
  const RestAPIURL = API_ROOT.backendAPIGWsvc;
  const requestURL = `${RestAPIURL}ExecSP/`;
  return fetch(requestURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          spName : 'spi_ChangeOrderDetails',
          token: sessionStorage.getItem("token"),
          funcId : Order[1].function_Id,
          parms : Order[0]
      })
    })
     // .then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  }

  function getCOSreenData(order){
     debugger;
       var data = JSON.stringify({
         spName : "",
         parms : data
       })
       const RestAPIURL = API_ROOT.backendAPIGWsvc;
       const requestURL = `${RestAPIURL}ExecSPM/`;
       return fetch(requestURL, {
       method: "POST",
       headers: {
         Accept: "application/json",
         "Content-Type": "application/json"
       },
       body: JSON.stringify({
           spName : 'sps_getCOScreenData',
           token: sessionStorage.getItem("token"),
           funcId : order[1].function_Id,
           parms : order[0]
       })
     })
      // .then(statusHelper)
       .then(response => response.json())
       .catch(error => error);
   }


  function updateChangeOrder(order) {
    //debugger;
const RestAPIURL = API_ROOT.backendAPIGWsvc;
const requestURL = `${RestAPIURL}ExecSP/`;
return fetch(requestURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          spName : 'spu_ChangeOrderDetails',
          token: sessionStorage.getItem("token"),
          funcId : order[1].function_Id,
          parms : order[0]
      })
    })
      .then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  }

  function getChangeOrder(order){
    //debugger;
      var data = JSON.stringify({
        spName : "",
        parms : order
      })
      const RestAPIURL = API_ROOT.backendAPIGWsvc;
      const requestURL = `${RestAPIURL}ExecSPM/`;
      return fetch(requestURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          spName : 'sps_getChangeOrderDetailsById',
          token: sessionStorage.getItem("token"),
          funcId : '72',
          parms : order
      })
    })
     // .then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  }

  function statusHelper(response) {
    //debugger;
    if (!response.ok) {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
    return response;
  }


  function* inserChangeOrderDetails(orderData){
    try{
     debugger

      const resultMessage = yield call(insertChangeOrder, orderData);
      if (isJSON(resultMessage)) {
        let resultObj = JSON.parse(resultMessage);
        if (resultObj.message != "ok") {
          //debugger;
          yield put({
            type: ChangeOrderActions.MESSAGE,
            message: { val: resultObj.val , statusMsg: resultObj.result }
          });
        }
      else {
   debugger;
       sessionStorage.setItem("token", resultObj.token);
       if(resultObj.roles.length != undefined) {
         sessionStorage.setItem("roles", JSON.stringify(resultObj.roles));
       }
        yield put({
            type: ChangeOrderActions.MESSAGE,
            message: {val :2, statusMsg :resultObj.result}
          });
   } }
  }catch (e) {
    yield put({ type: ChangeOrderActions.MESSAGE, message: {val:-1, statusMsg:e} });
    }
    finally{
    }
  }

  function isJSON(str) {
    try {
      return (JSON.parse(str) && !!str);
    } catch (e) {
      return false;
    }
  }

  function* updateChangeOrderDetails(orderData){
    try{
     debugger
      const resultMessage = yield call(updateChangeOrder, orderData);
      if (isJSON(resultMessage)) {
        let resultObj = JSON.parse(resultMessage);
        if (resultObj.message != "ok") {
          //debugger;
          yield put({
            type: ChangeOrderActions.MESSAGE,
            message: { val: resultObj.val, statusMsg: resultObj.result }
          });
        }

     else {
        sessionStorage.setItem("token", resultObj.token);
        if(resultObj.roles.length != undefined) {
          sessionStorage.setItem("roles", JSON.stringify(resultObj.roles));
        }
        yield put({
            type: ChangeOrderActions.MESSAGE,
            message: {val :2, statusMsg :resultObj.result}
          });
        }
   } }catch (e) {
    yield put({ type: ChangeOrderActions.MESSAGE, message: {val:-1, statusMsg:e} });
    }
    finally{
      if (yield cancelled())
      yield put({ type: ChangeOrderActions.MESSAGE, message:{val:-1,statusMsg: "Task Cancelled" }});
    }
  }

  function* getCOScreenDetails(orderData){
    try {
debugger
      let resultObj = yield call(getCOSreenData, orderData.payload);
      debugger
      if (isJSON(resultObj)) {
        resultObj = JSON.parse(resultObj);
        if (resultObj.message != "ok") {
          //debugger;
          yield put({
            type: ChangeOrderActions.MESSAGE,
            message: { val: resultObj.val, statusMsg: resultObj.result }
          });
        } else {
          debugger
          sessionStorage.setItem("token", resultObj.token);
          if(resultObj.roles.length != undefined) {
            sessionStorage.setItem("roles", JSON.stringify(resultObj.roles));
          }
          yield put({
              type: ChangeOrderActions.ITEMS,
              items: resultObj.result
        });
      }
    }
    } catch (e) {
debugger
      yield put({ type: ChangeOrderActions.MESSAGE, message: e });
    } finally {

      if (yield cancelled())
        yield put({ type: ChangeOrderActions.MESSAGE, message: "Task Cancelled" });
    }
  }

  function* getChangeOrderDetails(orderData){
    try {

      let resultObj = yield call(getChangeOrder,orderData.Order);
      //debugger
      if (isJSON(resultObj)) {
        resultObj = JSON.parse(resultObj);
        if (resultObj.message != "ok") {
          //debugger;
          yield put({
            type: ChangeOrderActions.MESSAGE,
            message: { val: resultObj.val, statusMsg: resultObj.result }
          });
        } else {
         // debugger
          sessionStorage.setItem("token", resultObj.token);
          if(resultObj.roles.length != undefined) {
            sessionStorage.setItem("roles", JSON.stringify(resultObj.roles));
          }
           yield put({
              type: ChangeOrderActions.ITEMS,
              items: resultObj.result
        });
      }
    }
    } catch (e) {

      yield put({ type: ChangeOrderActions.MESSAGE, message: e });
    } finally {

      if (yield cancelled())
        yield put({ type: ChangeOrderActions.MESSAGE, message: "Task Cancelled" });
    }
  }
  export function* handleRequest(action) {
debugger
    try {
      switch (action.type) {
        case ChangeOrderActions.INSERT_CHANGEORDER_REQUEST: {

          const fetchTask = yield fork(inserChangeOrderDetails, action.order.order);
          break;
        }
        case ChangeOrderActions.UPDATE_CHANGEORDER_REQUEST : {
          const fetchTask = yield fork(updateChangeOrderDetails, action.order.order);
          break;
        }
        case ChangeOrderActions.FETCH_CHANGEORDER_REQUEST: {
          const fetchTask = yield fork(getChangeOrderDetails,action.order);
          break;
        }
        case ChangeOrderActions.GET_SCREENDATA_REQUEST: {
          const fetchTask = yield fork(getCOScreenDetails,action.payload);
          break;
        }

        default: {
          return null;
          break;
        }
      }
    } catch (e) {
     console.log(e.message);
    }
  }

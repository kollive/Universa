
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
  import { types as COTypes } from "../../reducers/ChangeOrders/colistreducer";
  import { API_ROOT } from '../../apiconfig';


   function getCOListFunction(selectedCO)
  {
     //alert(sessionStorage.getItem("token"))
        //debugger;
    //console.log(StaffData.Staff);
    //console.log(StaffData.password);

    //new Promise((resolve, reject) => {
    const RestAPIURL = API_ROOT.backendAPIGWsvc;
    const requestURL = `${RestAPIURL}ExecSPM/`;
    return fetch(requestURL, {
    //return fetch("http://hvs.selfip.net:4003/ExecSPM/", {
      //return fetch("http://localhost:4003/GetRoleTable/", {

      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        spName: "sps_getChangeOrderList",
        token: sessionStorage.getItem("token"),
        funcId:selectedCO.function_id,
        parms: {

        }
      })
    })
    // .then(statusHelper)
      .then(response => response.json())
      .catch(error => error);

  }


  //.then(data => data)
  function statusHelper(response) {
    debugger;


    return response;
  }





  function* getCOList(selectedCO) {
    debugger;
    try {
      let resultObj = yield call(getCOListFunction,selectedCO.payload);
    if (isJSON(resultObj)) {
      resultObj = JSON.parse(resultObj);
      debugger;
      if (resultObj.message != "ok") {
      debugger;

        yield put({
          type: COTypes.MESSAGE,
          message: {val: resultObj.val,msg:resultObj.result}
        });
      } else {
debugger
       sessionStorage.setItem("token", resultObj.token);
      if(resultObj.roles.length != undefined)
      sessionStorage.setItem("roles", JSON.stringify(JSON.parse(resultObj).roles));
        yield put({
          type: COTypes.ITEMS,
          items:resultObj.result
        });
      }
    }
    } catch (e) {
      //debugger;
      yield put({ type: COTypes.MESSAGE, message: e });
    } finally {
      //debugger;
      if (yield cancelled())
        yield put({ type: COTypes.MESSAGE, message: "Task Cancelled" });
    }
  }
  function deleteCOFunction(selectedCO)
 {
     debugger
   return fetch("http://hvs.selfip.net:4003/execSP/", {
     method: "POST",
     headers: {
       Accept: "application/json",
       "Content-Type": "application/json"
     },
     body: JSON.stringify({
         spName: 'spd_ChangeOrder',
        token: sessionStorage.getItem("token"),
        funcId:selectedCO[1].function_Id,
         parms:{"change_order_id":selectedCO[0].row.change_order_id}
     })
   })
     //.then(statusHelper)
     .then(response => response.json())
     .catch(error => error);
 }

 function* deleteChangeOrder(selectedCO) {
   try {
     let resultObj = yield call(deleteCOFunction,selectedCO.payload);

     if (isJSON(resultObj)) {
      resultObj = JSON.parse(resultObj);
      //debugger;
      if (resultObj.message != "ok") {
     // debugger;
        yield put({
          type: COTypes.MESSAGE,
          message: {val: resultObj.val,msg:resultObj.result}
        });
      } else {
       sessionStorage.setItem("token", resultObj.token);
      if(resultObj.roles.length != undefined)
       sessionStorage.setItem("roles", JSON.stringify(JSON.parse(resultObj).roles));
       let state=yield select()
       debugger
       let items=[];
       items[0]=state.ChangeOrderListState.items[0].filter(del=>del.change_order_id!==selectedCO.payload[0].row.change_order_id)
       items[1]=state.ChangeOrderListState.items[1]
       yield put({
         type: COTypes.ITEMS,
         items:items
       });
       //debugger
       yield put({
         type: COTypes.MESSAGE,
         message: {val: 1, msg: resultObj.result[0].RESULT_MESSAGE}
       });
      }
    }
    } catch (e) {
      //debugger;
      yield put({ type: COTypes.MESSAGE, message: e });
    } finally {
      //debugger;
      if (yield cancelled())
        yield put({ type: COTypes.MESSAGE, message: "Task Cancelled" });
    }

 }
  export function* handleRequest(action) {
    console.log("Change Order List Saga request", action);
    try {
      switch (action.type) {
        case COTypes.FETCH_LIST_REQUEST: {
          const fetchTask = yield fork(getCOList,action.payload);
          break;
        }
        case COTypes.DELETE_LIST_REQUEST: {
          const fetchTask = yield fork(deleteChangeOrder,action.payload);
          break;
        }

        default: {
          return null;
          break;
        }
      }
    } catch (e) {
      yield put({ type: COTypes.MESSAGE, error: e });
    }
  }

  function isJSON(str) {
    try {
     // debugger
      return (JSON.parse(str) && !!str);
    } catch (e) {
      return false;
    }
  }

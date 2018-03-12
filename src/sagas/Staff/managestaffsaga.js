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
  import { types as StaffTypes } from "../../reducers/Staff/managestaffreducer.js";
  import * as utils from "../../Utils/common"

  function insertStaff(StaffData) {
  // debugger;
  //  return fetch("http://localhost:4003/ExecSP/", {
  return fetch("http://hvs.selfip.net:4003/ExecSP/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          spName : 'spi_StaffDetails',
          token: sessionStorage.getItem("token"),
          funcId : StaffData[1].function_Id,
          parms : StaffData[0]
      })
    })
     // .then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  }


  function updateStaff(StaffData) {
    debugger;
//  return fetch("http://localhost:4003/ExecSP/", {
return fetch("http://hvs.selfip.net:4003/ExecSP/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          spName : 'spu_StaffDetails',
          token: sessionStorage.getItem("token"),
          funcId : StaffData[1].function_Id,
          parms : StaffData[0]
      })
    })
      //.then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  }

  function getStaffFunction(StaffData){
  //debugger;
      var data = JSON.stringify({
        spName : "",
        parms : StaffData
      })
      // http://hvs.selfip.net:4003/ExecSP/
   return fetch("http://hvs.selfip.net:4003/ExecSP/", {
    // return fetch("http://localhost:4003/ExecSPM/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          spName : 'sps_GetStaffDetailsById',
          token: sessionStorage.getItem("token"),
          funcId :StaffData[1].function_Id,
          parms : StaffData[0]
      })
    })
     // .then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  }
function getStaffResDetailsFunction(StaffData){
   // debugger;
      var data = JSON.stringify({
        spName : "",
        parms : StaffData
      })
      // http://hvs.selfip.net:4003/ExecSP/
   return fetch("http://hvs.selfip.net:4003/ExecSPM/", {
    // return fetch("http://localhost:4003/ExecSPM/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          spName : 'sps_GetStaffResourceData',
          token: sessionStorage.getItem("token"),
          funcId : StaffData[1].function_Id,
          parms : StaffData[0]
      })
    })
     // .then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  }

  function statusHelper(response) {
    debugger;
    if (!response.ok) {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
    return response;
  }


  function* insertStaffDetails(StaffData){
    try{
   debugger
    
      const resultMessage = yield call(insertStaff, StaffData.payload);
      if (isJSON(resultMessage)) {
        let resultObj = JSON.parse(resultMessage);
        if (resultObj.message != "ok") {
          //debugger;
          yield put({
            type: StaffTypes.MESSAGE,
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
            type: StaffTypes.MESSAGE,
            message: {val :2, statusMsg :resultObj.result}
          });
   } }
  }catch (e) {
    yield put({ type: StaffTypes.MESSAGE, message: {val:-1, statusMsg:e} });
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

  function* updateStaffDetails(StaffData){
    try{
     debugger
      const resultMessage = yield call(updateStaff, StaffData.payload);
      if (isJSON(resultMessage)) {
        let resultObj = JSON.parse(resultMessage);
        if (resultObj.message != "ok") {
          //debugger;
          yield put({
            type: StaffTypes.MESSAGE,
            message: { val: resultObj.val, statusMsg: resultObj.result }
          });
        }
      
      // if (resultMessage.response && !resultMessage.response.ok) {
      //   debugger;
      //   yield put({
      //     type: StaffTypes.MESSAGE,
      //     message: {val:-1,statusMsg: resultMessage.response.statusText}
      //   });
      // } else {
      else {
        sessionStorage.setItem("token", resultObj.token);
        if(resultObj.roles.length != undefined) {
          sessionStorage.setItem("roles", JSON.stringify(resultObj.roles));
        } 
        yield put({
            type: StaffTypes.MESSAGE,
            message: {val :2, statusMsg :resultObj.result}
          });
        }
   } }catch (e) {
    yield put({ type: StaffTypes.MESSAGE, message: {val:-1, statusMsg:e} });
    }
    finally{
      if (yield cancelled())
      yield put({ type: StaffTypes.MESSAGE, message:{val:-1,statusMsg: "Task Cancelled" }});
    }
  }
 
  function* getStaffDetails(StaffData){
    try {
          
      let resultObj = yield call(getStaffFunction,StaffData.payload);
         // alert('he me ' +resultObj)
      alert(resultObj)
      
      if (isJSON(resultObj)) {
        resultObj = JSON.parse(resultObj);
        if (resultObj.message != "ok") {
          
          yield put({
            type: StaffTypes.MESSAGE,
            message: { val: resultObj.val, statusMsg: resultObj.result }
          });
        } else {
          
         
          sessionStorage.setItem("token", resultObj.token);
          if(resultObj.roles.length != undefined) {
            sessionStorage.setItem("roles", JSON.stringify(resultObj.roles));
          }       
         
          
           yield put({
              type: StaffTypes.STAFFITEMS,
              staffrow: resultObj.result
        });
      }
    }
    } catch (e) {
      
      yield put({ type: StaffTypes.MESSAGE, message: e });
    } finally {
      
      if (yield cancelled())
        yield put({ type: StaffTypes.MESSAGE, message: "Task Cancelled" });
    }
  }
  
 
 function* getStaffResDetails(StaffData){
    try {
          
     debugger
      let resultObj = yield call(getStaffResDetailsFunction,StaffData.payload);
      
      if (isJSON(resultObj)) {
        resultObj = JSON.parse(resultObj);
        if (resultObj.message != "ok") {
          //debugger;
          yield put({
            type: StaffTypes.MESSAGE,
            message: { val: resultObj.val, statusMsg: resultObj.result }
          });
        } else {
          //debugger
          sessionStorage.setItem("token", resultObj.token);
          if(resultObj.roles.length != undefined) {
            sessionStorage.setItem("roles", JSON.stringify(resultObj.roles));
          }       
           yield put({
              type: StaffTypes.ITEMS,
              items: resultObj.result
        });
      }
    }
    } catch (e) {
      
      yield put({ type: StaffTypes.MESSAGE, message: e });
    } finally {
      
      if (yield cancelled())
        yield put({ type: StaffTypes.MESSAGE, message: "Task Cancelled" });
    }
  }
 
  export function* handleRequest(action) {
    
    try {
      switch (action.type) {
        case StaffTypes.INSERT_REQUEST: {
          
          const fetchTask = yield fork(insertStaffDetails, action.payload);
          break;
        }   
        case StaffTypes.UPDATE_STAFF_REQUEST : {
          const fetchTask = yield fork(updateStaffDetails, action.payload);
          break;          
        }
        case StaffTypes.FETCH_STAFF_REQUEST: {
          const fetchTask = yield call(getStaffDetails,action.payload);
          break;
        } 
       case StaffTypes.FETCH_STAFF_RESOURCE_DETAILS: {
          const fetchTask = yield call(getStaffResDetails,action.payload);
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

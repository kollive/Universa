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
  import { types as TimesheetTypes } from "../../reducers/Timesheet/timesheetreducer.js";
  import * as utils from "../../Utils/common";
  import { API_ROOT } from '../../apiconfig';

    function insertTimesheet(timesheetData) {
      //debugger
      const RestAPIURL = API_ROOT.backendAPIGWsvc;
      const requestURL = `${RestAPIURL}ExecSP/`;
      return fetch(requestURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          spName : 'spi_UnivSaveTimesheet',
          token: sessionStorage.getItem("token"),
          funcId : timesheetData[1].function_Id,
          parms : timesheetData[0]
      })
    })
      .then(response => response.json())
      .catch(error => error);
  }


  function updateTimesheet(timesheetData) {
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
          spName : 'spu_StaffDetails',
          token: sessionStorage.getItem("token"),
          funcId : timesheetData[1].function_Id,
          parms : timesheetData[0]
      })
    })
      //.then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  }

  function getTimesheet(timesheetData){
   const RestAPIURL = API_ROOT.backendAPIGWsvc;
   const requestURL = `${RestAPIURL}ExecSP/`;
   return fetch(requestURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          spName : 'sps_UnivGetTimesheet',
          token: sessionStorage.getItem("token"),
          funcId :timesheetData[1].function_Id,
          parms : timesheetData[0]
      })
    })
      .then(response => response.json())
      .catch(error => error);
  }
 

  function* insertTimesheetDetails(timesheetData){
    try{
   //debugger
    
      const resultMessage = yield call(insertTimesheet, timesheetData.payload);
      if (isJSON(resultMessage)) {
        let resultObj = JSON.parse(resultMessage);
        if (resultObj.message != "ok") {
          //debugger;
          yield put({
            type: TimesheetTypes.MESSAGE,
            message: { val: resultObj.val , statusMsg: resultObj.result }
          });
        }
      else {
   //debugger;
       sessionStorage.setItem("token", resultObj.token);
       if(resultObj.roles.length != undefined) {
         sessionStorage.setItem("roles", JSON.stringify(resultObj.roles));
       } 
        // yield put({
        //     type: TimesheetTypes.MESSAGE,
        //     message: {val :2, statusMsg :resultObj.result}
        //   });
        //alert(resultObj.result.length)
             yield put({
              type: TimesheetTypes.ITEMS,
              items: resultObj.result
        });
   } }
  }catch (e) {
    yield put({ type: TimesheetTypes.MESSAGE, message: {val:-1, statusMsg:e} });
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

  function* updateTimesheetDetails(timesheetData){
    try{
     //debugger
      const resultMessage = yield call(updateTimesheet, timesheetData.payload);
      if (isJSON(resultMessage)) {
        let resultObj = JSON.parse(resultMessage);
        if (resultObj.message != "ok") {
          //debugger;
          yield put({
            type: TimesheetTypes.MESSAGE,
            message: { val: resultObj.val, statusMsg: resultObj.result }
          });
        }
      else {
        sessionStorage.setItem("token", resultObj.token);
        if(resultObj.roles.length != undefined) {
          sessionStorage.setItem("roles", JSON.stringify(resultObj.roles));
        } 
        yield put({
            type: TimesheetTypes.MESSAGE,
            message: {val :2, statusMsg :resultObj.result}
          });
        }
   } }catch (e) {
    yield put({ type: TimesheetTypes.MESSAGE, message: {val:-1, statusMsg:e} });
    }
    finally{
      if (yield cancelled())
      yield put({ type: TimesheetTypes.MESSAGE, message:{val:-1,statusMsg: "Task Cancelled" }});
    }
  }
 
  function* getTimesheetDetails(timesheetData){
    try {
          
      let resultObj = yield call(getTimesheet,timesheetData.payload);
      if (isJSON(resultObj)) {
        resultObj = JSON.parse(resultObj);
        if (resultObj.message != "ok") {
          
          yield put({
            type: TimesheetTypes.MESSAGE,
            message: { val: resultObj.val, statusMsg: resultObj.result }
          });
        } else {
         
          sessionStorage.setItem("token", resultObj.token);
          if(resultObj.roles.length != undefined) {
            sessionStorage.setItem("roles", JSON.stringify(resultObj.roles));
          }       
          
           yield put({
              type: TimesheetTypes.ITEMS,
              items: resultObj.result
        });
      }
    }
    } catch (e) {
      
      yield put({ type: TimesheetTypes.MESSAGE, message: e });
    } finally {
      
      if (yield cancelled())
        yield put({ type: TimesheetTypes.MESSAGE, message: "Task Cancelled" });
    }
  }
  
  
  export function* handleRequest(action) {
    
    try {
     
      
      switch (action.type) {
        case TimesheetTypes.INSERT_TIME_REQUEST: {
          const fetchTask = yield fork(insertTimesheetDetails, action.payload);
          break;
        }   
        case TimesheetTypes.UPDATE_TIME_REQUEST : {
          const fetchTask = yield fork(updateTimesheetDetails, action.payload);
          break;          
        }
        case TimesheetTypes.FETCH_TIME_REQUEST: {
          const fetchTask = yield call(getTimesheetDetails,action.payload);
          break;
        }  
        default: {
          break;
        }
      }
    } catch (e) {
     console.log(e.message);
    }
  }

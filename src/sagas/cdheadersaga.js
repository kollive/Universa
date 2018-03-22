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
import { types as headertypes } from "../reducers/cdheaderreducer";
 import { API_ROOT } from '../apiconfig';
//import { push } from 'react-router-redux';

const headerSaga = {
  
  renderHeader(loginUserData) {
    //debugger;
    console.log(loginUserData.user);
  
      return fetch("http://hvs.selfip.net:4003/loginsvc/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usr: loginUserData.user,
        pwd: loginUserData.password
      })
    })
      .then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  },

  
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

function* renderHeader(userData) {
  //debugger;
 
    
 
}

  function getStaffDetailsFunction(staffData){
   const RestAPIURL = API_ROOT.backendAPIGWsvc;
   const requestURL = `${RestAPIURL}ExecSP/`;
   return fetch(requestURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          spName : 'sps_GetStaffByID',
          token: sessionStorage.getItem("token"),
          funcId :staffData[1].function_Id,
          parms : staffData[0]
      })
    })
      .then(response => response.json())
      .catch(error => error);
  }
   function* getStaffDetails(staffData){
    try {
      let resultObj = yield call(getStaffDetailsFunction,staffData.payload);
      if (isJSON(resultObj)) {
        resultObj = JSON.parse(resultObj);
        if (resultObj.message != "ok") {
          
          yield put({
            type: headertypes.MESSAGE,
            message: { val: resultObj.val, statusMsg: resultObj.result }
          });
        } else {
         
          sessionStorage.setItem("token", resultObj.token);
          if(resultObj.roles.length != undefined) {
            sessionStorage.setItem("roles", JSON.stringify(resultObj.roles));
          }       
          
           yield put({
              type: headertypes.ITEMS,
              items: resultObj.result
        });
      }
    }
    } catch (e) {
      
      yield put({ type: headertypes.MESSAGE, message: e });
    } finally {
      
      if (yield cancelled())
        yield put({ type: headertypes.MESSAGE, message: "Task Cancelled" });
    }
  }
  export function* handleRequest(action) {
    //debugger;
    try {
      switch (action.type) {
      
         
     case  headertypes.GET_STAFF_DETAILS: {
          const fetchTask = yield call(getStaffDetails,action.payload);
          break;
        } 
        default: {
          break;
        }
      }
    } catch (e) {
      yield put({ type: headertypes.MESSAGE, error: e });
    }
  }
  function isJSON(str) {
    try {
      return (JSON.parse(str) && !!str);
    } catch (e) {
      return false;
    }
  }

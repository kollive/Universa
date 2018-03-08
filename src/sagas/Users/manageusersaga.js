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
  import { types as UserTypes, permissions as Permissions } from "reducers/Users/manageusersreducer.js";
  import * as utils from "Utils/common"

  function insertUser(userData) {
   // debugger;
  //  return fetch("http://localhost:4003/ExecSP/", {
  return fetch("http://hvs.selfip.net:4003/ExecSP/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          spName : 'spi_UserDetails',
          token: sessionStorage.getItem("token"),
          funcId : '1',
          parms : userData
      })
    })
     // .then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  }


  function updateUser(userData) {
    //debugger;
//  return fetch("http://localhost:4003/ExecSP/", {
return fetch("http://hvs.selfip.net:4003/ExecSP/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          spName : 'spu_UserDetails',
          token: sessionStorage.getItem("token"),
          funcId : '1',
          parms : userData
      })
    })
      .then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  }

  function getUser(user){
    //debugger;
      var data = JSON.stringify({
        spName : "",
        parms : user
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
          spName : 'sps_GetUserDetailsById',
          token: sessionStorage.getItem("token"),
          funcId : '3',
          parms : user
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


  function* insertUserDetails(userData){
    try{
    // debugger
    
      const resultMessage = yield call(insertUser, userData.user);
      if (isJSON(resultMessage)) {
        let resultObj = JSON.parse(resultMessage);
        if (resultObj.message != "ok") {
          //debugger;
          yield put({
            type: UserTypes.MESSAGE,
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
            type: UserTypes.MESSAGE,
            message: {val :2, statusMsg :resultObj.result}
          });
   } }
  }catch (e) {
    yield put({ type: UserTypes.MESSAGE, message: {val:-1, statusMsg:e} });
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

  function* updateUserDetails(userData){
    try{
     debugger
      const resultMessage = yield call(updateUser, userData.user);
      if (isJSON(resultMessage)) {
        let resultObj = JSON.parse(resultMessage);
        if (resultObj.message != "ok") {
          //debugger;
          yield put({
            type: UserTypes.MESSAGE,
            message: { val: resultObj.val, statusMsg: resultObj.result }
          });
        }
      
      // if (resultMessage.response && !resultMessage.response.ok) {
      //   debugger;
      //   yield put({
      //     type: UserTypes.MESSAGE,
      //     message: {val:-1,statusMsg: resultMessage.response.statusText}
      //   });
      // } else {
      else {
        sessionStorage.setItem("token", resultObj.token);
        if(resultObj.roles.length != undefined) {
          sessionStorage.setItem("roles", JSON.stringify(resultObj.roles));
        } 
        yield put({
            type: UserTypes.MESSAGE,
            message: {val :2, statusMsg :resultObj.result}
          });
        }
   } }catch (e) {
    yield put({ type: UserTypes.MESSAGE, message: {val:-1, statusMsg:e} });
    }
    finally{
      if (yield cancelled())
      yield put({ type: UserTypes.MESSAGE, message:{val:-1,statusMsg: "Task Cancelled" }});
    }
  }
 
  function* getUserDetails(userData){
    try {
     
      let resultObj = yield call(getUser,userData.user);
      //debugger
      if (isJSON(resultObj)) {
        resultObj = JSON.parse(resultObj);
        if (resultObj.message != "ok") {
          //debugger;
          yield put({
            type: UserTypes.MESSAGE,
            message: { val: resultObj.val, statusMsg: resultObj.result }
          });
        } else {
         // debugger
          sessionStorage.setItem("token", resultObj.token);
          if(resultObj.roles.length != undefined) {
            sessionStorage.setItem("roles", JSON.stringify(resultObj.roles));
          }       
           yield put({
              type: UserTypes.ITEMS,
              items: resultObj.result
        });
      }
    }
    } catch (e) {
      
      yield put({ type: UserTypes.MESSAGE, message: e });
    } finally {
      
      if (yield cancelled())
        yield put({ type: UserTypes.MESSAGE, message: "Task Cancelled" });
    }
  }
  export function* handleRequest(action) {
    
    try {
      switch (action.type) {
        case UserTypes.INSERT_REQUEST: {
          
          const fetchTask = yield fork(insertUserDetails, action.user);
          break;
        }   
        case UserTypes.UPDATE_USER_REQUEST : {
          const fetchTask = yield fork(updateUserDetails, action.user);
          break;          
        }
        case UserTypes.FETCH_USER_REQUEST: {
          
          const fetchTask = yield fork(getUserDetails,action.user);
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

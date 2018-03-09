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
  import { types as usersListTypes } from "reducers/usersList_reducer";



   function getUserListFunction(selectedUserData)
  { 
        //debugger;
    //console.log(userData.user);
    //console.log(userData.password);

    //new Promise((resolve, reject) => {
    return fetch("http://hvs.selfip.net:4003/ExecSPM/", {
      //return fetch("http://localhost:4003/GetRoleTable/", {

      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        spName: "sps_getUsers",
        token: sessionStorage.getItem("token"),
        funcId:selectedUserData.function_id,        
        parms: {
            "cname" : ""
        }
      })
    })
    // .then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
    
  }


  //.then(data => data)
  function statusHelper(response) {
    //debugger;
      
   
    return response;
  }





  function* getUsersList(selectedUserData) {
    //debugger;
    try {
      let resultObj = yield call(getUserListFunction,selectedUserData.payload);
    if (isJSON(resultObj)) {
      resultObj = JSON.parse(resultObj);
      //debugger;
      if (resultObj.message != "ok") {
     // debugger;
        yield put({
          type: usersListTypes.MESSAGE,
          message: {val: resultObj.val,msg:resultObj.result}
        });
      } else {
      
       sessionStorage.setItem("token", resultObj.token);
      if(resultObj.roles.length != undefined) 
      sessionStorage.setItem("roles", JSON.stringify(JSON.parse(resultObj).roles));
        yield put({
          type: usersListTypes.ITEMS,
          items:resultObj.result
        });
      }
    }
    } catch (e) {
      //debugger;
      yield put({ type: usersListTypes.MESSAGE, message: e });
    } finally {
      //debugger;
      if (yield cancelled())
        yield put({ type: usersListTypes.MESSAGE, message: "Task Cancelled" });
    }
  }
  function deleteUserFunction(selectedUserData)
 {
   return fetch("http://hvs.selfip.net:4003/execSP/", {
     method: "POST",
     headers: {
       Accept: "application/json",
       "Content-Type": "application/json"
     },
     body: JSON.stringify({
         spName: 'spd_deleteUser',
        token: sessionStorage.getItem("token"),
        funcId:selectedUserData.function_id,                  
         parms:{"hv_user_id":selectedUserData.hv_user_id}
     })
   })
     //.then(statusHelper)
     .then(response => response.json())
     .catch(error => error);
 }

 function* deleteUser(selectedUserData) {
   try {

     let resultObj = yield call(deleteUserFunction,selectedUserData.payload);
     if (isJSON(resultObj)) {
      resultObj = JSON.parse(resultObj);
      //debugger;
      if (resultObj.message != "ok") {
     // debugger;
        yield put({
          type: usersListTypes.MESSAGE,
          message: {val: resultObj.val,msg:resultObj.result}
        });
      } else {
       sessionStorage.setItem("token", resultObj.token);
      if(resultObj.roles.length != undefined) 
       sessionStorage.setItem("roles", JSON.stringify(JSON.parse(resultObj).roles));
       let state=yield select()
       //debugger
       let items=[];
       items[0]=state.usersListState.items[0].filter(del=>del.hv_user_id!==selectedUserData.payload.hv_user_id)
       items[1]=state.usersListState.items[1]
       yield put({
         type: usersListTypes.ITEMS,
         items:items
       });
       //debugger
       yield put({
         type: usersListTypes.MESSAGE,
         message: {val: 1, msg: resultObj.result[0].RESULT_MESSAGE}
       });
      }
    }
    } catch (e) {
      //debugger;
      yield put({ type: usersListTypes.MESSAGE, message: e });
    } finally {
      //debugger;
      if (yield cancelled())
        yield put({ type: usersListTypes.MESSAGE, message: "Task Cancelled" });
    }
     
 }

  export function* handleRequest(action) {
    //debugger;
    console.log("UsersList Saga request", action);
    try {
      switch (action.type) {
        case usersListTypes.FETCH_REQUEST: {
          const fetchTask = yield fork(getUsersList,action.payload);
          break;
        }
        case usersListTypes.DELETE_REQUEST: {
          //debugger;
          const fetchTask = yield fork(deleteUser,action.payload);
          break;
        }
        default: {
          return null;
          break;
        }
      }
    } catch (e) {
      yield put({ type: usersListTypes.MESSAGE, error: e });
    }
  }

  function isJSON(str) {
    try {
      //debugger
      return (JSON.parse(str) && !!str);
    } catch (e) {
      return false;
    }
  }

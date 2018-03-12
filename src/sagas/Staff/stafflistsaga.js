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
  import { types as staffListTypes } from "../../reducers/Staff/stafflistreducer";



   function getStaffListFunction(selectedStaffData)
  { 
     //alert(sessionStorage.getItem("token"))
        //debugger;
    //console.log(StaffData.Staff);
    //console.log(StaffData.password);

    //new Promise((resolve, reject) => {
    return fetch("http://hvs.selfip.net:4003/ExecSPM/", {
      //return fetch("http://localhost:4003/GetRoleTable/", {

      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        spName: "sps_GetStaffDetails",
        token: sessionStorage.getItem("token"),
        funcId:selectedStaffData.function_id,        
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
    debugger;
      
   
    return response;
  }





  function* getstaffList(selectedStaffData) {
    //debugger;
    try {
      let resultObj = yield call(getStaffListFunction,selectedStaffData.payload);
    if (isJSON(resultObj)) {
      resultObj = JSON.parse(resultObj);
      debugger;
      if (resultObj.message != "ok") {
     // debugger;
     
        yield put({
          type: staffListTypes.MESSAGE,
          message: {val: resultObj.val,msg:resultObj.result}
        });
      } else {
      
       sessionStorage.setItem("token", resultObj.token);
      if(resultObj.roles.length != undefined) 
      sessionStorage.setItem("roles", JSON.stringify(JSON.parse(resultObj).roles));
        yield put({
          type: staffListTypes.ITEMS,
          items:resultObj.result
        });
      }
    }
    } catch (e) {
      //debugger;
      yield put({ type: staffListTypes.MESSAGE, message: e });
    } finally {
      //debugger;
      if (yield cancelled())
        yield put({ type: staffListTypes.MESSAGE, message: "Task Cancelled" });
    }
  }
  function deleteStaffFunction(selectedStaffData)
 {
   return fetch("http://hvs.selfip.net:4003/execSP/", {
     method: "POST",
     headers: {
       Accept: "application/json",
       "Content-Type": "application/json"
     },
     body: JSON.stringify({
         spName: 'spd_deleteStaff',
        token: sessionStorage.getItem("token"),
        funcId:selectedStaffData[1].function_Id,                  
         parms:{"hv_staff_id":selectedStaffData[0].row.hv_staff_id}
     })
   })
     //.then(statusHelper)
     .then(response => response.json())
     .catch(error => error);
 }

 function* deleteStaff(selectedStaffData) {
   try {

     let resultObj = yield call(deleteStaffFunction,selectedStaffData.payload);
     if (isJSON(resultObj)) {
      resultObj = JSON.parse(resultObj);
      //debugger;
      if (resultObj.message != "ok") {
     // debugger;
        yield put({
          type: staffListTypes.MESSAGE,
          message: {val: resultObj.val,msg:resultObj.result}
        });
      } else {
       sessionStorage.setItem("token", resultObj.token);
      if(resultObj.roles.length != undefined) 
       sessionStorage.setItem("roles", JSON.stringify(JSON.parse(resultObj).roles));
       let state=yield select()
       debugger
       let items=[];
       items[0]=state.StaffListState.items[0].filter(del=>del.hv_staff_id!==selectedStaffData.payload[0].row.hv_staff_id)
       items[1]=state.StaffListState.items[1]
       yield put({
         type: staffListTypes.ITEMS,
         items:items
       });
       //debugger
       yield put({
         type: staffListTypes.MESSAGE,
         message: {val: 1, msg: resultObj.result[0].RESULT_MESSAGE}
       });
      }
    }
    } catch (e) {
      //debugger;
      yield put({ type: staffListTypes.MESSAGE, message: e });
    } finally {
      //debugger;
      if (yield cancelled())
        yield put({ type: staffListTypes.MESSAGE, message: "Task Cancelled" });
    }
     
 }
  export function* handleRequest(action) {
    //debugger;
    console.log("staffList Saga request", action);
    try {
      switch (action.type) {
        case staffListTypes.FETCH_REQUEST: {
          const fetchTask = yield fork(getstaffList,action.payload);
          break;
        }
        case staffListTypes.DELETE_REQUEST: {
          //debugger;
          const fetchTask = yield fork(deleteStaff,action.payload);
          break;
        }
         
        default: {
          return null;
          break;
        }
      }
    } catch (e) {
      yield put({ type: staffListTypes.MESSAGE, error: e });
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

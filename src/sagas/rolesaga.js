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
import { types as roleTypes } from "../reducers/rolereducer";
import * as download from "downloadjs";
import * as utils from "../Utils/common"
//import { push } from 'react-router-redux';

const attribApi = {
  exportToExcel(payload) {
    //debugger;
    console.log(payload);
    //console.log(userData.password);
    //alert(payload.spName)
    //new Promise((resolve, reject) => {
    return fetch("http://hvs.selfip.net:4003/ExportToExcel/", {
      //return fetch("http://localhost:4003/ExportToExcel/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
        //responseType: 'blob'
      },
      body: JSON.stringify({
        spName:
          "select role_id,role_cat_id,role_name,role_desc,role_active from troledefinition",
        cols: [
          {
            caption: "Role ID",
            type: "number",
            width: 5
          },
          {
            caption: "Role Cat ID",
            type: "string",
            width: 15
          },
          {
            caption: "Role Name",
            type: "string",
            width: 50
          },
          {
            caption: "Role Desc",
            type: "string",
            width: 50
          },
          {
            caption: "Role Active",
            type: "string",
            width: 5
          }
        ]
      })
    })
      .then(statusHelper)
      .then(response => response.blob())
      .catch(error => error);
  },

  getRoleTable(cname) {
    //debugger;
    //console.log(userData.user);
    //console.log(userData.password);
    //alert( sessionStorage.getItem("token"))

    //new Promise((resolve, reject) => {
    return fetch("http://hvs.selfip.net:4003/ExecSP/", {
    //return fetch("http://localhost:4003/ExecSP/", {

      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        spName: "sps_getRoles",
        //lstUpdTs :sessionStorage.getItem("lstUpdTs"),
        //funcId: "-1",
        token: sessionStorage.getItem("token"),
        parms: {
          cname: cname
        }
      })
    })
      //.then(response => response.json())
      //.then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  },

  insRoleTable(userData) {
    //debugger;
    //console.log(userData.user);
    //console.log(userData.password);

    //new Promise((resolve, reject) => {
    return fetch("http://hvs.selfip.net:4003/insRoleTable/", {
      //return fetch("http://hvs.selfip.net:4000/reactlogin/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hv_table_i: userData.tableID,
        hv_universal_name: userData.value
      })
    })
      .then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  },

  chkRoleTable(role_id) {
    //debugger;
    //console.log(userData.user);
    //console.log(userData.password);

    //new Promise((resolve, reject) => {
    return fetch("http://hvs.selfip.net:4003/ExecSP/", {
      //return fetch("http://hvs.selfip.net:4000/reactlogin/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        spName: "sps_checkRoleForUser",
        parms: {
          role_id: role_id
        }
      })
    })
      .then(response => statusHelper)
      .then(response => response.json())
      .catch(error => error);
  },

  delRoleTable(roleID) {
    //debugger;
    //console.log(userData.user);
    //console.log(userData.password);

    //new Promise((resolve, reject) => {
    return fetch("http://hvs.selfip.net:4003/ExecSP/", {
      //return fetch("http://hvs.selfip.net:4000/reactlogin/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        spName: "spd_Role",
        token: sessionStorage.getItem("token"),
        parms: {
          roleID: roleID
        }
      })
    })
      .then(statusHelper)
      .then(response => response.json())
      .catch(error => error);
  },

  updRoleTable(userData) {
    //debugger;
    //console.log(userData.user);
    //console.log(userData.password);

    //new Promise((resolve, reject) => {
    return fetch("http://hvs.selfip.net:4003/updRoleTable/", {
      //return fetch("http://hvs.selfip.net:4000/reactlogin/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hv_table_i: userData.tableID,
        hv_universal_i: userData.rowID,
        hv_universal_name: userData.value
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
  console.log("1111111")
  //let clone = response.clone();
  //console.log(response);
  var res;
  //res = Promise.resolve(response.json())
  //console.log(res.PromiseValue)
  if (!response.ok) {
    res = Promise.resolve(response.json());
    //console.log(res);
    res.then((val) => {
      console.log(val)/*
      alert(val.message);
      var error = {};
      //error.response = response;
      error.message = val.message;
      return error;   
      //return JSON.stringify(error);     
      */
      return val;
    })

    //const error = new Error(response.statusText);
    //error.response = response;
    //throw error;
    //throw Error(response);
  }
  return response;
}

function* insertRoleTable(userData) {
  try {
    yield put({
      type: roleTypes.ITEMS,
      items: []
    });

    yield put({
      type: roleTypes.SELECTED_ROWID,
      rowID: -1
    });

    let resultObj = yield call(attribApi.insRoleTable, userData.payload);
    resultObj = JSON.parse(resultObj);

    if (resultObj.message != "ok") {
      ////debugger;
      yield put({
        type: roleTypes.MESSAGE,
        message: { val: -1, msg: resultObj.result }
      });
    } else {
      ////debugger;
      //console.log(JSON.parse(resultObj).result);
      sessionStorage.setItem("token", resultObj.token);
    }

  } catch (e) {
  } finally {
  }
}

function* updateRoleTable(userData) {
  try {
    /*
      yield put({
        type: roleTypes.ITEMS,
        items: []
      });

      yield put({
        type: roleTypes.SELECTED_ROWID,
        rowID: -1
      });
      */

    let resultObj = yield call(attribApi.updRoleTable, userData.payload);
    resultObj = JSON.parse(resultObj);

    if (resultObj.message != "ok") {
      ////debugger;
      yield put({
        type: roleTypes.MESSAGE,
        message: { val: resultObj.val, msg: resultObj.result }
      });
    } else {
      ////debugger;
      //console.log(JSON.parse(resultObj).result);
      sessionStorage.setItem("token", resultObj.token);
    }

  } catch (e) {
  } finally {
  }
}

function* deleteRoleTable(roleID) {
  try {

    let resultObj = yield call(attribApi.delRoleTable, roleID);
    resultObj = JSON.parse(resultObj);

    if (utils.isJSON(resultObj)) {
      if (resultObj.message != "ok") {
        ////debugger;
        yield put({
          type: roleTypes.MESSAGE,
          message: { val: resultObj.val, msg: resultObj.result }
        });
      } else {
        ////debugger;
        //console.log(JSON.parse(resultObj).result);
        sessionStorage.setItem("token", resultObj.token);      

        resultObj = yield call(attribApi.getRoleTable, "");
        resultObj = JSON.parse(resultObj);

        if (resultObj.message != "ok") {
          ////debugger;
          yield put({
            type: roleTypes.MESSAGE,
            message: { val: resultObj.val, msg: resultObj.result }
          });
        }
        else {
          //debugger;
          sessionStorage.setItem("token", resultObj.token);
          yield put({
            type: roleTypes.ITEMS,
            items: resultObj.result
          });
        }
      }
    } else {
      yield put({
        type: roleTypes.MESSAGE,
        message: { val: resultObj.val, msg: resultObj.result }
      });
    }
  } catch (e) {
  } finally {
  }
}

function* exportToExcel(payload) {
  //debugger;
  try {
    //yield call(delay, 5000)
    //yield put({ type: roleTypes.LOGIN_REQUEST, isLoading: false })

    const resultObj = yield call(attribApi.exportToExcel, payload);

    //debugger;
    if (resultObj.response && !resultObj.response.ok) {
      //debugger;
      yield put({
        type: roleTypes.MESSAGE,
        message: resultObj.response.statusText
      });
    } else {
      //debugger;
      //console.log(resultObj);
      download(resultObj, "Role.xlsx");
      /*
        console.log(JSON.parse(resultObj).result)
        //sessionStorage.setItem("token", JSON.parse(resultObj).token);
        yield put({
          type: roleTypes.ITEMS,
          items: JSON.parse(resultObj).result
        });
        */
    }
    //yield put({ type: "LOGIN_STATUS", message: JSON.parse(resultObj).token })
  } catch (e) {
    /*
      //debugger;
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
    //debugger;
    yield put({ type: roleTypes.MESSAGE, message: e });
  } finally {
    //debugger;
    if (yield cancelled())
      yield put({ type: roleTypes.MESSAGE, message: "Task Cancelled" });
  }
}

function* getRoleTable(userData) {
  //debugger;
  try {
    //yield call(delay, 5000)
    //yield put({ type: roleTypes.LOGIN_REQUEST, isLoading: false })

    yield put({
      type: roleTypes.ITEMS,
      items: []
    });

    yield put({
      type: roleTypes.SELECTED_ROWID,
      rowID: -1
    });

    let resultObj = yield call(attribApi.getRoleTable, userData.payload);
    console.log(resultObj);

    if (utils.isJSON(resultObj)) {
      resultObj = JSON.parse(resultObj);
      ////debugger;
      if (resultObj.message != "ok") {
        ////debugger;
        yield put({
          type: roleTypes.MESSAGE,
          message: { val: resultObj.val, msg: resultObj.result }
        });
      } else {
        ////debugger;
        //console.log(JSON.parse(resultObj).result);
        //sessionStorage.setItem("token", resultObj.token);
        yield put({
          type: roleTypes.ITEMS,
          items: resultObj.result
        });
      }
    } else {      
      yield put({
        type: roleTypes.MESSAGE,
        message: { val: resultObj.val, msg: resultObj.result }
      });
    }
    //yield put({ type: "LOGIN_STATUS", message: JSON.parse(resultObj).token })
  } catch (e) {
    //debugger;
    yield put({ type: roleTypes.MESSAGE, message: { val: -1, msg: e } });
  } finally {
    //debugger;
    if (yield cancelled())
      yield put({ type: roleTypes.MESSAGE, message: { val: -1, msg: "Task Cancelled" } });
  }
}


export function* handleRequest(action) {
  //debugger;

  console.log("RoleSaga request", action);
  //console.log(action.payload);
  //yield put({ type: "ITEMS_IS_LOADING", isLoading: true });
  //yield call(updateStatus);
  try {
    switch (action.type) {
      case roleTypes.FETCH_TABLE_REQUEST: {
        //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
        //debugger;
        const fetchTask = yield fork(getRoleTable, action.cname);
        //debugger;
        break;
      }

      case roleTypes.EXCEL_REQUEST: {
        //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
        //debugger;
        const fetchTask = yield fork(exportToExcel, action.payload);
        //debugger;
        break;
      }

      case roleTypes.INSERT_REQUEST: {
        //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
        //debugger;
        const fetchTask = yield fork(insertRoleTable, action.payload);
        //debugger;
        break;
      }

      case roleTypes.UPDATE_REQUEST: {
        //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
        //debugger;
        const fetchTask = yield fork(updateRoleTable, action.payload);
        //debugger;
        break;
      }

      case roleTypes.MAKE_ROW_EDITABLE: {
        //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
        //debugger;
        yield put({
          type: roleTypes.SELECTED_ROWID,
          rowID: action.payload.payload.rowID
        });
        break;
      }

      case roleTypes.DELETE_REQUEST: {
        //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
        //debugger;
        const fetchTask = yield fork(deleteRoleTable, action.roleID);
        //debugger;
        break;
      }

      case roleTypes.CANCEL_REQUEST: {
        //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
        //debugger;

        //const { items } = yield select();
        const state = yield select();
        //debugger;

        const newitems = state.roleleState.items.map((itm, index) => {
          if (
            _.trim(itm.hv_universal_i) !== _.trim(action.payload.payload.rowID)
          ) {
            return itm;
          } else {
            //debugger;
            var newItem = {
              ...itm,
              hv_universal_name: action.payload.payload.value
              //...action.item
            };
            return newItem;
          }
        });

        //debugger;
        yield put({
          type: roleTypes.SELECTED_ROWID,
          rowID: -1
        });

        yield put({
          type: roleTypes.ITEMS,
          items: newitems
        });
        break;
      }

      default: {
        return null;
        break;
      }
    }
  } catch (e) {
    yield put({ type: roleTypes.LOGIN_FAILURE, error: e });
  }
}

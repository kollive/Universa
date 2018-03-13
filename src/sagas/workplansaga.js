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
import { types as wplanTypes } from "../reducers/workplanreducer";
import * as download from "downloadjs";

//import { push } from 'react-router-redux';

const attribApi = {
    exportToExcel(payload) {
        debugger;
        console.log(payload);
        //console.log(userData.password);
        //alert(payload.spName)
        //new Promise((resolve, reject) => {
        //return fetch("http://hvs.selfip.net:4003/ExportToExcel/", {
        return fetch("http://localhost:4003/ExportToExcel/", {
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
                        caption: "WPlan ID",
                        type: "number",
                        width: 5
                    },
                    {
                        caption: "WPlan Cat ID",
                        type: "string",
                        width: 15
                    },
                    {
                        caption: "WPlan Name",
                        type: "string",
                        width: 50
                    },
                    {
                        caption: "WPlan Desc",
                        type: "string",
                        width: 50
                    },
                    {
                        caption: "WPlan Active",
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

    getWPlanTable(PL) {
        debugger;
        //console.log(userData.user);
        //console.log(userData.password);
        //alert("Plan")
        //alert(PL.payload.staffID)
        //new Promise((resolve, reject) => {
        return fetch("http://hvs.selfip.net:4003/ExecSPM/", {
            //return fetch("http://localhost:4003/GetWPlanTable/", {

            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                spName: "sps_getTaskData",
                token: sessionStorage.getItem("token"),
                parms: {
                    staffID: PL.payload.staffID,
                    startDt: PL.payload.startDT,
                    endDt: PL.payload.endDT
                }
            })
        })
            .then(statusHelper)
            .then(response => response.json())
            .catch(error => error);
    },

    insertTaskTable(userData) {
        debugger;
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
                spName: "spi_tunivtasks",
                token: sessionStorage.getItem("token"),
                parms: {
                    staff_id: userData.staff_id,
                    change_order_id: userData.change_order_id,
                    task_start_date: userData.task_start_date,
                    task_end_date: userData.task_end_date,
                    task_desc: userData.task_desc,
                    task_status: userData.task_status
                }
            })
        })
            .then(statusHelper)
            .then(response => response.json())
            .catch(error => error);
    },

    insertHourTable(userData) {
        debugger;
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
                spName: "spi_tunivtaskhours",
                token: sessionStorage.getItem("token"),
                parms: {
                    task_id: userData.task_id,
                    task_date: userData.task_date,
                    num_hours: userData.num_hours,
                    user_id: userData.user_id,                    
                }
            })
        })
            .then(statusHelper)
            .then(response => response.json())
            .catch(error => error);
    },

    chkWPlanTable(role_id) {
        debugger;
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
                spName: "sps_checkWPlanForUser",
                parms: {
                    role_id: role_id
                }
            })
        })
            .then(statusHelper)
            .then(response => response.json())
            .catch(error => error);
    },

    delWPlanTable(roleID) {
        debugger;
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
                spName: "spd_WPlan",
                parms: {
                    roleID: roleID
                }
            })
        })
            .then(statusHelper)
            .then(response => response.json())
            .catch(error => error);
    },

    updWPlanTable(userData) {
        debugger;
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
                spName: "spu_getWPlanScreenFunctions",
                token: sessionStorage.getItem("token"),
                parms: {
                    role_id: userData.role_id,
                    role_name: userData.role_name,
                    role_desc: userData.role_desc,
                    userId: "sv",
                    funcData: userData.functions
                }
            })
        })
            .then(statusHelper)
            .then(response => response.json())
            .catch(error => error);
    }
    //.then(data => data)
};

function statusHelper(response) {
    debugger;
    if (!response.ok) {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
        //throw Error(response);
    }
    return response;
}

function isJSON(str) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}

function* insertTaskTable(userData) {
    try {

        let resultObj = yield call(attribApi.insertTaskTable, userData.payload);

        if (isJSON(resultObj)) {
            resultObj = JSON.parse(resultObj);
            if (resultObj.message != "ok") {
                //debugger;
                yield put({
                    type: wplanTypes.MESSAGE,
                    message: { val: -1, msg: resultObj.result }
                });
            } else {
                //debugger;
                //console.log(JSON.parse(resultObj).result);

                yield put({
                    type: wplanTypes.MESSAGE,
                    message: { val: 1, msg: "Task was added." }
                });
            }
        } else {
            yield put({
                type: wplanTypes.MESSAGE,
                message: { val: -1, msg: resultObj }
            });
        }

    } catch (e) {
    } finally {
    }
}


function* insertHourTable(userData) {
    try {

        let resultObj = yield call(attribApi.insertHourTable, userData.payload);

        if (isJSON(resultObj)) {
            resultObj = JSON.parse(resultObj);
            if (resultObj.message != "ok") {
                //debugger;
                yield put({
                    type: wplanTypes.MESSAGE,
                    message: { val: -1, msg: resultObj.result }
                });
            } else {
                //debugger;
                //console.log(JSON.parse(resultObj).result);
                
                yield put({
                    type: wplanTypes.MESSAGE,
                    message: { val: 1, msg: "data" }
                });
               
            }
        } else {
            yield put({
                type: wplanTypes.MESSAGE,
                message: { val: -1, msg: resultObj }
            });
        }

    } catch (e) {
    } finally {
    }
}

function* updateWPlanTable(userData) {
    try {
        /*
          yield put({
            type: wplanTypes.ITEMS,
            items: []
          });
     
          yield put({
            type: wplanTypes.SELECTED_ROWID,
            rowID: -1
          });
          */

        let resultObj = yield call(attribApi.updWPlanTable, userData.payload);

        if (isJSON(resultObj)) {
            resultObj = JSON.parse(resultObj);
            if (resultObj.message != "ok") {
                //debugger;
                yield put({
                    type: wplanTypes.MESSAGE,
                    message: { val: -1, msg: resultObj.result }
                });
            } else {
                //debugger;
                //console.log(JSON.parse(resultObj).result);
                sessionStorage.setItem("token", resultObj.token);
                if (userData.payload.mode == "A") {
                    yield put({
                        type: wplanTypes.MESSAGE,
                        message: { val: 1, msg: "Permissions were added." }
                    });
                } else {
                    yield put({
                        type: wplanTypes.MESSAGE,
                        message: { val: 1, msg: "Permissions were updated." }
                    });
                }
            }
        } else {
            yield put({
                type: wplanTypes.MESSAGE,
                message: { val: -1, msg: resultObj }
            });
        }

    } catch (e) {
    } finally {
    }
}

function* deleteWPlanTable(roleID) {
    try {
        /*
          yield put({
            type: wplanTypes.ITEMS,
            items: []
          });
     
          yield put({
            type: wplanTypes.SELECTED_ROWID,
            rowID: -1
          });
          */

        const resultObj = yield call(attribApi.delWPlanTable, roleID);

        debugger;
        if (resultObj.response && !resultObj.response.ok) {
            debugger;
            yield put({
                type: wplanTypes.MESSAGE,
                message: resultObj.response.statusText
            });
        } else {
            debugger;
            yield put({
                type: wplanTypes.ITEMS,
                items: []
            });

            yield put({
                type: wplanTypes.SELECTED_ROWID,
                rowID: -1
            });

            const resultObj = yield call(attribApi.getWPlanTable, "");
            debugger;
            if (resultObj.response && !resultObj.response.ok) {
                debugger;
                yield put({
                    type: wplanTypes.MESSAGE,
                    message: resultObj.response.statusText
                });
            } else {
                debugger;
                console.log(JSON.parse(resultObj).result);
                //sessionStorage.setItem("token", JSON.parse(resultObj).token);
                yield put({
                    type: wplanTypes.ITEMS,
                    items: JSON.parse(resultObj).result
                });
            }
            /*
              console.log(JSON.parse(resultObj).result)
              const state = yield select();
              const newitems = state.roleleState.items.filter((itm) => _.trim(itm.hv_universal_i) !== _.trim(userData.payload.rowID));
       
              yield put({
                type: wplanTypes.ITEMS,
                items: newitems
              });
              */
        }
    } catch (e) {
    } finally {
    }
}

function* exportToExcel(payload) {
    debugger;
    try {
        //yield call(delay, 5000)
        //yield put({ type: wplanTypes.LOGIN_REQUEST, isLoading: false })

        const resultObj = yield call(attribApi.exportToExcel, payload);

        debugger;
        if (resultObj.response && !resultObj.response.ok) {
            debugger;
            yield put({
                type: wplanTypes.MESSAGE,
                message: resultObj.response.statusText
            });
        } else {
            debugger;
            //console.log(resultObj);
            download(resultObj, "WPlan.xlsx");
            /*
              console.log(JSON.parse(resultObj).result)
              //sessionStorage.setItem("token", JSON.parse(resultObj).token);
              yield put({
                type: wplanTypes.ITEMS,
                items: JSON.parse(resultObj).result
              });
              */
        }
        //yield put({ type: "LOGIN_STATUS", message: JSON.parse(resultObj).token })
    } catch (e) {
        /*
          debugger;
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
        debugger;
        yield put({ type: wplanTypes.MESSAGE, message: e });
    } finally {
        debugger;
        if (yield cancelled())
            yield put({ type: wplanTypes.MESSAGE, message: "Task Cancelled" });
    }
}

function* getWPlanTable(userData) {
    debugger;
    try {
        //yield call(delay, 5000)
        //yield put({ type: wplanTypes.LOGIN_REQUEST, isLoading: false })
        /*
        yield put({
            type: wplanTypes.ITEMS,
            items: []
        });
        */

        let resultObj = yield call(attribApi.getWPlanTable, userData);

        if (isJSON(resultObj)) {
            resultObj = JSON.parse(resultObj);
            if (resultObj.message != "ok") {
                //debugger;
                yield put({
                    type: wplanTypes.MESSAGE,
                    message: { val: -1, msg: resultObj.result }
                });
            } else {
                debugger;
                //console.log(JSON.parse(resultObj).result);
                sessionStorage.setItem("token", resultObj.token);
                yield put({
                    type: wplanTypes.ITEMS,
                    items: resultObj.result
                });
            }
        } else {
            yield put({
                type: wplanTypes.MESSAGE,
                message: { val: -1, msg: resultObj }
            });
        }
        //yield put({ type: "LOGIN_STATUS", message: JSON.parse(resultObj).token })
    } catch (e) {
        debugger;
        yield put({ type: wplanTypes.MESSAGE, message: { val: -1, msg: e } });
    } finally {
        debugger;
        if (yield cancelled())
            yield put({ type: wplanTypes.MESSAGE, message: { val: -1, msg: "Task Cancelled" } });
    }
}

export function* handleRequest(action) {
    debugger;

    console.log("WPlanSaga request", action);
    //console.log(action.payload);
    //yield put({ type: "ITEMS_IS_LOADING", isLoading: true });
    //yield call(updateStatus);
    try {
        switch (action.type) {
            case wplanTypes.FETCH_TABLE_REQUEST: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(getWPlanTable, action.payload);
                debugger;
                break;
            }

            case wplanTypes.EXCEL_REQUEST: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(exportToExcel, action.payload);
                debugger;
                break;
            }

            case wplanTypes.INSERT_REQUEST: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(insertTaskTable, action.payload);
                debugger;
                break;
            }

            case wplanTypes.INSERTHOUR_REQUEST: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(insertHourTable, action.payload);
                debugger;
                break;
            }


            case wplanTypes.UPDATE_REQUEST: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(updateWPlanTable, action.payload);
                debugger;
                break;
            }

            case wplanTypes.MAKE_ROW_EDITABLE: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                yield put({
                    type: wplanTypes.SELECTED_ROWID,
                    rowID: action.payload.payload.rowID
                });
                break;
            }

            case wplanTypes.DELETE_REQUEST: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(deleteWPlanTable, action.roleID);
                debugger;
                break;
            }

            case wplanTypes.CANCEL_REQUEST: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;

                //const { items } = yield select();
                const state = yield select();
                debugger;

                const newitems = state.roleleState.items.map((itm, index) => {
                    if (
                        _.trim(itm.hv_universal_i) !== _.trim(action.payload.payload.rowID)
                    ) {
                        return itm;
                    } else {
                        debugger;
                        var newItem = {
                            ...itm,
                            hv_universal_name: action.payload.payload.value
                            //...action.item
                        };
                        return newItem;
                    }
                });

                debugger;
                yield put({
                    type: wplanTypes.SELECTED_ROWID,
                    rowID: -1
                });

                yield put({
                    type: wplanTypes.ITEMS,
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
        yield put({ type: wplanTypes.LOGIN_FAILURE, error: e });
    }
}
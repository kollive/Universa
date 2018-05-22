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
import { types as drafteditorTypes } from "../reducers/drafteditorreducer";
import * as download from "downloadjs";
import { API_ROOT } from '../apiconfig';
//import { push } from 'react-router-redux';

const attribApi = {
    exportToExcel(payload) {
        debugger;
        console.log(payload);
        //console.log(userData.password);
        //alert(payload.spName)
        //new Promise((resolve, reject) => {
        //return fetch("http://hvs.selfip.net:4003/ExportToExcel/", {
        const RestAPIURL = API_ROOT.backendAPIGWsvc;
        const requestURL = `${RestAPIURL}ExportToExcel/`;
        return fetch(requestURL, {
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

    getEditorContent(PL) {
        debugger;
        //console.log(userData.user);
        //console.log(userData.password);
        //alert("Plan")
        //alert(PL.payload.staffID)
        //new Promise((resolve, reject) => {
        const RestAPIURL = API_ROOT.backendAPIGWsvc;
        const requestURL = `${RestAPIURL}ExecSPM/`;
        //return fetch(requestURL, {
            //return fetch("http://hvs.selfip.net:4003/ExecSPM/", {
            return fetch("http://localhost:4003/getMongo/", {

            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                //spName: "sps_getStaffTasksMonthly",
                token: sessionStorage.getItem("token"),                
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
        const RestAPIURL = API_ROOT.backendAPIGWsvc;
        const requestURL = `${RestAPIURL}ExecSP/`;
        return fetch(requestURL, {
            //return fetch("http://hvs.selfip.net:4003/ExecSP/", {
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
        const RestAPIURL = API_ROOT.backendAPIGWsvc;
        const requestURL = `${RestAPIURL}ExecSP/`;
        return fetch(requestURL, {
            //return fetch("http://hvs.selfip.net:4003/ExecSP/", {
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
        const RestAPIURL = API_ROOT.backendAPIGWsvc;
        const requestURL = `${RestAPIURL}ExecSP/`;
        return fetch(requestURL, {
            //return fetch("http://hvs.selfip.net:4003/ExecSP/", {
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

    delWPlanTable(userData) {
        debugger;
        //console.log(userData.user);
        //console.log(userData.password);
        //alert( userData.task_id   )
        //new Promise((resolve, reject) => {
        const RestAPIURL = API_ROOT.backendAPIGWsvc;
        const requestURL = `${RestAPIURL}ExecSP/`;
        return fetch(requestURL, {
            //return fetch("http://hvs.selfip.net:4003/ExecSP/", {
            //return fetch("http://hvs.selfip.net:4000/reactlogin/", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                spName: "spd_tunivtasks",
                token: sessionStorage.getItem("token"),
                parms: {
                    task_id: userData.task_id                    
                }
            })
        })
            .then(statusHelper)
            .then(response => response.json())
            .catch(error => error);
    },

    updateMongoContent(userData) {
        debugger;
        //console.log(userData.user);
        //console.log(userData.password);
        //new Promise((resolve, reject) => {
        const RestAPIURL = API_ROOT.backendAPIGWsvc;
        const requestURL = `${RestAPIURL}ExecSP/`;
        //return fetch(requestURL, {
            //return fetch("http://hvs.selfip.net:4003/ExecSP/", {
        return fetch("http://localhost:4003/testMongo/", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                docRawContent: userData.content,
                token: sessionStorage.getItem("token")
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
                    type: drafteditorTypes.MESSAGE,
                    message: { val: -1, msg: resultObj.result }
                });
            } else {
                //debugger;
                //console.log(JSON.parse(resultObj).result);

                yield put({
                    type: drafteditorTypes.MESSAGE,
                    message: { val: 1, msg: "Task was added." }
                });
            }
        } else {
            yield put({
                type: drafteditorTypes.MESSAGE,
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
                    type: drafteditorTypes.MESSAGE,
                    message: { val: -1, msg: resultObj.result }
                });
            } else {
                //debugger;
                //console.log(JSON.parse(resultObj).result);

                yield put({
                    type: drafteditorTypes.MESSAGE,
                    message: { val: 1, msg: "data" }
                });

            }
        } else {
            yield put({
                type: drafteditorTypes.MESSAGE,
                message: { val: -1, msg: resultObj }
            });
        }

    } catch (e) {
    } finally {
    }
}

function* updateMongoContent(userData) {
    try {
      debugger;
       
        let resultObj = yield call(attribApi.updateMongoContent, userData.payload);

        if (isJSON(resultObj)) {
            resultObj = JSON.parse(resultObj);
            if (resultObj.message != "ok") {
                //debugger;
                yield put({
                    type: drafteditorTypes.MESSAGE,
                    message: { val: -1, msg: resultObj.result }
                });
            } else {
                yield put({
                    type: drafteditorTypes.MESSAGE,
                    message: { val: 1, msg: "Updated to Mongo." }
                });
            }
        } else {
            yield put({
                type: drafteditorTypes.MESSAGE,
                message: { val: -1, msg: resultObj }
            });
        }       

    } catch (e) {
    } finally {
    }
}

function* updateEditorContent(userData) {
    try {
      debugger;
        yield put({
            type: drafteditorTypes.CONTENT,
            content: userData.payload.content
        });
        /*
        let resultObj = yield call(attribApi.updateMongoContent, userData.payload);

        if (isJSON(resultObj)) {
            resultObj = JSON.parse(resultObj);
            if (resultObj.message != "ok") {
                //debugger;
                yield put({
                    type: drafteditorTypes.MESSAGE,
                    message: { val: -1, msg: resultObj.result }
                });
            } else {
                yield put({
                    type: drafteditorTypes.MESSAGE,
                    message: { val: 1, msg: "Task was Updated." }
                });
            }
        } else {
            yield put({
                type: drafteditorTypes.MESSAGE,
                message: { val: -1, msg: resultObj }
            });
        }
        */

    } catch (e) {
    } finally {
    }
}

function* deleteEditorContent(userData) {
    try {
        /*
          yield put({
            type: drafteditorTypes.ITEMS,
            items: []
          });

          yield put({
            type: drafteditorTypes.SELECTED_ROWID,
            rowID: -1
          });
          */

        let resultObj = yield call(attribApi.delWPlanTable, userData.payload);

        if (isJSON(resultObj)) {
            resultObj = JSON.parse(resultObj);
            if (resultObj.message != "ok") {
                //debugger;
                yield put({
                    type: drafteditorTypes.MESSAGE,
                    message: { val: -1, msg: resultObj.result }
                });
            } else {
                yield put({
                    type: drafteditorTypes.MESSAGE,
                    message: { val: 1, msg: "data" }
                });
            }
        } else {
            yield put({
                type: drafteditorTypes.MESSAGE,
                message: { val: -1, msg: resultObj }
            });
        }

    } catch (e) {
    } finally {
    }
}

function* exportToExcel(payload) {
    debugger;
    try {
        //yield call(delay, 5000)
        //yield put({ type: drafteditorTypes.LOGIN_REQUEST, isLoading: false })

        const resultObj = yield call(attribApi.exportToExcel, payload);

        debugger;
        if (resultObj.response && !resultObj.response.ok) {
            debugger;
            yield put({
                type: drafteditorTypes.MESSAGE,
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
                type: drafteditorTypes.ITEMS,
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
        yield put({ type: drafteditorTypes.MESSAGE, message: e });
    } finally {
        debugger;
        if (yield cancelled())
            yield put({ type: drafteditorTypes.MESSAGE, message: "Task Cancelled" });
    }
}

function* getEditorContent(userData) {
    debugger;
    try {
        //yield call(delay, 5000)
     
        let resultObj = yield call(attribApi.getEditorContent, userData);
        if (isJSON(resultObj)) {
            resultObj = JSON.parse(resultObj);
            if (resultObj.message != "ok") {
                //debugger;
                yield put({
                    type: drafteditorTypes.MESSAGE,
                    message: { val: -1, msg: resultObj.result }
                });
            } else {
                debugger;
                //alert(resultObj.result.data);                
                //console.log(JSON.parse(resultObj).result);
                //sessionStorage.setItem("token", resultObj.token);
                console.log("saga Data")
                console.log(resultObj.result)
                console.log(resultObj.result.data)
                yield put({
                    type: drafteditorTypes.CONTENT,
                    content: resultObj.result.data
                });
            }
        } else {
            yield put({
                type: drafteditorTypes.MESSAGE,
                message: { val: -1, msg: resultObj }
            });
        }
        
        //yield put({ type: "LOGIN_STATUS", message: JSON.parse(resultObj).token })
    } catch (e) {
        debugger;
        yield put({ type: drafteditorTypes.MESSAGE, message: { val: -1, msg: e } });
    } finally {
        debugger;
        if (yield cancelled())
            yield put({ type: drafteditorTypes.MESSAGE, message: { val: -1, msg: "Task Cancelled" } });
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
            case drafteditorTypes.GETCONTENT_REQUEST: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(getEditorContent, action.payload);
                debugger;
                break;
            }

            case drafteditorTypes.EXCEL_REQUEST: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(exportToExcel, action.payload);
                debugger;
                break;
            }


            case drafteditorTypes.UPDATEMONGO_REQUEST: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(updateMongoContent, action.payload);
                debugger;
                break;
            }

    

            case drafteditorTypes.UPDATECONTENT_REQUEST: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(updateEditorContent, action.payload);
                debugger;
                break;
            }

        
            case drafteditorTypes.DELETE_REQUEST: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(deleteEditorContent, action.payload);
                debugger;
                break;
            }

            default: {
                return null;
                break;
            }
        }
    } catch (e) {
        yield put({ type: drafteditorTypes.LOGIN_FAILURE, error: e });
    }
}

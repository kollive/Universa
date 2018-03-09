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
import { types as commonTypes } from "reducers/commonreducer";
import * as download from "downloadjs";

//import { push } from 'react-router-redux';
/*
const commonApi = {
    setStaffID(payload) {
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

    setUserID(PL) {
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

    setName(userData) {
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
*/
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

function* setName(userData) {
    try {
        //yield call(delay, 5000)
        //yield put({ type: commonTypes.LOGIN_REQUEST, isLoading: false })

        yield put({
            type: commonTypes.NAME,
            hv_name: userData.payload.hv_name
        });
        
    } catch (e) {
        debugger;
        yield put({ type: commonTypes.MESSAGE, message: { val: -1, msg: e } });
    } finally {
        debugger;
        if (yield cancelled())
            yield put({ type: commonTypes.MESSAGE, message: { val: -1, msg: "Task Cancelled" } });
    }
}

function* setStaffID(userData) {
    debugger;
    try {
        //yield call(delay, 5000)
        //yield put({ type: commonTypes.LOGIN_REQUEST, isLoading: false })
        //alert("in Saga")
        //alert(userData.payload.hv_staff_id)
        yield put({
            type: commonTypes.STAFFID,
            hv_staff_id: userData.payload.hv_staff_id
        });
        
    } catch (e) {
        debugger;
        yield put({ type: commonTypes.MESSAGE, message: { val: -1, msg: e } });
    } finally {
        debugger;
        if (yield cancelled())
            yield put({ type: commonTypes.MESSAGE, message: { val: -1, msg: "Task Cancelled" } });
    }
}

function* setUserID(userData) {
    //debugger;
    try {
        //yield call(delay, 5000)
        //yield put({ type: commonTypes.LOGIN_REQUEST, isLoading: false })

        yield put({
            type: commonTypes.USERID,
            hv_user_id: userData.payload.hv_user_id
        });
        
    } catch (e) {
        debugger;
        yield put({ type: commonTypes.MESSAGE, message: { val: -1, msg: e } });
    } finally {
        debugger;
        if (yield cancelled())
            yield put({ type: commonTypes.MESSAGE, message: { val: -1, msg: "Task Cancelled" } });
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
            case commonTypes.SETUSERID : {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(setUserID, action.payload);
                debugger;
                break;
            }

            case commonTypes.SETSTAFFID: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(setStaffID, action.payload);
                debugger;
                break;
            }

            case commonTypes.SETNAME: {
                //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
                debugger;
                const fetchTask = yield fork(setName, action.payload);
                debugger;
                break;
            }
            default: {
                return null;
                break;
            }
        }
    } catch (e) {
        yield put({ type: commonTypes.FAILURE, error: e });
    }
}
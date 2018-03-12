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
  import { types as attribTabTypes } from "../reducers/attribtablereducer";
  
  //import { push } from 'react-router-redux';
  
  const attribApi = {
    
    getAttribTable(userData) {
      debugger;
      //console.log(userData.user);
      //console.log(userData.password);
  
      //new Promise((resolve, reject) => {
      return fetch("http://hvs.selfip.net:4003/GetAttribTable/", {
        //return fetch("http://localhost:4003/GetAttribTable/", {
        
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hv_table_i: userData.hv_table_i,
        })
      })
        .then(statusHelper)
        .then(response => response.json())
        .catch(error => error);
    },


    insAttribTable(userData) {
      debugger;
      //console.log(userData.user);
      //console.log(userData.password);
  
      //new Promise((resolve, reject) => {
      return fetch("http://hvs.selfip.net:4003/insAttribTable/", {
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

    delAttribTable(userData) {
      debugger;
      //console.log(userData.user);
      //console.log(userData.password);
  
      //new Promise((resolve, reject) => {
      return fetch("http://hvs.selfip.net:4003/delAttribTable/", {
        //return fetch("http://hvs.selfip.net:4000/reactlogin/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hv_table_i: userData.tableID,
          hv_universal_i: userData.rowID
        })
      })
        .then(statusHelper)
        .then(response => response.json())
        .catch(error => error);
    },

    updAttribTable(userData) {
      debugger;
      //console.log(userData.user);
      //console.log(userData.password);
  
      //new Promise((resolve, reject) => {
      return fetch("http://hvs.selfip.net:4003/updAttribTable/", {
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
    debugger;
    if (!response.ok) {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
      //throw Error(response);
    }
    return response;
  }


  function* insertAttribTable(userData){
    try{
      
      yield put({
        type: attribTabTypes.ITEMS,
        items: []
      });

      yield put({
        type: attribTabTypes.SELECTED_ROWID,
        rowID: -1
      });
      
      const resultObj = yield call(attribApi.insAttribTable, userData.payload);
      //debugger;
      if (resultObj.response && !resultObj.response.ok) {
        debugger;
        yield put({
          type: attribTabTypes.MESSAGE,
          message: resultObj.response.statusText
        });
      } else {
        //debugger;
        console.log(JSON.parse(resultObj).result)
        const state = yield select();
        //debugger;
        const fetchTask = yield call(getAttribTable, {payload : {hv_table_i: userData.payload.tableID}});
        //debugger;

//debugger;
        /*
        const newitems = state.attribTableState.items;
        newitems.push(
          {
            hv_table_i: userData.payload.tableID,
            hv_universal_name: userData.payload.value,
            hv_universal_i: JSON.parse(resultObj).result[0].hv_universal_i
          }
        )
debugger;
      yield put({
        type: attribTabTypes.SELECTED_ROWID,            
        rowID: -1
      });


        yield put({
          type: attribTabTypes.ITEMS,
          items: newitems
        });
        */

    } }catch (e) {

    }
    finally{

    }
  }

  function* updateAttribTable(userData){
    try{
      /*
      yield put({
        type: attribTabTypes.ITEMS,
        items: []
      });

      yield put({
        type: attribTabTypes.SELECTED_ROWID,
        rowID: -1
      });
      */

      const resultObj = yield call(attribApi.updAttribTable, userData.payload);
  
      debugger;
      if (resultObj.response && !resultObj.response.ok) {
        debugger;
        yield put({
          type: attribTabTypes.MESSAGE,
          message: resultObj.response.statusText
        });
      } else {
        debugger;
        console.log(JSON.parse(resultObj).result)
        const state = yield select();

        const newitems = state.attribTableState.items.map((itm, index) => {
          if (_.trim(itm.hv_universal_i) !== _.trim(userData.payload.rowID)) {
              return itm;
          } else {
            debugger;
              var newItem = {
                  ...itm,
                  hv_universal_name: userData.payload.value,
                  //...action.item
              }
              return newItem;
          }
      })

      yield put({
        type: attribTabTypes.SELECTED_ROWID,            
        rowID: -1
      });


        yield put({
          type: attribTabTypes.ITEMS,
          items: newitems
        });

    } }catch (e) {

    }
    finally{

    }
  }

  function* deleteAttribTable(userData){
    try{
      /*
      yield put({
        type: attribTabTypes.ITEMS,
        items: []
      });

      yield put({
        type: attribTabTypes.SELECTED_ROWID,
        rowID: -1
      });
      */

      const resultObj = yield call(attribApi.delAttribTable, userData.payload);
  
      debugger;
      if (resultObj.response && !resultObj.response.ok) {
        debugger;
        yield put({
          type: attribTabTypes.MESSAGE,
          message: resultObj.response.statusText
        });
      } else {
        debugger;
        console.log(JSON.parse(resultObj).result)
        const state = yield select();
        const newitems = state.attribTableState.items.filter((itm) => _.trim(itm.hv_universal_i) !== _.trim(userData.payload.rowID));

        yield put({
          type: attribTabTypes.ITEMS,
          items: newitems
        });

    } }catch (e) {

    }
    finally{

    }
  }
  
  function* getAttribTable(userData) {
    debugger;
    try {
      //yield call(delay, 5000)
      //yield put({ type: attribTabTypes.LOGIN_REQUEST, isLoading: false })

      yield put({
        type: attribTabTypes.ITEMS,
        items: []
      });

      yield put({
        type: attribTabTypes.SELECTED_ROWID,
        rowID: -1
      });

      const resultObj = yield call(attribApi.getAttribTable, userData.payload);
  
      debugger;
      if (resultObj.response && !resultObj.response.ok) {
        debugger;
        yield put({
          type: attribTabTypes.MESSAGE,
          message: resultObj.response.statusText
        });
      } else {
        debugger;
        console.log(JSON.parse(resultObj).result)
        //sessionStorage.setItem("token", JSON.parse(resultObj).token);
        yield put({
          type: attribTabTypes.ITEMS,
          items: JSON.parse(resultObj).result
        });
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
      yield put({ type: attribTabTypes.MESSAGE, message: e });
    } finally {
      debugger;
      if (yield cancelled())
        yield put({ type: attribTabTypes.MESSAGE, message: "Task Cancelled" });
    }
  }
  
  
  export function* handleRequest(action) {
    debugger;
    console.log("authSaga request", action);
    console.log(action.payload);
    //yield put({ type: "ITEMS_IS_LOADING", isLoading: true });
    //yield call(updateStatus);
    try {
      switch (action.type) {
      
        case attribTabTypes.FETCH_TABLE_REQUEST: {
          //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
          debugger;
          const fetchTask = yield fork(getAttribTable, action.payload);
          debugger;
          break;
        }

        case attribTabTypes.INSERT_REQUEST: {
          //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
          debugger;
          const fetchTask = yield fork(insertAttribTable, action.payload);
          debugger;
          break;
        }

        case attribTabTypes.UPDATE_REQUEST: {
          //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
          debugger;
          const fetchTask = yield fork(updateAttribTable, action.payload);
          debugger;
          break;
        }

        case attribTabTypes.MAKE_ROW_EDITABLE: {
          //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
          debugger;
          yield put({
            type: attribTabTypes.SELECTED_ROWID,            
            rowID: action.payload.payload.rowID
          });
          break;
        }

        case attribTabTypes.DELETE_REQUEST: {
          //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
          debugger;
          const fetchTask = yield fork(deleteAttribTable, action.payload);
          debugger;
          break;
        }

        case attribTabTypes.CANCEL_REQUEST: {
          //yield all([put({ type: "LOGIN_STATUS", message: '' }), put({ type: "ITEMS_IS_LOADING", isLoading: true })])
          debugger;

          //const { items } = yield select();
          const state = yield select();
          debugger;

          const newitems = state.attribTableState.items.map((itm, index) => {
            if (_.trim(itm.hv_universal_i) !== _.trim(action.payload.payload.rowID)) {
                return itm;
            } else {
              debugger;
                var newItem = {
                    ...itm,
                    hv_universal_name: action.payload.payload.value,
                    //...action.item
                }
                return newItem;
            }
        })

        debugger;
          yield put({
            type: attribTabTypes.SELECTED_ROWID,            
            rowID: -1
          });

          yield put({
            type: attribTabTypes.ITEMS,
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
      yield put({ type: attribTabTypes.LOGIN_FAILURE, error: e });
    }
  }
  
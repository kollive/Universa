
import { all, actionChannel, call, put, take, takeEvery, takeLatest, select, cancel, cancelled, fork, race, apply } from 'redux-saga/effects'
import { delay, buffers, eventChannel, END } from 'redux-saga'
import * as _ from 'lodash'
import { types as authTypes } from './../reducers/authreducer'
import { types as attribTypes } from './../reducers/attribreducer'
import { types as attribTabTypes } from './../reducers/attribtablereducer'
import { types as showDataTypes } from './../reducers/showdatareducer'
import { types as forgotPWDTypes } from './../reducers/forgotpwdreducer'
import { types as changePWDTypes } from './../reducers/changepwdreducer'
import { types as headerTypes } from './../reducers/cdheaderreducer'
import { types as cadetSearchTypes } from './../reducers/cadetsearchreducer'
import { types as cadetDetailsTypes } from './../reducers/cadetdetailsreducer'
import { types as CadetInlineTypes } from "reducers/cadetinlinesearchreducer";
import {types as ManageUserTypes} from "reducers/Users/manageusersreducer";
import { types as mentorTypes } from "./../reducers/mentorreducer";
import { types as budgetTypes } from "./../reducers/budgetreducer";
import { types as purchaseTypes } from "./../reducers/purchasereducer";
import { types as BAPTypes } from "./../reducers/bapreducer";
import { types as approvalTypes } from "./../reducers/approvalreducer";
import { types as scheduleTypes } from "./../reducers/schedulereducer";
import { types as BASTypes } from "./../reducers/basreducer";
import { types as RoleTypes } from "./../reducers/rolereducer";
import { types as usersListType } from "./../reducers/usersList_reducer";
import { types as aeroleTypes } from "./../reducers/aerolereducer";
import { types as timeoutTypes } from "./../reducers/timeoutreducer";
import {types as ManageStaffTypes} from "reducers/Staff/managestaffreducer";
import {types as StaffListTypes} from "reducers/Staff/stafflistreducer";
import  {types as TimehseetTypes} from 'reducers/Timesheet/timesheetreducer';
import {types as WorkPlanTypes} from "reducers/workplanreducer";
import {types as CommonTypes} from "reducers/commonreducer";


import  * as authSagas  from './authsaga'
import  * as attribSagas  from './attribsaga'
import  * as attribTableSagas  from './attribtablesaga'
import  * as showDataSagas  from './showdatasaga'
import  * as forgotPWDSagas  from './forgotpwdsaga'
import  * as changePWDSagas  from './changepwdsaga'
import  * as headersaga  from './cdheadersaga'
import  * as cadetSearchSaga  from './cadetsearchsaga'
import  * as cadetDetailsSaga  from './cadetsearchsaga'
import  * as cadetInlineSaga  from './cadetinlinesearchsaga'
import  * as mentorSaga  from './mentorsaga'
import  * as budgetSaga  from './budgetsaga'
import  * as purchaseSaga  from './purchasesaga'
import  * as BAPSaga  from './bapsaga'
import  * as approvalSaga  from './approvalsaga'
import  * as scheduleSaga  from './schedulesaga'
import  * as BASSaga  from './bassaga'
import * as ManageUserSaga from './Users/manageusersaga.js';
import  * as usersListSaga  from './usersList_saga';
import  * as RoleSagas  from './rolesaga';
import  * as aeroleSagas  from './aerolesaga';
import  * as timeoutSagas  from './timeoutsaga';
import * as ManageStaffSaga from './Staff/managestaffsaga.js';
import * as StaffListSaga from './Staff/stafflistsaga.js';

import * as TimesheetSaga from './Timesheet/timesheetsaga';

import * as WorkPlanSaga from './workplansaga.js';
import * as CommonSaga from './commonsaga.js';


export default function* rootSaga () {
  try {
    //debugger
    //yield watchOnPings()
    yield all( [
        takeLatest([authTypes.SIGNUP_REQUEST,authTypes.LOGIN_REQUEST,authTypes.PASSWORD_RESET_REQUEST,authTypes.LOGOUT], authSagas.handleRequest),
        takeLatest([attribTypes.FETCH_TABLES_REQUEST,attribTypes.INSERT_REQUEST,attribTypes.DELETE_REQUEST,attribTypes.UPDATE_REQUEST], attribSagas.handleRequest),
        takeLatest([attribTabTypes.FETCH_TABLE_REQUEST,attribTabTypes.CANCEL_REQUEST,attribTabTypes.MAKE_ROW_EDITABLE,attribTabTypes.INSERT_REQUEST,attribTabTypes.DELETE_REQUEST,attribTabTypes.UPDATE_REQUEST], attribTableSagas.handleRequest),
        takeLatest([showDataTypes.FETCH_TABLE_REQUEST], showDataSagas.handleRequest),
        takeLatest([forgotPWDTypes.CHECK_EMAIL_REQUEST], forgotPWDSagas.handleRequest),
        takeLatest([changePWDTypes.UPD_PWD_REQUEST,changePWDTypes.CHK_TOKEN_REQUEST], changePWDSagas.handleRequest),
        takeLatest([headerTypes.FETCH_REQUEST], headersaga.handleRequest),
        takeLatest([cadetSearchTypes.FETCH_TABLES_REQUEST], cadetSearchSaga.handleRequest),
        takeLatest([cadetDetailsTypes.FETCH_TABLES_REQUEST], cadetDetailsSaga.handleRequest),
        takeLatest([CadetInlineTypes.FETCH_TABLES_REQUEST], cadetInlineSaga.handleRequest),
        takeLatest([mentorTypes.FETCH_TABLES_REQUEST], mentorSaga.handleRequest),
        takeLatest([budgetTypes.FETCH_TABLES_REQUEST], budgetSaga.handleRequest),
        takeLatest([purchaseTypes.FETCH_TABLES_REQUEST], purchaseSaga.handleRequest),
        takeLatest([BAPTypes.FETCH_TABLES_REQUEST], BAPSaga.handleRequest),
        takeLatest([approvalTypes.FETCH_TABLES_REQUEST], approvalSaga.handleRequest),
        takeLatest([scheduleTypes.FETCH_TABLES_REQUEST], scheduleSaga.handleRequest),
        takeLatest([usersListType.FETCH_REQUEST,usersListType.DELETE_REQUEST], usersListSaga.handleRequest),
        takeLatest([BASTypes.FETCH_TABLES_REQUEST], BASSaga.handleRequest),
        takeLatest([ManageUserTypes.INSERT_REQUEST,ManageUserTypes.FETCH_USER_REQUEST,ManageUserTypes.UPDATE_USER_REQUEST], ManageUserSaga.handleRequest),
        takeLatest([RoleTypes.FETCH_TABLE_REQUEST,RoleTypes.EXCEL_REQUEST,RoleTypes.CANCEL_REQUEST,RoleTypes.MAKE_ROW_EDITABLE,RoleTypes.INSERT_REQUEST,RoleTypes.DELETE_REQUEST,RoleTypes.UPDATE_REQUEST], RoleSagas.handleRequest),
        takeLatest([aeroleTypes.FETCH_TABLE_REQUEST,aeroleTypes.EXCEL_REQUEST,aeroleTypes.CANCEL_REQUEST,aeroleTypes.MAKE_ROW_EDITABLE,aeroleTypes.INSERT_REQUEST,aeroleTypes.DELETE_REQUEST,aeroleTypes.UPDATE_REQUEST], aeroleSagas.handleRequest),
        takeLatest([timeoutTypes.SIGNUP_REQUEST,timeoutTypes.LOGIN_REQUEST,timeoutTypes.PASSWORD_RESET_REQUEST,timeoutTypes.LOGOUT], timeoutSagas.handleRequest),
        takeLatest([StaffListTypes.FETCH_REQUEST,StaffListTypes.DELETE_REQUEST], StaffListSaga.handleRequest),
        takeLatest([ManageStaffTypes.INSERT_REQUEST,ManageStaffTypes.FETCH_STAFF_REQUEST,ManageStaffTypes.FETCH_STAFF_RESOURCE_DETAILS,ManageStaffTypes.UPDATE_STAFF_REQUEST], ManageStaffSaga.handleRequest),
        takeLatest([TimehseetTypes.INSERT_TIME_REQUEST,TimehseetTypes.FETCH_TIME_REQUEST,TimehseetTypes.UPDATE_TIME_REQUEST,ManageStaffTypes.UPDATE_STAFF_REQUEST], TimesheetSaga.handleRequest),
        takeLatest([WorkPlanTypes.FETCH_TABLE_REQUEST,WorkPlanTypes.EXCEL_REQUEST,WorkPlanTypes.CANCEL_REQUEST,WorkPlanTypes.INSERTHOUR_REQUEST,WorkPlanTypes.INSERT_REQUEST,WorkPlanTypes.DELETE_REQUEST,WorkPlanTypes.UPDATE_REQUEST], WorkPlanSaga.handleRequest),

        takeLatest([CommonTypes.SETNAME,CommonTypes.SETSTAFFID,CommonTypes.SETUSERID], CommonSaga.handleRequest),
        ]);

    //throw e;
}
catch(e){
  console.log(e)

}
  /*
  yield [
    takeEvery(authTypes.AUTO_LOGIN, authSagas.autoLogin),
    takeEvery(authTypes.SIGNUP_REQUEST, authSagas.signup),
    takeEvery(authTypes.LOGIN_REQUEST, authSagas.login),
    takeEvery(authTypes.PASSWORD_RESET_REQUEST, authSagas.resetPassword),
    takeEvery(authTypes.LOGOUT, authSagas.logout)

    //takeEvery(productTypes.GET_PRODUCTS_REQUEST, productSagas.getTickets)
  ]
  */
}

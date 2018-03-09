import { combineReducers } from 'redux';
import authState from './authreducer';
import attribState from './attribreducer';
import attribTableState from './attribtablereducer';
import showDataState from './showdatareducer';
import forgotPWDState from './forgotpwdreducer';
import changePWDState from './changepwdreducer';
import headerState from './cdheaderreducer';
import cadetSearchState from './cadetsearchreducer';
import cadetDetailsState from './cadetdetailsreducer';
import notificationState from './notificationsreducer';
import CadetInlineSearchState from './cadetinlinesearchreducer';
import mentorState from './mentorreducer';
import roleState from './rolereducer';
import BudgetState from './budgetreducer';
import PurchaseState from './purchasereducer';
import BAPState from './bapreducer';
import ApprovalState from './approvalreducer';
import ScheduleState from './schedulereducer';
import BASState from './basreducer';
import ManageUserState from './Users/manageusersreducer';
import usersListState from './usersList_reducer';
import aeroleState from './aerolereducer';
import timeoutState from './timeoutreducer';
import ManageStaffState from './Staff/managestaffreducer';
import StaffListState from './Staff/stafflistreducer'
import TimesheetState from './Timesheet/timesheetreducer';
import WorkPlanState from './workplanreducer';
import CommonState from './commonreducer';

export default combineReducers({
   authState,
   attribState,
   attribTableState,
   showDataState,
   forgotPWDState,
   changePWDState,
   headerState,
   cadetSearchState,
   cadetDetailsState,
   notificationState,
   CadetInlineSearchState,
   mentorState,
   roleState,
   BudgetState,
   PurchaseState,
   BAPState,
   ApprovalState,
   ScheduleState,
   BASState,
   ManageUserState,
   usersListState,
   aeroleState,
   timeoutState,
   StaffListState,
   ManageStaffState,
   TimesheetState,
   WorkPlanState,
   CommonState
});

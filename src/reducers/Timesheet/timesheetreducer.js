export const types = {
    INSERT_TIME_REQUEST: "TIMESHEET/INSERT_TIME_REQUEST",
    FETCH_TIME_REQUEST : "TIMESHEET/FETCH_TIME_REQUEST",
    UPDATE_TIME_REQUEST : "TIMESHEET/UPDATE_TIME_REQUEST",
    ITEMS : "TIMESHEET/ITEMS",
    MESSAGE : "TIMESHEET/MESSAGE",
  };
  export const permissions = [
     {function_id : 65, action : 'ADDEDIT'},
    {function_id :  66, action : "DELETE"}  ,     
     {function_id : 67 ,action: 'VIEW'} ,
  ]
  export const initialState = {
    error: null,
    message: { val: 0, statusMsg: "" },
    items:[]
  };
  export default(state=initialState,action) => {
    switch (action.type) { 
      case types.MESSAGE:  
        return { ...state, message: action.message };
      case types.ITEMS:
        return { ...state, items: action.items };
      default:
        return state;
    }
  }

  export const actions={
    insertTimesheet: (payload) => ({ type: types.INSERT_TIME_REQUEST, payload }),
    getTimesheet: (payload) => ({ type: types.FETCH_STAFF_REQUEST, payload }),
    updateTimesheet : (payload)  => ({type:types.UPDATE_TIME_REQUEST,payload}),
    resetMessage: (message) => ({
        type: message.type,
        message : message.message
      }),
      clearItemsState: (message) => ({
        type: message.type,
        items : message.items
      }),
  }
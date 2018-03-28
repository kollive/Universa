export const types = {
    INSERT_TASK_REQUEST: "TASK/INSERT_TASK_REQUEST",
    FETCH_TASK_REQUEST : "TASK/FETCH_TASK_REQUEST",
    UPDATE_TASK_REQUEST : "TASK/UPDATE_TASK_REQUEST",
    GET_SCREENDATA_REQUEST : "TASK/GET_SCREENDATA_REQUEST",
    ITEMS: "CO/ITEMS",
    MESSAGE: "CO/MESSAGE"
  };

  export const permissions = [
     {function_id : 73, action : 'ADDEDIT'},
     {function_id : 74 ,action: 'DELETE'} ,
    {function_id : 75, action : "VIEW"}
  ]
  export const initialState = {
    error: null,
    message: { val: 0, statusMsg: "" },
    user : {},
    items:[]
  };

  export default (state = initialState, action) => {
    // debugger;
    switch (action.type) {
      case types.MESSAGE:
        return { ...state, message: action.message };
      case types.ITEMS:{
         return { ...state, items: action.items };
      }
      default:
        return state;
    }
  };

  export const actions = {
    inserTaskDetails: task => ({ type: types.INSERT_TASK_REQUEST, task }),
    getTaskDetails: task => ({ type: types.FETCH_TASK_REQUEST, task }),
    updateTaskDetails : task => ({type:types.UPDATE_TASK_REQUEST,task}),
    getTaskScreenDetails : (payload)  => ({type:types.GET_SCREENDATA_REQUEST,payload}),
    resetMessage: (message) => ({
        type: message.type,
        message : message.message
      }),
      clearItemsState: (message) => ({
        type: message.type,
        items : message.items
      }),
  };

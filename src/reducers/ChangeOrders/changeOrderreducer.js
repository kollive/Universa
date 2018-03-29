export const types = {
    INSERT_CHANGEORDER_REQUEST: "CO/INSERT_REQUEST",
    FETCH_CHANGEORDER_REQUEST : "CO/FETCH_CHANGEORDER_REQUEST",
    UPDATE_CHANGEORDER_REQUEST : "CO/UPDATE_CHANGEORDER_REQUEST",
    GET_SCREENDATA_REQUEST : "CO/GET_SCREENDATA_REQUEST",
    ITEMS: "CO/ITEMS",
    MESSAGE: "CO/MESSAGE"
  };

  export const permissions = [
     {function_id : 70, action : 'ADDEDITCO'},
     {function_id : 71 ,action: 'DELETECO'} ,
    {function_id : 72 , action : "VIEWCO"}
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
    inserChangeOrderDetails: order => ({ type: types.INSERT_CHANGEORDER_REQUEST, order }),
    getChangeOrderDetails: order => ({ type: types.FETCH_CHANGEORDER_REQUEST, order }),
    updateChangeOrderDetails : order => ({type:types.UPDATE_CHANGEORDER_REQUEST,order}),
    getCOScreenDetails : (payload)  => ({type:types.GET_SCREENDATA_REQUEST,payload}),
    resetMessage: (message) => ({
        type: message.type,
        message : message.message
      }),
      clearItemsState: (message) => ({
        type: message.type,
        items : message.items
      }),
  };

export const types = {
    FETCH_LIST_REQUEST: "COLIST/FETCH_LIST_REQUEST",
    DELETE_LIST_REQUEST: "COLIST/FETCH_LIST_REQUEST",
    ITEMS: "COLIST/ITEMS",
    RESOURCEITEMS: "COLIST/RESOURCEITEMS",
    MESSAGE: "COLIST/MESSAGE",
    TOKEN: "COLIST/TOKEN",
  };

  export const permissions = [
    {function_id : 70, function_name : 'ADDEDIT'},
    {function_id : 71 ,function_name: 'DELETE'} ,
   {function_id : 72 , function_name : "VIEW"}
 ]
  //};
  // Reducer
  const initialState = {
    items: [],
    loading: false,
    error: false,
    message: {val:0,msg:""},
    resitems:[]
  };
  export default  (state = initialState, action) => {
    switch (action.type) {
        case types.ITEMS:
          return { ...state, items: action.items };
          case types.MESSAGE:
            return { ...state, message: action.message };
           case types.RESOURCEITEMS:
          return { ...state, resitems: action.resitems };
            
      default:
        return state;
    }
  };

  // Action Creators
  export const actions = {
    getCOList: (payload) => ({ type: types.FETCH_LIST_REQUEST, payload}),
    deleteChangeOrder: (payload) => ({ type: types.DELETE_LIST_REQUEST, payload}),

    resetMessage: (message) => ({
        type: message.type,
        message : message.message
      })
  };

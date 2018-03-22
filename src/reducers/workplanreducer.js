export const types = {
    FETCH_TABLE_REQUEST: "WPLAN/FETCH_REQUEST",
    ITEMS: "WPLAN/ITEMS",
    DELETE_REQUEST: "WPLAN/DELETE_REQUEST",
    INSERT_REQUEST: "WPLAN/INSERT_REQUEST",
    UPDATE_REQUEST: "WPLAN/UPDATE_REQUEST",
    INSERTHOUR_REQUEST: "WPLAN/INSERTHOUR_REQUEST",
    CANCEL_REQUEST: "WPLAN/CANCEL_REQUEST",
    MESSAGE: "WPLAN/MESSAGE",
    TOKEN: "WPLAN/TOKEN",
    SELECTED_ROWID: "WPLAN/ROW_ID",
    MAKE_ROW_EDITABLE: "WPLAN/ROW_EDITABLE",
    CHECKROLE_REQUEST: "WPLAN/CHECK_REQUEST",
    EXCEL_REQUEST: "WPLAN/EXCEL_REQUEST"
  };
  
  export const initialState = {
    isLoading: false,
    hasErrored: false,
    items: [],
    message: { val: 0, msg: "" },
    token: "",
    rowID: -1
  };
  
  //export function authState (state = initialState, action) {
  export default (state = initialState, action) => {
    //debugger;
  
    switch (action.type) {
      case types.ITEMS:
        return { ...state, items: action.items };
  
      case types.SELECTED_ROWID:
        return { ...state, rowID: action.rowID };
  
      case types.MESSAGE:
        return { ...state, message: action.message };
  
      case types.TOKEN:
        return { ...state, token: action.token };
  
      case types.FETCH_DATA_SUCCESS:
      case types.DATA_SUCCESS:
        return { ...state, isLoading: false, hasErrored: false };
  
      case types.FETCH_DATA_FAILURE:
      case types.DATA_FAILURE:
        return { ...state, isLoading: false, hasErrored: true };
  
      default:
        return state;
    }
  };
  
  export const actions = {
    getWorkPlans: payload => ({ type: types.FETCH_TABLE_REQUEST, payload }),
    makeRowEditable: payload => ({ type: types.MAKE_ROW_EDITABLE, payload }),
    insertTaskTable: payload => ({ type: types.INSERT_REQUEST, payload }),
    insertHourTable: payload => ({ type: types.INSERTHOUR_REQUEST, payload }),
    updateTaskTable: payload => ({ type: types.UPDATE_REQUEST, payload }),  
    //updateStoreWorkplanTable: payload => ({ type: types.UPDATE_STORE_REQUEST, payload }),
    deleteTaskTable: payload => ({
      type: types.DELETE_REQUEST,
      payload
    }),
    cancelWorkplanTable: payload => ({ type: types.CANCEL_REQUEST, payload }),
    exportToExcel: payload => ({ type: types.EXCEL_REQUEST, payload }),
    resetMessage: payload => ({
      type: payload.type,
      message: payload.message
    })
  };
  
  /*
      export const getProduct = (state) => state.product.products
      export const getProductById = (state, id) => find(state.product.products, id)
      export const getProductSortedByName = (state) => sortBy(state.product.products, 'name')
      export const getExpiredProducts = (state) => filter(state.product.products, { isExpired: true })
      */
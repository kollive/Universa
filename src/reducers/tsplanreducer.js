export const types = {
    FETCH_TABLE_REQUEST: "TSPLAN/FETCH_REQUEST",
    ITEMS: "TSPLAN/ITEMS",
    DELETE_REQUEST: "TSPLAN/DELETE_REQUEST",
    INSERT_REQUEST: "TSPLAN/INSERT_REQUEST",
    UPDATE_REQUEST: "TSPLAN/UPDATE_REQUEST",
    INSERTHOUR_REQUEST: "TSPLAN/INSERTHOUR_REQUEST",
    CANCEL_REQUEST: "TSPLAN/CANCEL_REQUEST",
    MESSAGE: "TSPLAN/MESSAGE",
    TOKEN: "TSPLAN/TOKEN",
    SELECTED_ROWID: "TSPLAN/ROW_ID",
    MAKE_ROW_EDITABLE: "TSPLAN/ROW_EDITABLE",
    CHECKROLE_REQUEST: "TSPLAN/CHECK_REQUEST",
    EXCEL_REQUEST: "TSPLAN/EXCEL_REQUEST"
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
    getMonthlyTS: payload => ({ type: types.FETCH_TABLE_REQUEST, payload }),    
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
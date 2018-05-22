export const types = {
    GETCONTENT_REQUEST: "EDITOR/FETCH_REQUEST",
    CONTENT: "EDITOR/CONTENT",
    DELETE_REQUEST: "EDITOR/DELETE_REQUEST",
    INSERT_REQUEST: "EDITOR/INSERT_REQUEST",
    UPDATECONTENT_REQUEST: "EDITOR/UPDATECONTENT_REQUEST",
    UPDATEMONGO_REQUEST: "EDITOR/UPDATEMONGO_REQUEST",
    CANCEL_REQUEST: "EDITOR/CANCEL_REQUEST",
    MESSAGE: "EDITOR/MESSAGE",
    TOKEN: "EDITOR/TOKEN",
    EXCEL_REQUEST: "EDITOR/EXCEL_REQUEST"
  };
  
  export const initialState = {
    isLoading: false,
    hasErrored: false,
    content: null,
    message: { val: 0, msg: "" },
    token: ""
  };
  
  //export function authState (state = initialState, action) {
  export default (state = initialState, action) => {
    //debugger;
  
    switch (action.type) {
      case types.CONTENT:
        return { ...state, content: action.content };

      case types.MESSAGE:
        return { ...state, message: action.message };
  
      case types.TOKEN:
        return { ...state, token: action.token };
  
      default:
        return state;
    }
  };
  
  export const actions = {
    getEditorContent: payload => ({ type: types.GETCONTENT_REQUEST, payload }), 
    setEditorContent: payload => ({ type: types.UPDATECONTENT_REQUEST, payload }),   
    updateMongo: payload => ({ type: types.UPDATEMONGO_REQUEST, payload }),    
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
export const types = {
FETCH_REQUEST: "HEADER/FETCH_REQUEST",
ITEMS: "HEADER/ITEMS",
GET_STAFF_DETAILS : "TIMESHEET/GET_STAFF_DETAILS",
};

export const initialState = {
  error: null,
  items: [
    {
      user:"sv",
      logo:""
    }
  ],
  MESSAGE:''
};

//export function authState (state = initialState, action) {
export default (state = initialState, action) => {
 // debugger;
  switch (action.type) {
    case types.ITEMS:
      return { ...state, items: action.items };
    case types.FETCH_REQUEST:
    {
     // debugger
      return { ...state,  error: null };
      
    }
    default:
      return state;
  }
};
  

export const actions = {
   renderHeader: (loadheader) => ({ type: types.FETCH_REQUEST, loadheader }),
  getStaffDetails : (payload)  => ({type:types.GET_STAFF_DETAILS,payload}),

};


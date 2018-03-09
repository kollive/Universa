
export const types = {
    MESSAGE: "COMMON/MESSAGE",
    TOKEN: "COMMON/TOKEN",
    USERID: "COMMON/USERID",
    STAFFID: "COMMON/STAFFID",
    NAME: "COMMON/NAME",
    SETUSERID: "COMMON/SETUSERID_REQUEST",
    SETSTAFFID: "COMMON/SETSTAFFID_REQUEST",
    SETNAME: "COMMON/SETNAME_REQUEST"
};

export const initialState = {
    isLoading: false,
    hasErrored: false,
    items: [],
    message: { val: 0, msg: "" },
    token: "",
    hv_user_id: "",
    hv_staff_id: "",
    hv_name: ""
};

//export function authState (state = initialState, action) {
export default (state = initialState, action) => {
    //debugger;
    switch (action.type) {

        case types.USERID:
            return { ...state, hv_user_id: action.hv_user_id };

        case types.STAFFID:
            return { ...state, hv_staff_id: action.hv_staff_id};

        case types.NAME:
            return { ...state, hv_name: action.hv_name };

        case types.MESSAGE:
            return { ...state, message: action.message };

        case types.TOKEN:
            return { ...state, token: action.token };

        default:
            return state;
    }
};

export const actions = {

    setUserID: payload => ({ type: types.SETUSERID, payload }),
    setStaffID: payload => ({ type: types.SETSTAFFID, payload }),
    setName: payload => ({ type: types.SETNAME, payload }),

    resetMessage: payload => ({
      type: payload.type,
      message: payload.message
    })
  };
  

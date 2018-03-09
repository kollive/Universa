export const types = {
  AUTO_LOGIN: "AUTH/AUTO_LOGIN",
  SIGNUP_REQUEST: "AUTH/SIGNUP_REQUEST",
  SIGNUP_SUCCESS: "AUTH/SIGNUP_SUCCESS",
  SIGNUP_FAILURE: "AUTH/SIGNUP_FAILURE",
  LOGIN_REQUEST: "AUTH/LOGIN_REQUEST",
  LOGIN_SUCCESS: "AUTH/LOGIN_SUCCESS",
  LOGIN_FAILURE: "AUTH/LOGIN_FAILURE",
  LOGOUT: "AUTH/LOGOUT",
  ITEMS: "AUTH/ITEMS",
  MESSAGE: "AUTH/MESSAGE",
  STAFFID: "AUTH/STAFFID",
  NAME: "AUTH/NAME",
  TOKEN: "AUTH/TOKEN"
};

export const initialState = {
  name: "",
  isLoading: false,
  error: null,
  items: [],
  message: { val: 0, msg: "" },
  token: "",
  hv_staff_id : ""
};

//export function authState (state = initialState, action) {
export default (state = initialState, action) => {
  //debugger;
  switch (action.type) {
    case types.ITEMS:
      return { ...state, items: action.items };

    case types.MESSAGE:
      return { ...state, message: action.message };

    case types.NAME:
      return { ...state, name: action.name };

      case types.STAFFID:
      return { ...state, hv_staff_id: action.hv_staff_id };

    case types.TOKEN:
      return { ...state, token: action.token };

    case types.SIGNUP_REQUEST:
    case types.LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null };

    case types.SIGNUP_SUCCESS:
    case types.LOGIN_SUCCESS:
      return { ...state, isLoading: false, user: action.user };

    case types.SIGNUP_FAILURE:
    case types.LOGIN_FAILURE:
      return { ...state, isLoading: false, error: action.error };

    case types.LOGOUT:
      return { ...state, user: null };

    default:
      return state;
  }
};

export const actions = {
  signup: (email, password) => ({
    type: types.SIGNUP_REQUEST,
    email,
    password
  }),
  login: payload => ({ type: types.LOGIN_REQUEST, payload }),
  logout: () => ({ type: types.LOGOUT }),
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

/*
  export function itemsHasErrored(state = false, action) {
    switch (action.type) {
        case 'ITEMS_HAS_ERRORED':
            return action.hasErrored;

        default:
            return state;
    }
}

export function itemsIsLoading(state = false, action) {
    switch (action.type) {
        case 'ITEMS_IS_LOADING':
            return action.isLoading;

        default:
            return state;
    }
}

export function items(state = [], action) {
    switch (action.type) {
        case 'ITEMS_FETCH_DATA_SUCCESS':
            return action.items;

        default:
            return state;
    }
}


export function ping(state = "", action) {
    //debugger;
    switch (action.type) {
        case 'INCOMING_PONG_PAYLOAD':
            return action.payload;
        default:
            return state;
    }
}


export function message(state = [], action) {
    //debugger;
    switch (action.type) {
        case 'LOGIN_STATUS':
            return action.message;
        default:
            return state;
    }
}
  */

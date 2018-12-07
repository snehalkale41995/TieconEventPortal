import * as actionTypes from "../actions/actionTypes";

const initialState = {
  email: "",
  loginError: false,
  forgetPasswordMsg: "",
  loginErrorMsg: ""
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_USER:
      return {
        ...state,
        email: action.email,
        loginError: false,
        forgetPasswordMsg: "",
        loginErrorMsg: ""
      };
    case actionTypes.LOGOUT_USER:
      return {
        ...state,
        email: "",
        forgetPasswordMsg: "",
        loginErrorMsg: ""
      };
    case actionTypes.LOGIN_ERROR:
      return {
        ...state,
        loginError: true,
        forgetPasswordMsg: "",
        loginErrorMsg: action.loginErrorMsg
      };
    case actionTypes.FORGET_PASSWORD:
      return {
        ...state,
        forgetPasswordMsg: action.forgetPasswordMsg,
        loginErrorMsg: ""
      };
    default:
      return state;
  }
};
export default authReducer;

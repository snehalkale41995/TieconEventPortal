import * as actionTypes from "../actions/actionTypes";

const initialState = {
  error: "",
  attendance: []
};
const attendanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOG_ATTENDANCE_ERROR:
      return {
        ...state,
        error: action.error
      };
    case actionTypes.STORE_ATTENDANCE_LIST:
      return {
        ...state,
        attendance: action.attendance
      };
    default:
      return state;
  }
};
export default attendanceReducer;


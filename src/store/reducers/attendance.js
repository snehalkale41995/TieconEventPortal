import * as actionTypes from "../actions/actionTypes";

const initialState = {
  error: "",
  attendance: [],
  roles: new Set()
};
const attendanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOG_ATTENDANCE_ERROR:
      return {
        ...state,
        error: action.error
      };
    case actionTypes.STORE_ATTENDANCE_LIST: {
      let attendaceInfo = action.attendance;
      let roles = new Set();
      for (var i = 0; i < attendaceInfo.length; i++) {
        if (attendaceInfo[i].profile !== undefined) {
          roles.add(attendaceInfo[i].profile);
        }
      }
      return {
        ...state,
        roles: roles,
        attendance: action.attendance
      };
    }

    default:
      return state;
  }
};
export default attendanceReducer;

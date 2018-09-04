import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";

export const logAttendanceError = () => {
  return {
    type: actionTypes.LOG_ATTENDANCE_ERROR,
    error: "Oops...Something went wrong.Please try again..."
  };
};

export const storeAttendance = attendance => {
  return {
    type: actionTypes.STORE_ATTENDANCE_LIST,
    attendance: attendance
  };
};

export const getAttendanceList = () => {
  let attendance = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/attendance`)
      .then(response => {
        attendance = response.data;
        attendance.forEach(fItem => {
          fItem.event !== null
            ? (fItem.eventName = fItem.event.eventName)
            : (fItem.eventName = "");
          fItem.session !== null
            ? (fItem.sessionName = fItem.session.sessionName)
            : (fItem.sessionName = "");
          fItem.attendee !== null
            ? (fItem.attendeeName =
                fItem.attendee.firstName + " " + fItem.attendee.lastName)
            : (fItem.attendeeName = "");
        });
        dispatch(storeAttendance(attendance));
      })
      .catch(error => {
        dispatch(logAttendanceError());
      });
  };
};

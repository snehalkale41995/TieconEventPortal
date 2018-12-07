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

export const setAttendance = (attendance, attendees, speakers) => {
  let attendanceInfo = [];
  let attendanceDetails = [];
  var i, j, k;
  return dispatch => {
    for (i = 0; i < attendance.length; i++) {
      if (attendance[i].userType === "SPE") {
        for (j = 0; j < speakers.length; j++) {
          attendanceInfo = getUserDetails(
            attendanceDetails,
            attendance[i],
            speakers[j]
          );
        }
      } else {
        for (k = 0; k < attendees.length; k++) {
          attendanceInfo = getUserDetails(
            attendanceDetails,
            attendance[i],
            attendees[k]
          );
        }
      }
    }
    dispatch(storeAttendance(attendanceInfo));
  };
};

export const getUserDetails = (attendanceDetails, attendance, user) => {
  if (user._id === attendance.userId) {
    attendanceDetails.push({
      userName: user.firstName + " " + user.lastName,
      email: user.email,
      contact: user.contact,
      profile: user.roleName,
      eventName: attendance.event.eventName,
      eventId: attendance.event._id,
      sessionName: attendance.session.sessionName
    });
  }
  return attendanceDetails;
};

export const getAllAttendee = attendance => {
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/attendee`)
      .then(attendees => {
        axios.get(`${AppConfig.serverURL}/api/speaker`).then(speakers => {
          dispatch(setAttendance(attendance, attendees.data, speakers.data));
        });
      })
      .catch(error => {
        dispatch(logAttendanceError());
      });
  };
};

export const getAttendanceList = () => {
  let attendance = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/attendance`)
      .then(response => {
        attendance = response.data;
        dispatch(getAllAttendee(attendance));
      })
      .catch(error => {
        dispatch(logAttendanceError());
      });
  };
};

export const getAttendanceByEvent = eventId => {
  let attendance = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/attendance/byEvent/${eventId}`)
      .then(response => {
        attendance = response.data;
        dispatch(getAllAttendee(attendance));
      })
      .catch(error => {
        dispatch(logAttendanceError());
      });
  };
};

export const getAttendanceBySession = (eventId, sessionId) => {
  let attendance = [];
  return dispatch => {
    axios
      .get(
        `${
          AppConfig.serverURL
        }/api/attendance/getByEventSession/${eventId}/${sessionId}`
      )
      .then(response => {
        attendance = response.data;
        dispatch(getAllAttendee(attendance));
      })
      .catch(error => {
        dispatch(logAttendanceError());
      });
  };
};

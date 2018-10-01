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
  let attendanceDetails = [];
  var i, j, k;
  return dispatch => {
    for (i = 0; i < attendance.length; i++) {
      if (attendance.userType === "SPE") {
        for (j = 0; j <= speakers.length; j++) {
          if (speakers[j]._id === attendance[i].userId) {
            attendanceDetails.push({
              userName: speakers[j].firstName + " " + speakers[j].lastName,
              email: speakers[j].email,
              contact: speakers[j].contact,
              profile: speakers[j].roleName,
              eventName: attendance[i].event.eventName,
              eventId: attendance[i].event._id,
              sessionName: attendance[i].session.sessionName
            });
          }
        }
      } else {
        for (k = 0; k < attendees.length; k++) {
          if (attendees[k]._id === attendance[i].userId) {
            attendanceDetails.push({
              userName: attendees[k].firstName + " " + attendees[k].lastName,
              email: attendees[k].email,
              contact: attendees[k].contact,
              profile: attendees[k].roleName,
              eventName: attendance[i].event.eventName,
              eventId: attendance[i].event._id,
              sessionName: attendance[i].session.sessionName
            });
          }
        }
      }
    }
    dispatch(storeAttendance(attendanceDetails));
  };
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

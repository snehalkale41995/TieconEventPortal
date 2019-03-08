import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";
import { setTimeout } from "timers";

export const logRegistrationError = error => {
  return {
    type: actionTypes.LOG_REGISTRATION_ERROR,
    errorFlag: true,
    error: error !== undefined ? error : "Oops Something went wrong...."
  };
};

export const getAttendeeFail = () => {
  return {
    type: actionTypes.GET_ATTENDEE_LIST_FAIL
  };
};

export const storeAttendees = attendees => {
  return {
    type: actionTypes.GET_ATTENDEE_LIST,
    attendeeList: attendees
  };
};

export const getAttendees = () => {
  let attendees = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/attendee`)
      .then(response => {
        attendees = response.data;
        attendees.forEach(attendee => {
          if (attendee.event !== null) {
            attendee.eventName = attendee.event.eventName;
          }
        });
        dispatch(storeAttendees(attendees));
      })
      .catch(error => {
        dispatch(getAttendeeFail());
      });
  };
};

export const bulkUploadAttendee = attendee => {
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/bulkUploadAttendee`, attendee)
      .then(response => {
        dispatch(getAttendees());
        // dispatch(creatEditAttendeeSuccess());
      })
      .catch(error => {
        dispatch();
        // creatEditAttendeeFail(error.response.data, error.response.status)
      });
  };
};

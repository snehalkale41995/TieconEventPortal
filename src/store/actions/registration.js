import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";

export const logRegistrationError = error => {
  return {
    type: actionTypes.LOG_REGISTRATION_ERROR,
    errorFlag: true,
    error: error !== undefined ? error : "Oops Something went wrong...."
  };
};

export const creatEditAttendeeFail = error => {
  return {
    type: actionTypes.CREATE_EDIT_ATTENDEE_FAIL,
    creatError: error
  };
};

export const getAttendeeFail = () => {
  return {
    type: actionTypes.GET_ATTENDEE_LIST_FAIL
  };
};

export const deleteAttendeeFail = error => {
  return {
    type: actionTypes.DELETE_ATTENDEE_FAIL,
    deleteError: error
  };
};

export const storeAttendees = attendees => {
  return {
    type: actionTypes.GET_ATTENDEE_LIST,
    attendeeList: attendees
  };
};

export const storeAttendeeData = attendeeData => {
  return {
    type: actionTypes.GET_ATTENDEE_DATA,
    attendeeData: attendeeData
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

export const getAttendeesForEvent = eventId => {
  let attendees = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/attendee/event/${eventId}`)
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

export const getAttendeesForEventAndProfile = (eventId, profileName) => {
  let attendees = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/attendee/event/${eventId}`)
      .then(response => {
        attendees = response.data;
        let attendeeList = [];
        attendees.forEach(attendee => {
          attendee.profiles.forEach(profile => {
            if (profile === profileName) {
              attendeeList.push(attendee);
            }
          });
          if (attendee.event !== null) {
            attendee.eventName = attendee.event.eventName;
          }
        });
        dispatch(storeAttendees(attendeeList));
      })
      .catch(error => {
        dispatch(getAttendeeFail());
      });
  };
};

export const getAttendeeById = id => {
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/attendee/${id}`)
      .then(response => {
        dispatch(storeAttendeeData(response.data));
      })
      .catch(error => {
        dispatch(logRegistrationError());
      });
  };
};

export const editAttendeeData = (id, attendee) => {
  attendee["attendeeLabel"] = attendee.profiles[0]
    .substring(0, 3)
    .toUpperCase();
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/attendee/${id}`, attendee)
      .then(response => {
        dispatch(getAttendees());
      })
      .catch(error => {
        dispatch(creatEditAttendeeFail(error.response.data));
      });
  };
};

export const createAttendee = (attendee, attendeeCount) => {
  let id = attendeeCount._id;
  let attendeeCountObj = {
    attendeeCount: attendeeCount.attendeeCount + 1,
    totalCount: attendeeCount.totalCount + 1,
    speakerCount: attendeeCount.speakerCount,
    event: attendeeCount.event
  };
  attendee["attendeeCount"] = attendeeCount.attendeeCount + 1;
  attendee["attendeeLabel"] = attendee.profiles[0]
    .substring(0, 3)
    .toUpperCase();
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/attendee`, attendee)
      .then(response => {
        axios
          .put(
            `${AppConfig.serverURL}/api/attendeeCount/${id}`,
            attendeeCountObj
          )
          .then(response => {
            dispatch(getAttendees());
          });
      })
      .catch(error => {
        dispatch(creatEditAttendeeFail(error.response.data));
      });
  };
};

export const deleteAttendee = id => {
  return dispatch => {
    axios
      .delete(`${AppConfig.serverURL}/api/attendee/${id}`)
      .then(response => {
        dispatch(getAttendees());
      })
      .catch(error => {
        dispatch(deleteAttendeeFail(error.response.data));
      });
  };
};

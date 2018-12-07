import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import _ from "lodash";
import AppConfig from "../../constants/AppConfig";

export const getEventsSuccess = (events, eventList) => {
  return {
    type: actionTypes.GET_EVENTS_SUCCESS,
    events: events,
    eventList: eventList
  };
};

export const getEventsFail = error => {
  return {
    type: actionTypes.GET_EVENTS_FAIL,
    error: error
  };
};

export const createEventSuccess = (eventId, event) => {
  return {
    type: actionTypes.CREATE_EVENT_SUCCESS,
    eventId: eventId,
    event: event
  };
};

export const updateEventFail = error => {
  return {
    type: actionTypes.CREATE_EVENT_FAIL,
    error: error
  };
};

export const updateEventSuccess = (eventId, event) => {
  return {
    type: actionTypes.UPDATE_EVENT_SUCCESS,
    eventId: eventId,
    event: event
  };
};
export const deleteEventFail = error => {
  return {
    type: actionTypes.DELETTE_EVENT_FAIL,
    error: error
  };
};

export const deleteEventSuccess = eventId => {
  return {
    type: actionTypes.DELETE_EVENT_SUCCESS,
    eventId: eventId
  };
};

export const createEventFail = error => {
  return {
    type: actionTypes.UPDATE_EVENT_FAIL,
    error: error
  };
};

export const storeCurrentEvent = currentEvent => {
  return {
    type: actionTypes.STORE_CURRENT_EVENT,
    currentEvent: currentEvent
  };
};

export const getEvents = () => {
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/event`)
      .then(response => {
        let eventList = [];
        let events = response.data;
        events.forEach(event => {
          eventList.push({ label: event.eventName, value: event._id });
        });

        dispatch(getEventsSuccess(response.data, eventList));
      })
      .catch(error => {
        dispatch(getEventsFail(error));
      });
  };
};

export const getEventById = id => {
  let EventData = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/Event/${id}`)
      .then(response => {
        EventData = response.data;
        dispatch(storeCurrentEvent(EventData));
      })
      .catch(error => {
        //dispatch(getRoomError());
      });
  };
};

export const createEvent = event => {
  let eventObj = _.pick(event, [
    "eventName",
    "venue",
    "description",
    "startDate",
    "endDate",
    "eventLogo"
  ]);

  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/event`, eventObj)
      .then(response => {
        let attendeeCountObj = {
          attendeeCount: 0,
          speakerCount: 0,
          totalCount: 0,
          event: response.data._id
        };
        axios
          .post(`${AppConfig.serverURL}/api/attendeeCount`, attendeeCountObj)
          .then(response => {
            dispatch(createEventSuccess(response.data._id, eventObj));
          });
      })
      .catch(error => {
        dispatch(createEventFail(error));
      });
  };
};

export const updateEvent = event => {
  let id = event.id;
  let eventObj = _.pick(event, [
    "eventName",
    "venue",
    "description",
    "startDate",
    "endDate",
    "eventLogo"
  ]);
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/event/${id}`, eventObj)
      .then(response => {
        dispatch(updateEventSuccess(response.data._id, event));
      })
      .catch(error => {
        dispatch(updateEventFail(error));
      });
  };
};

export const deleteEvent = eventId => {
  let id = eventId;
  return dispatch => {
    axios
      .delete(`${AppConfig.serverURL}/api/event/${id}`)
      .then(response => {
        dispatch(getEvents());
        dispatch(deleteEventSuccess(response.data._id));
      })
      .catch(error => {
        dispatch(deleteEventFail(error));
      });
  };
};

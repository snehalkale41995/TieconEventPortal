import * as actionTypes from "../actions/actionTypes";

const initialState = {
  events: [],
  eventList: [],
  loading: false,
  eventCreated: false,
  eventUpdated: false,
  eventDeleted: false,
  errorMessage: "",
  currentEvent: [],
  error: false
};
const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_EVENTS_SUCCESS:
      return {
        ...state,
        events: action.events,
        eventList: action.eventList,
        getEventflag: true
      };
    case actionTypes.GET_EVENTS_FAIL:
      return {
        ...state,
        error: true,
        errorMessage: action.error,
        getEventflag: false
      };
    case actionTypes.STORE_CURRENT_EVENT:
      return {
        ...state,
        currentEvent: action.currentEvent,
        eventCreated: false,
        eventUpdated: false,
        eventDeleted: false
      };
    case actionTypes.CREATE_EVENT_SUCCESS:
      const newEvent = {
        ...action.event,
        id: action.eventId
      };
      return {
        ...state,
        events: state.events.concat(newEvent),
        eventCreated: true
      };
    case actionTypes.CREATE_EVENT_FAIL:
      return {
        ...state,
        eventCreated: false
      };

    case actionTypes.UPDATE_EVENT_SUCCESS:
      return {
        ...state,
        eventUpdated: true
      };

    case actionTypes.UPDATE_EVENT_FAIL:
      return {
        ...state,
        eventUpdated: false
      };
    case actionTypes.DELETE_EVENT_SUCCESS:
      return {
        ...state,
        eventDeleted: true
      };

    case actionTypes.DELETE_EVENT_FAILL:
      return {
        ...state,
        eventDeleted: false
      };
    default:
      return state;
  }
};
export default eventReducer;

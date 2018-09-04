import * as actionTypes from "../actions/actionTypes";

const initialState = {
  sessions: [],
  sessionTypeList: [],
  sessionCreated: false,
  sessionUpdated: false,
  sessionDeleted: false
};
const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_SESSIONS_SUCCESS:
      return {
        ...state,
        sessions: action.sessions,
        sessionList: action.sessionList
      };
    case actionTypes.GET_SESSION_TYPE_LIST_SUCCESS:
      return {
        ...state,
        sessionTypeList: action.sessionTypeList
      };
    case actionTypes.CREATE_SESSION_SUCCESS:
      const newSession = {
        ...action.session,
        id: action.sessionId,
        event: { _id: action.session.event }
      };
      return {
        ...state,
        sessions: state.sessions.concat(newSession),
        sessionCreated: true
      };
    case actionTypes.CREATE_SESSION_FAIL:
      return {
        ...state,
        sessionCreated: false
      };

    case actionTypes.UPDATE_SESSION_SUCCESS:
      return {
        ...state,
        sessionUpdated: true
      };

    case actionTypes.UPDATE_SESSION_FAIL:
      return {
        ...state,
        sessionUpdated: false
      };
    case actionTypes.DELETE_SESSION_SUCCESS:
      return {
        ...state,
        sessionDeleted: true
      };

    case actionTypes.DELETE_SESSION_FAILL:
      return {
        ...state,
        sessionDeleted: false
      };

    default:
      return state;
  }
};
export default sessionReducer;

import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import _ from "lodash";
import AppConfig from "../../constants/AppConfig";

export const getSessionsSuccess = (sessions, sessionList) => {
  return {
    type: actionTypes.GET_SESSIONS_SUCCESS,
    sessions: sessions,
    sessionList: sessionList
  };
};

export const createSessionSuccess = (sessionId, session) => {
  return {
    type: actionTypes.CREATE_SESSION_SUCCESS,
    sessionId: sessionId,
    session: session
  };
};

export const createSessionFail = error => {
  return {
    type: actionTypes.CREATE_SESSION_FAIL,
    error: error
  };
};

export const updateSessionSuccess = (sessionId, session) => {
  return {
    type: actionTypes.UPDATE_SESSION_SUCCESS,
    sessionId: sessionId,
    session: session
  };
};

export const updateSessionFail = error => {
  return {
    type: actionTypes.UPDATE_SESSION_FAIL,
    error: error
  };
};

export const deleteSessionFail = error => {
  return {
    type: actionTypes.DELETTE_SESSION_FAIL,
    error: error
  };
};

export const deleteSessionSuccess = sessionId => {
  return {
    type: actionTypes.DELETE_SESSION_SUCCESS,
    sessionId: sessionId
  };
};

export const getSessionTypeListsSuccess = sessionTypeList => {
  return {
    type: actionTypes.GET_SESSION_TYPE_LIST_SUCCESS,
    sessionTypeList: sessionTypeList
  };
};

export const getSessions = () => {
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/session`)
      .then(response => {
        let sessionList = [];
        let sessions = response.data;

        sessions.forEach(session => {
          sessionList.push({ label: session.sessionName, value: session._id });
        });

        dispatch(getSessionsSuccess(response.data, sessionList));
      })
      .catch(error => {
        dispatch(getSessionsFail(error));
      });
  };
};

export const getSessionsByEvent = eventId => {
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/session`)
      .then(response => {
        let sessionList = [];
        let sessions = [];
        response.data.forEach(data => {
          if (data.event != null) {
            if (data.event._id === eventId) {
              sessions.push(data);
            }
          }
        });
        dispatch(getSessionsSuccess(sessions, sessionList));
      })
      .catch(error => {
        dispatch(getSessionsFail(error));
      });
  };
};

export const createSession = session => {
  let sessionObj = _.pick(session, [
    "sessionName",
    "event",
    "speakers",
    "volunteers",
    "room",
    "description",
    "sessionType",
    "sessionCapacity",
    "startTime",
    "endTime",
    "isBreak",
    "isRegistrationRequired"
  ]);

  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/session`, sessionObj)
      .then(response => {
        dispatch(createSessionSuccess(response.data._id, response.data));
      })
      .catch(error => {
        dispatch(createSessionFail(error));
      });
  };
};

export const updateSession = session => {
  let id = session._id;
  let sessionObj = _.pick(session, [
    "sessionName",
    "event",
    "speakers",
    "volunteers",
    "room",
    "description",
    "sessionType",
    "sessionCapacity",
    "startTime",
    "endTime",
    "isBreak",
    "isRegistrationRequired"
  ]);

  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/session/${id}`, sessionObj)
      .then(response => {
        dispatch(updateSessionSuccess(response.data._id, session));
        dispatch(getSessions());
      })
      .catch(error => {
        dispatch(updateSessionFail(error));
      });
  };
};

export const deleteSession = sessionId => {
  let id = sessionId;
  return dispatch => {
    axios
      .delete(`${AppConfig.serverURL}/api/session/${id}`)
      .then(response => {
        dispatch(getSessions());
        dispatch(deleteSessionSuccess(response.data._id));
      })
      .catch(error => {
        dispatch(deleteSessionFail(error));
      });
  };
};

export const getSessionTypeList = () => {
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/sessionTypeList`)
      .then(response => {
        let SessionTypeList = [];
        let dataList = response.data[0].sessionTypes;
        dataList.forEach(data => {
          SessionTypeList.push({ label: data, value: data });
        });
        dispatch(getSessionTypeListsSuccess(SessionTypeList));
      })
      .catch(error => {
        //dispatch(getSessionTypeListsFail(error));
      });
  };
};

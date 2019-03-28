import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";

export const storeSessionQA = (sessionQAData) => {
  return {
    type: actionTypes.GET_SESSIONQA,
    sessionQA: sessionQAData
  };
};

export const getSessionQAError = () => {
  return {
    type: actionTypes.GET_SESSIONQA
  };
};

export const getSessionQA = () => {
  let SessionQAData = [];
  return dispatch => {
      dispatch(storeSessionQA(SessionQAData));
   }
};

export const getSessionQAByEventSession = (eventId, sessionId) => {
  let SessionQAData = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/SessionQAnswer/byVote/${eventId}/${sessionId}`)
      .then(response => {
        SessionQAData = response.data;
        dispatch(storeSessionQA(SessionQAData));
      })
      .catch(error => {
        dispatch(getSessionQAError());
      });
  };
};

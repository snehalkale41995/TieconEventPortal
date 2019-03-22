import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";

export const storeSessionQA = (SessionQAData) => {
  return {
    type: actionTypes.GET_SPONSORS,
    SessionQAs: SessionQAData
  };
};

export const getSessionQAError = () => {
  return {
    type: actionTypes.GET_SESSIONQA_ERROR
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
      .get(`${AppConfig.serverURL}/api/SessionQA/byVote/${eventId}/${sessionId}`)
      .then(response => {
        SessionQAData = response.data;
        dispatch(storeSessionQA(SessionQAData));
      })
      .catch(error => {
        dispatch(getSessionQAError());
      });
  };
};

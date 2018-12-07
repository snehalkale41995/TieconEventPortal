import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";

export const storeSessionsOfEvent = sessionList => {
  return {
    type: actionTypes.GET_SESSIONS_BY_EVENT_ID,
    sessions: sessionList
  };
};
export const storeForms = forms => {
  return {
    type: actionTypes.STORE_FORMS,
    forms: forms
  };
};
export const getFormsError = () => {
  return {
    type: actionTypes.GET_FORMS_ERROR
  };
};
export const creatEditFormError = () => {
  return {
    type: actionTypes.CREATE_EDIT_FORM_ERROR
  };
};

export const deleteFormError = () => {
  return {
    type: actionTypes.DELETE_FORM_ERROR
  };
};

export const storeCurrentForm = formData => {
  return {
    type: actionTypes.STORE_CURRENT_FORM,
    formData: formData
  };
};
export const getSessionsOfEvent = id => {
  let sessionList = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/session/getSessions/${id}`)
      .then(response => {
        let sessions = response.data;
        sessions.forEach(sessionObj => {
          if (sessionObj.sessionType !== "common") {
            sessionList.push({
              label: sessionObj.sessionName,
              value: sessionObj._id
            });
          }
        });
        dispatch(storeSessionsOfEvent(sessionList));
      })
      .catch(error => {
        dispatch(getFormsError(error.message));
      });
  };
};
export const createForm = formObject => {
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/questionForms`, formObject)
      .then(response => {
        dispatch(getForms());
      })
      .catch(error => {
        dispatch(creatEditFormError());
      });
  };
};

export const editForm = (id, formObject) => {
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/questionForms/${id}`, formObject)
      .then(response => {
        dispatch(getForms());
      })
      .catch(error => {
        dispatch(creatEditFormError());
      });
  };
};

export const deleteForm = id => {
  return dispatch => {
    axios
      .delete(`${AppConfig.serverURL}/api/questionForms/${id}`)
      .then(response => {
        dispatch(getForms());
      })
      .catch(error => {
        dispatch(deleteFormError());
      });
  };
};

export const getForms = () => {
  let formData = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/questionForms`)
      .then(response => {
        formData = response.data;
        formData.forEach(form => {
          if (form.event !== null) {
            form.eventName = form.event.eventName;
          }
        });
        dispatch(storeForms(formData));
      })
      .catch(error => {
        dispatch(getFormsError());
      });
  };
};

export const getFormById = id => {
  let formData = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/questionForms/${id}`)
      .then(response => {
        formData = response.data;
        dispatch(storeCurrentForm(formData));
      })
      .catch(error => {
        dispatch(getFormsError());
      });
  };
};

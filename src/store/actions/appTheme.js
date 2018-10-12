import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import _ from "lodash";
import AppConfig from "../../constants/AppConfig";

export const getAppThemeSuccess = appTheme => {
  return {
    type: actionTypes.GET_APPTHEME_SUCCESS,
    appTheme: appTheme
  };
};

export const getAppThemeFail = error => {
  return {
    type: actionTypes.GET_APPTHEME_FAIL,
    error: error
  };
};

export const createAppThemeSuccess = appTheme => {
  return {
    type: actionTypes.CREATE_APPTHEME_SUCCESS,
    appTheme: appTheme
  };
};

export const updateAppThemeFail = error => {
  return {
    type: actionTypes.CREATE_APPTHEME_FAIL,
    error: error
  };
};

export const updateAppThemeSuccess = appTheme => {
  return {
    type: actionTypes.UPDATE_APPTHEME_SUCCESS,
    appTheme: appTheme
  };
};

export const createAppThemeFail = error => {
  return {
    type: actionTypes.UPDATE_APPTHEME_FAIL,
    error: error
  };
};

export const storeCurrentAppTheme = currentAppTheme => {
  return {
    type: actionTypes.STORE_CURRENT_APPTHEME,
    currentAppTheme: currentAppTheme
  };
};

export const getAppTheme = () => {
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/appTheme`)
      .then(response => {
        let appTheme = response.data;
        dispatch(getAppThemeSuccess(appTheme));
      })
      .catch(error => {
        dispatch(getAppThemeFail(error));
      });
  };
};

export const createAppTheme = appTheme => {
  let appThemeObj = _.pick(appTheme, [
    "appTitle",
    "themeColor",
    "textColor",
    "appThemeColorHex",
    "appTextColorHex",
    "appLogo"
  ]);

  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/appTheme`, appThemeObj)
      .then(response => {
        let attendeeCountObj = {
          attendeeCount: 0,
          speakerCount: 0,
          totalCount: 0,
          appTheme: response.data._id
        };
        axios
          .post(`${AppConfig.serverURL}/api/attendeeCount`, attendeeCountObj)
          .then(response => {
            dispatch(createAppThemeSuccess(appThemeObj));
          });
      })
      .catch(error => {
        dispatch(createAppThemeFail(error));
      });
  };
};

export const updateAppTheme = appTheme => {
  let id = appTheme.id;
  let appThemeObj = _.pick(appTheme, [
    "appTitle",
    "themeColor",
    "textColor",
    "appThemeColorHex",
    "appTextColorHex",
    "appLogo"
  ]);
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/appTheme/${id}`, appThemeObj)
      .then(response => {
        dispatch(updateAppThemeSuccess(appTheme));
      })
      .catch(error => {
        dispatch(updateAppThemeFail(error));
      });
  };
};

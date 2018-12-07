import * as actionTypes from "../actions/actionTypes";

const initialState = {
  appTheme: [],
  appThemeId: "",
  loading: false,
  appThemeCreated: false,
  appThemeUpdated: false,
  appThemeDeleted: false,
  errorMessage: "",
  currentAppTheme: [],
  error: false
};

const appThemeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_APPTHEME_SUCCESS:
      return {
        ...state,
        appTheme: action.appTheme,
        getAppThemeflag: true
      };
    case actionTypes.GET_APPTHEME_FAIL:
      return {
        ...state,
        error: true,
        errorMessage: action.error,
        getAppThemeflag: false
      };
    case actionTypes.STORE_CURRENT_APPTHEME:
      return {
        ...state,
        currentAppTheme: action.currentAppTheme,
        appThemeCreated: false,
        appThemeUpdated: false,
        appThemeDeleted: false
      };
    case actionTypes.CREATE_APPTHEME_SUCCESS:
      return {
        ...state,
        appTheme: action.appTheme,
        appThemeId: action.appThemeId,
        appThemeCreated: true
      };
    case actionTypes.CREATE_APPTHEME_FAIL:
      return {
        ...state,
        appThemeCreated: false
      };

    case actionTypes.UPDATE_APPTHEME_SUCCESS:
      return {
        ...state,
        appThemeUpdated: true,
        appTheme: action.appTheme,
        appThemeId: action.appThemeId
      };

    case actionTypes.UPDATE_APPTHEME_FAIL:
      return {
        ...state,
        appThemeUpdated: false
      };
    default:
      return state;
  }
};
export default appThemeReducer;

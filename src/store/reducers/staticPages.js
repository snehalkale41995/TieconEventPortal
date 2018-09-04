import * as actionTypes from "../actions/actionTypes";

const initialState = {
  aboutUs: {},
  aboutEternus: {},
  helpDesk: {},
  eventLocation: {},
  getAboutUsError: false,
  getAboutEternusError: false,
  getHelpDeskError: false,
  getLocationError: false,
  creatEditAboutUsError: false,
  creatEditAboutEternusError: false,
  creatEditHelpDeskError: false,
  creatEditLocationError: false
};

const staticPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STORE_ABOUT_US:
      return {
        ...state,
        aboutUs: action.aboutUs,
        getAboutUsError: false,
        creatEditAboutUsError: false
      };
    case actionTypes.STORE_ABOUT_ETERNUS:
      return {
        ...state,
        aboutEternus: action.aboutEternus,
        getAboutEternusError: false,
        creatEditAboutEternusError: false
      };
    case actionTypes.STORE_HELPDESK_DETAILS:
      return {
        ...state,
        helpDesk: action.helpDesk,
        getHelpDeskError: false,
        creatEditHelpDeskError: false
      };
    case actionTypes.STORE_EVENT_LOCATION:
      return {
        ...state,
        eventLocation: action.eventLocation,
        getLocationError: false,
        creatEditLocationError: false
      };
    case actionTypes.GET_ABOUTUS_ERROR:
      return {
        ...state,
        getAboutUsError: true
      };
    case actionTypes.GET_ABOUTETERNUS_ERROR:
      return {
        ...state,
        getAboutEternusError: true
      };
    case actionTypes.GET_HELPDESK_ERROR:
      return {
        ...state,
        getHelpDeskError: true
      };
    case actionTypes.GET_LOCATION_ERROR:
      return {
        ...state,
        getLocationError: true
      };
    case actionTypes.CREATE_EDIT_ABOUTUS_ERROR:
      return {
        ...state,
        creatEditAboutUsError: true
      };
    case actionTypes.CREATE_EDIT_ABOUTETERNUS_ERROR:
      return {
        ...state,
        creatEditAboutEternusError: true
      };
    case actionTypes.CREATE_EDIT_HELPDESK_ERROR:
      return {
        ...state,
        creatEditHelpDeskError: true
      };
    case actionTypes.CREATE_EDIT_LOCATION_ERROR:
      return {
        ...state,
        creatEditLocationError: true
      };
    default:
      return {
        ...state
      };
  }
};
export default staticPageReducer;

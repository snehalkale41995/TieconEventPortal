import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";
import { setTimeout } from "timers";
import {getAttendees} from '../actions/registration'

export const bulkUploadAttendeeFail = () => {
  return {
    type: actionTypes.LOG_BULk_UPLOAD_ERROR
  };
};

export const bulkUploadAttendeeSuccess = () => {
  return {
    type: actionTypes.CLEAR_BULk_UPLOAD_ERROR
  };
};

export const bulkValidateAttendeeFail = (attendeeList) => {
  return {
    type: actionTypes.LOG_BULk_VALIDATE_ERROR,
    attendeeList : attendeeList
  };
};

export const bulkValidateAttendeeSuccess = (attendeeList) => {
  return {
    type: actionTypes.CLEAR_BULk_VALIDATE_ERROR,
    attendeeList : attendeeList
  };
};

export const bulkUploadAttendee = (attendee, eventId) => {
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/bulkUploadAttendee/post/${eventId}`, attendee)
      .then(response => {
       if(response.data.success==true){
        dispatch(getAttendees());
        dispatch(bulkUploadAttendeeSuccess());
       }
       else dispatch(bulkUploadAttendeeFail());
      })
      .catch(error => {
        dispatch(bulkUploadAttendeeFail());
      });
  };
};


export const bulkValidateAttendee = (attendee) => {
  let attendeeList = [];
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/bulkUploadAttendee/validate/`, attendee)
      .then(response => {
        console.log("responsesss", response)
        attendeeList = response.data.userList;
       if(response.data.success==true){
          dispatch(bulkValidateAttendeeSuccess(attendeeList));
       }
        else dispatch(bulkValidateAttendeeFail(attendeeList));
      })
      .catch(error => {
        dispatch(bulkValidateAttendeeFail(attendeeList));
      });
  };
};
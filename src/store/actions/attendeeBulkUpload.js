import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";
import { setTimeout } from "timers";
import {getAttendees} from '../actions/registration'

// export const bulkUploadAttendeeFail = () => {
//   return {
//     type: actionTypes.LOG_BULKUPLOAD_ERROR,
//     errorFlag: true,
//     error: error !== undefined ? error : "Oops Something went wrong...."
//   };
// };

export const bulkUploadAttendee = (attendee, eventId) => {
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/bulkUploadAttendee/${eventId}`, attendee)
      .then(response => {
       console.log("resposne", response);
        dispatch(getAttendees());
       // dispatch(bulkUploadAttendeeSuccess());
      })
      .catch(error => {
       // dispatch(bulkUploadAttendeeFail());
        // creatEditAttendeeFail(error.response.data, error.response.status)
      });
  };
};

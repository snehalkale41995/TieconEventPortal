import * as actionTypes from "../actions/actionTypes";

const initialState = {
  attendeeList : [],
  bulkUploadError : false,
  bulkValidationError : false 
};

const bulkUploadReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOG_BULk_UPLOAD_ERROR:
      return {
        ...state,
        bulkUploadError: true
      };
     case actionTypes.CLEAR_BULk_UPLOAD_ERROR:
      return {
        ...state,
        bulkUploadError: false
      };
    case actionTypes.LOG_BULk_VALIDATE_ERROR:
      return {
        ...state,
        bulkValidationError: true,
        attendeeList : action.attendeeList
      };
     case actionTypes.CLEAR_BULk_VALIDATE_ERROR:
      return {
        ...state,
         bulkValidationError: false,
         attendeeList : action.attendeeList
      };
    default:
      return state;
  }
};
export default bulkUploadReducer;

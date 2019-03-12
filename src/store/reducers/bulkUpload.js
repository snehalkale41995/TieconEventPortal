import * as actionTypes from "../actions/actionTypes";

const initialState = {
  bulkUploadErrorFlag : false,
  bulkValidationErrorFlag : false 
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
        bulkValidationErrorFlag: true
      };
     case actionTypes.CLEAR_BULk_VALIDATE_ERROR:
      return {
        ...state,
         bulkValidationErrorFlag: false
      };
    default:
      return state;
  }
};
export default bulkUploadReducer;

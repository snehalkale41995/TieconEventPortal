import * as actionTypes from "../actions/actionTypes";

const initialState = {
  error: "",
  speakerList: [],
  speakerData: {},
  speakerCreated: false,
  speakerUpdated: false,
  speakerDeleted: false,
  createError: ""
};
const speakerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_SPEAKER_LIST:
      return {
        ...state,
        speakerList: action.speakerList,
        error: ""
      };
    case actionTypes.GET_SPEAKER_DATA:
      return {
        ...state,
        speakerData: action.speakerData,
        error: ""
      };
    case actionTypes.LOG_REGISTRATION_ERROR:
      return {
        ...state,
        error: action.error
      };

    case actionTypes.CREATE_SPEAKER_SUCCESS:
      return {
        ...state,
        speakerCreated: true,
        createError: ""
      };
    case actionTypes.CREATE_SPEAKER_FAIL:
      return {
        ...state,
        speakerCreated: false,
        createError: action.createError
      };
    case actionTypes.UPDATE_SPEAKER_SUCCESS:
      return {
        ...state,
        speakerUpdated: true
      };

    case actionTypes.UPDATE_SPEAKER_FAIL:
      return {
        ...state,
        speakerUpdated: false
      };
    case actionTypes.DELETE_SPEAKER_SUCCESS:
      return {
        ...state,
        speakerDeleted: true
      };

    case actionTypes.DELETE_SPEAKER_FAILL:
      return {
        ...state,
        speakerDeleted: false
      };
    default:
      return state;
  }
};
export default speakerReducer;

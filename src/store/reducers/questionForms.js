import * as actionTypes from '../actions/actionTypes';

const initialState = {
    sessions: [],
    formTypes: [
        { label: "Home Questions", value: "Home Questions" },
        { label: "Polling Questions", value: "Polling Questions" },
        { label: "Feedback Questions", value: "Feedback Questions" }
    ],
    forms: [],
    formData: [],
    error : "",
    getFormError : false,
    creatEditFormError : false,
    deleteFormError : false,
}
const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_SESSIONS_BY_EVENT_ID:
            return {
                ...state,
                sessions: action.sessions,
                error: "",
                getFormError : false,
                creatEditFormError : false,
                deleteFormError : false,
            };
        case actionTypes.STORE_FORMS:
            return {
                ...state,
                forms: action.forms,
                error: "",
                getFormError : false,
                creatEditFormError : false,
                deleteFormError : false,
            };
        case actionTypes.STORE_CURRENT_FORM:
            return {
                ...state,
                formData: action.formData,
                error: "",
                getFormError : false,
                creatEditFormError : false,
                deleteFormError : false,
            };
        case actionTypes.LOG_FORM_ERROR:
            return {
                ...state,
                error: action.error
            };
            case actionTypes.GET_FORMS_ERROR:
            return {
                ...state,
                getFormError : true
            };
            case actionTypes.CREATE_EDIT_FORM_ERROR:
            return {
                ...state,
                creatEditFormError : true
            };
            case actionTypes.DELETE_FORM_ERROR:
            return {
                ...state,
                deleteFormError : true
            };
        default:
            return state;
    }
}
export default formReducer;
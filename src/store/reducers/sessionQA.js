import * as actionTypes from '../actions/actionTypes';

const initialState = {
    sessionQA: [],
    getSessionQAError: false,
}
const sessionQAReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_SESSIONQA:
            return {
                ...state,
                sessionQA: action.sessionQA,
                getSessionQAError: false
            };
        case actionTypes.GET_SESSIONQA_ERROR:
            return {
                ...state,
                getSessionQAError: true
            };
        default:
            return state;
    }
}
export default sessionQAReducer;
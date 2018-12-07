import * as actionTypes from '../actions/actionTypes';

const initialState = {
   attendeeCount: {}
}
const attendeeCountReducer = (state = initialState, action) => {
    switch (action.type) {
     
        case actionTypes.GET_ATTENDEE_COUNTS_SUCCESS:
            return {
                ...state,
                attendeeCount: action.AttendeeCount,
            };
            default:
            return state;
    }
}
export default attendeeCountReducer;
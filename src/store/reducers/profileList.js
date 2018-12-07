import * as actionTypes from "../actions/actionTypes";

const initialState = {
  profileList: [],
  ProfileArray: []
};
const profileListReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PROFILE_LIST_SUCCESS:
      return {
        ...state,
        profileList: action.ProfileList
      };
    case actionTypes.GET_PROFILE_ARRAY_SUCCESS:
      return {
        ...state,
        ProfileArray: action.ProfileArray
      };
    case actionTypes.GET_PROFILE_LIST_FAIL:
      return {
        ...state
      };
    default:
      return state;
  }
};
export default profileListReducer;

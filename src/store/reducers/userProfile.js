import * as actionTypes from "../actions/actionTypes";

const initialState = {
  profiles: [],
  profileList: [],
  profileCreated: false,
  profileUpdated: false,
  profileDeleted: false
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PROFILES_SUCCESS:
      return {
        ...state,
        profiles: action.profiles,
        profileList: action.profileList
      };
    case actionTypes.CREATE_PROFILE_SUCCESS:
      const newProfile = {
        ...action.profile,
        id: action.profileId
      };
      return {
        ...state,
        profiles: state.profiles.concat(newProfile),
        profileCreated: true
      };
    case actionTypes.CREATE_PROFILE_FAIL:
      return {
        ...state,
        profileCreated: false
      };
    case actionTypes.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        profileUpdated: true
      };

    case actionTypes.UPDATE_PROFILE_FAIL:
      return {
        ...state,
        profileUpdated: false
      };
    case actionTypes.DELETE_PROFILE_SUCCESS:
      return {
        ...state,
        profileDeleted: true
      };

    case actionTypes.DELETE_PROFILE_FAILL:
      return {
        ...state,
        profileDeleted: false
      };
    default:
      return {
        ...state
      };
  }
};

export default profileReducer;

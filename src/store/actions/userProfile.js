import * as actionTypes from "./actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";

export const getProfilesSuccess = (profiles, profileList) => {
  return {
    type: actionTypes.GET_PROFILES_SUCCESS,
    profiles: profiles,
    profileList: profileList
  };
};

export const createProfileSuccess = (profile, profileId) => {
  return {
    type: actionTypes.CREATE_PROFILE_SUCCESS,
    profile: profile,
    profileId: profileId
  };
};

export const createProfileFail = error => {
  return {
    type: actionTypes.CREATE_PROFILE_FAIL,
    error: error
  };
};

export const updateProfileSuccess = profile => {
  return {
    type: actionTypes.UPDATE_PROFILE_SUCCESS,
    profile: profile
  };
};

export const updateProfileFail = error => {
  return {
    type: actionTypes.UPDATE_PROFILE_FAIL,
    error: error
  };
};

export const deleteProfileFail = error => {
  return {
    type: actionTypes.DELETTE_PROFILE_FAIL,
    error: error
  };
};

export const deleteProfileSuccess = profileId => {
  return {
    type: actionTypes.DELETE_PROFILE_SUCCESS,
    profileId: profileId
  };
};

export const getProfiles = () => {
  let profileList = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/userProfile`)
      .then(response => {
        response.data.forEach(profile => {
          profileList.push({ label: profile.profileName, value: profile._id });
        });
        dispatch(getProfilesSuccess(response.data, profileList));
      })
      .catch(error => {
        // console.log(error)
      });
  };
};

export const createProfile = profile => {
  let profileObj = {
    profileName: profile.profileName,
    event: profile.eventValue
  };
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/userProfile`, profileObj)
      .then(response => {
        dispatch(createProfileSuccess(profileObj, response.data._id));
      })
      .catch(error => {
        dispatch(createProfileFail(error));
      });
  };
};

export const updateProfile = profile => {
  let id = profile.profileId;

  let profileObj = {
    profileName: profile.profileName,
    event: profile.eventValue
  };
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/userProfile/${id}`, profileObj)
      .then(response => {
        updateProfileSuccess(response.data);
      })
      .catch(error => {
        dispatch(updateProfileFail(error));
      });
  };
};

export const deleteProfile = profileId => {
  let id = profileId;
  return dispatch => {
    axios
      .delete(`${AppConfig.serverURL}/api/userProfile/${id}`)
      .then(response => {
        dispatch(getProfiles());
        dispatch(deleteProfileSuccess(response.data._id));
      })
      .catch(error => {
        dispatch(deleteProfileFail(error));
      });
  };
};

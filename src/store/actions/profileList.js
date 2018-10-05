import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";
export const getProfileListsSuccess = ProfileList => {
  return {
    type: actionTypes.GET_PROFILE_LIST_SUCCESS,
    ProfileList: ProfileList
  };
};

export const getProfileArraysSuccess = ProfileArray => {
  return {
    type: actionTypes.GET_PROFILE_ARRAY_SUCCESS,
    ProfileArray: ProfileArray
  };
};

export const getProfileListsFail = error => {
  return {
    type: actionTypes.GET_PROFILE_LIST_FAIL,
    error: error
  };
};

export const getProfileList = () => {
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/profileList`)
      .then(response => {
        let ProfileList = [];
        let dataList = response.data[0].profiles;
        dataList.forEach(data => {
          ProfileList.push({ label: data, value: data });
        });
        dispatch(getProfileListsSuccess(ProfileList));
      })
      .catch(error => {
        dispatch(getProfileListsFail(error));
      });
  };
};

export const getProfileArray = () => {
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/profileList`)
      .then(response => {
        let ProfileArray = [];
        ProfileArray = response.data[0].profiles;
        ProfileArray.push("Speaker");
        console.log("ProfileArrayyyy", ProfileArray);
        dispatch(getProfileArraysSuccess(ProfileArray));
      })
      .catch(error => {
        //dispatch(getProfileArraysFail(error));
      });
  };
};

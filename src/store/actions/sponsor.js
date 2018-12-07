import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";
export const storeSponsors = (sponsorData, sponsorList) => {
  return {
    type: actionTypes.GET_SPONSORS,
    sponsors: sponsorData,
    sponsorList: sponsorList
  };
};
export const storeCurrentSponsor = currentSponsor => {
  return {
    type: actionTypes.STORE_CURRENT_SPONSOR,
    currentSponsor: currentSponsor
  };
};
export const getSponsorsError = () => {
  return {
    type: actionTypes.GET_SPONSOR_ERROR
  };
};
export const creatEditSponsorsError = () => {
  return {
    type: actionTypes.CREATE_EDIT_SPONSOR_ERROR
  };
};

export const deleteSponsorsError = () => {
  return {
    type: actionTypes.DELETE_SPONSOR_ERROR
  };
};
export const getSponsors = () => {
  let sponsorData = [];
  let sponsorList = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/sponsor`)
      .then(response => {
        sponsorData = response.data;
        sponsorData.forEach(sponsor => {
          sponsorList.push({ label: sponsor.name, value: sponsor._id });
          if (sponsor.event !== null) {
            sponsor.eventName = sponsor.event.eventName;
          }
        });
        dispatch(storeSponsors(sponsorData, sponsorList));
      })
      .catch(error => {
        dispatch(getSponsorsError());
      });
  };
};
export const getSponsorById = id => {
  let sponsorData = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/sponsor/${id}`)
      .then(response => {
        sponsorData = response.data;
        dispatch(storeCurrentSponsor(sponsorData));
      })
      .catch(error => {
        dispatch(getSponsorsError());
      });
  };
};
export const createSponsor = sponsor => {
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/sponsor`, sponsor)
      .then(response => {
        dispatch(getSponsors());
      })
      .catch(error => {
        dispatch(creatEditSponsorsError());
      });
  };
};

export const editSponsor = (id, sponsor) => {
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/sponsor/${id}`, sponsor)
      .then(response => {
        dispatch(getSponsors());
      })
      .catch(error => {
        dispatch(creatEditSponsorsError());
      });
  };
};

export const deleteSponsor = id => {
  return dispatch => {
    axios
      .delete(`${AppConfig.serverURL}/api/sponsor/${id}`)
      .then(response => {
        dispatch(getSponsors());
      })
      .catch(error => {
        dispatch(deleteSponsorsError());
      });
  };
};

export const getSponsorsForEvent = eventId => {
  let sponsorData = [];
  let sponsorList = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/sponsor/event/${eventId}`)
      .then(response => {
        sponsorData = response.data;
        sponsorData.forEach(sponsor => {
          sponsorList.push({ label: sponsor.name, value: sponsor._id });
          if (sponsor.event !== null) {
            sponsor.eventName = sponsor.event.eventName;
          }
        });
        dispatch(storeSponsors(sponsorData, sponsorList));
      })
      .catch(error => {
        dispatch(getSponsorsError());
      });
  };
};

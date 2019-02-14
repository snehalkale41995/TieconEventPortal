import * as actionTypes from "./actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";

export const storeAboutUsInfo = aboutUs => {
  return {
    type: actionTypes.STORE_ABOUT_US,
    aboutUs: aboutUs
  };
};
export const storeAboutEternusInfo = aboutEternus => {
  return {
    type: actionTypes.STORE_ABOUT_ETERNUS,
    aboutEternus: aboutEternus
  };
};
export const storeHelpDeskInfo = helpDesk => {
  return {
    type: actionTypes.STORE_HELPDESK_DETAILS,
    helpDesk: helpDesk
  };
};
export const storeLocationInfo = eventLocation => {
  return {
    type: actionTypes.STORE_EVENT_LOCATION,
    eventLocation: eventLocation
  };
};
export const logStaticPageError = () => {
  return {
    type: actionTypes.LOG_STATIC_PAGE_ERROR,
    error: "Oops...Something went wrong.Please try again..."
  };
};
//about us GET_ABOUTUS_EVENT
export const getAboutUsError = () => {
  return {
    type: actionTypes.GET_ABOUTUS_ERROR
  };
};
export const creatEditAboutUsError = () => {
  return {
    type: actionTypes.CREATE_EDIT_ABOUTUS_ERROR
  };
};

//about Eternus
export const getAboutEternusError = () => {
  return {
    type: actionTypes.GET_ABOUTETERNUS_ERROR
  };
};
export const creatEditAboutEternusError = () => {
  return {
    type: actionTypes.CREATE_EDIT_ABOUTETERNUS_ERROR
  };
};

//HELPDESK
export const getHelpDeskError = () => {
  return {
    type: actionTypes.GET_HELPDESK_ERROR
  };
};
export const creatEditHelpDeskError = () => {
  return {
    type: actionTypes.CREATE_EDIT_HELPDESK_ERROR
  };
};

//location
export const getLocationError = () => {
  return {
    type: actionTypes.GET_LOCATION_ERROR
  };
};
export const creatEditLocationError = () => {
  return {
    type: actionTypes.CREATE_EDIT_LOCATION_ERROR
  };
};

///about Us
export const getAboutUsForEvent = id => {
  let aboutUs = {};
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/aboutUs/eventId/${id}`)
      .then(response => {
        if (response.data.length !== 0) {
          aboutUs = response.data[0];
        }
        dispatch(storeAboutUsInfo(aboutUs));
      })
      .catch(error => {
        dispatch(getAboutUsError());
      });
  };
};

export const createAboutUsInfo = aboutUs => {
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/aboutUs`, aboutUs)
      .then(response => {
        dispatch(storeAboutUsInfo(response.data));
      })
      .catch(error => {
        dispatch(creatEditAboutUsError());
      });
  };
};
export const editAboutUsInfo = (id, aboutUs) => {
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/aboutUs/${id}`, aboutUs)
      .then(response => {
        dispatch(storeAboutUsInfo(response.data));
      })
      .catch(error => {
        dispatch(creatEditAboutUsError());
      });
  };
};

///about Eternus
export const getAboutEternusInfo = () => {
  let aboutEternus = {};
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/aboutEternus`)
      .then(response => {
        if (response.data.length !== 0) {
          aboutEternus = response.data[0];
        }
        dispatch(storeAboutEternusInfo(aboutEternus));
      })
      .catch(error => {
        dispatch(getAboutEternusError());
      });
  };
};
export const createAboutEternusInfo = aboutEternus => {
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/aboutEternus`, aboutEternus)
      .then(response => {
        dispatch(storeAboutEternusInfo(response.data));
      })
      .catch(error => {
        dispatch(creatEditAboutEternusError());
      });
  };
};
export const editAboutEternusInfo = (id, aboutEternus) => {
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/aboutEternus/${id}`, aboutEternus)
      .then(response => {
        dispatch(storeAboutEternusInfo(response.data));
      })
      .catch(error => {
        dispatch(creatEditAboutEternusError());
      });
  };
};

///HELP DESK
export const createHelpDeskInfo = helpDesk => {
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/helpdesk`, helpDesk)
      .then(response => {
        dispatch(storeHelpDeskInfo(response.data));
      })
      .catch(error => {
        dispatch(creatEditHelpDeskError());
      });
  };
};
export const editHelpDeskInfo = (id, helpDesk) => {
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/helpdesk/${id}`, helpDesk)
      .then(response => {
        dispatch(storeHelpDeskInfo(response.data));
      })
      .catch(error => {
        dispatch(creatEditHelpDeskError());
      });
  };
};
export const getHelpDeskForEvent = id => {
  let helpDesk = {};
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/helpdesk/eventId/${id}`)
      .then(response => {
        if (response.data.length !== 0) {
          helpDesk = response.data[0];
        }
        dispatch(storeHelpDeskInfo(helpDesk));
      })
      .catch(error => {
        dispatch(getHelpDeskError());
      });
  };
};

///eventLocation
export const getLocationForEvent = id => {
  let eventLocation = {};
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/location/eventId/${id}`)
      .then(response => {
        if (response.data.length !== 0) {
          eventLocation = response.data[0];
        }
        dispatch(storeLocationInfo(eventLocation));
      })
      .catch(error => {
        dispatch(getLocationError());
      });
  };
};

export const createEventLocation = eventLocation => {
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/location`, eventLocation)
      .then(response => {
        dispatch(storeLocationInfo(response.data));
      })
      .catch(error => {
        dispatch(creatEditLocationError());
      });
  };
};
export const editEventLocation = (id, eventLocation) => {
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/location/${id}`, eventLocation)
      .then(response => {
        dispatch(storeLocationInfo(response.data));
      })
      .catch(error => {
        dispatch(creatEditLocationError());
      });
  };
};

import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";

export const createSpeakerSuccess = () => {
  return {
    type: actionTypes.CREATE_SPEAKER_SUCCESS
  };
};

export const createSpeakerFail = (createError, status) => {
  return {
    type: actionTypes.CREATE_SPEAKER_FAIL,
    createError: createError,
    statusCode: status
  };
};

export const updateSpeakerFail = error => {
  return {
    type: actionTypes.UPDATE_SPEAKER_FAIL,
    error: error
  };
};

export const updateSpeakerSuccess = () => {
  return {
    type: actionTypes.UPDATE_SPEAKER_SUCCESS
  };
};
export const deleteSpeakerFail = error => {
  return {
    type: actionTypes.DELETTE_SPEAKER_FAIL,
    error: error
  };
};

export const deleteSpeakerSuccess = () => {
  return {
    type: actionTypes.DELETE_SPEAKER_SUCCESS
  };
};

export const logRegistrationError = () => {
  return {
    type: actionTypes.LOG_REGISTRATION_ERROR,
    error: "Oops...Something went wrong.Please try again..."
  };
};

export const storeSpeakers = speakers => {
  return {
    type: actionTypes.GET_SPEAKER_LIST,
    speakerList: speakers
  };
};

export const storeSpeakerData = speakerData => {
  return {
    type: actionTypes.GET_SPEAKER_DATA,
    speakerData: speakerData
  };
};

export const getSpeakers = () => {
  let speakers = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/speaker`)
      .then(response => {
        speakers = response.data;
        speakers.forEach(speaker => {
          if (speaker.event !== null) {
            speaker.eventName = speaker.event.eventName;
          }
        });
        dispatch(storeSpeakers(speakers));
      })
      .catch(error => {
        dispatch(logRegistrationError());
      });
  };
};

export const getSpeakersForEvent = eventId => {
  let speakers = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/speaker/event/${eventId}`)
      .then(response => {
        speakers = response.data;
        speakers.forEach(speaker => {
          if (speaker.event !== null) {
            speaker.eventName = speaker.event.eventName;
          }
        });
        dispatch(storeSpeakers(speakers));
      })
      .catch(error => {
        dispatch(logRegistrationError());
      });
  };
};

export const getSpeakerData = id => {
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/speaker/${id}`)
      .then(response => {
        dispatch(storeSpeakerData(response.data));
      })
      .catch(error => {
        dispatch(logRegistrationError());
      });
  };
};
export const editSpeakerData = (id, image, oldUrl, speaker) => {
  let data = new FormData();
  for (var key in speaker) {
    if (key != "profileImageURL") data.append(key, speaker[key]);
  }

  if (image.name) {
    data.append("profileImageURL", image);
  } else {
    data.append("profileImageURL", oldUrl);
  }
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/speaker/new/${id}`, data)
      .then(response => {
        dispatch(getSpeakers());
        dispatch(updateSpeakerSuccess());
      })
      .catch(error => {
        dispatch(logRegistrationError());
        dispatch(updateSpeakerFail());
      });
  };
};
// export const editSpeakerData = (id, speaker) => {
//   return dispatch => {
//     axios
//       .put(`${AppConfig.serverURL}/api/speaker/${id}`, speaker)
//       .then(response => {
//         dispatch(getSpeakers());
//         dispatch(updateSpeakerSuccess());
//       })
//       .catch(error => {
//         dispatch(logRegistrationError());
//         dispatch(updateSpeakerFail());
//       });
//   };
// };
export const createSpeaker = (speaker, image, attendeeCount) => {
  let id = attendeeCount._id;
  let attendeeCountObj = {
    attendeeCount: attendeeCount.attendeeCount,
    totalCount: attendeeCount.totalCount + 1,
    speakerCount: attendeeCount.speakerCount + 1,
    event: attendeeCount.event
  };
  speaker["attendeeCount"] = attendeeCount.speakerCount + 1;
  speaker["attendeeLabel"] = "SPE";

  let data = new FormData();
  for (var key in speaker) {
    if (key != "profileImageURL") data.append(key, speaker[key]);
  }
  data.append("isEmail", true);
  data.append("profileImageURL", image);

  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/speaker/new`, data)
      .then(response => {
        axios
          .put(
            `${AppConfig.serverURL}/api/attendeeCount/${id}`,
            attendeeCountObj
          )
          .then(response => {
            dispatch(getSpeakers());
            dispatch(createSpeakerSuccess());
          });
      })
      .catch(error => {
        dispatch(createSpeakerFail(error.response.data, error.response.status));
        //dispatch(logRegistrationError());
      });
    // axios({
    //   method: "post",
    //   url: AppConfig.serverURL + "/api/speaker/new",
    //   data: data,
    //   config: { headers: { "Content-Type": "multipart/form-data" } }
    // })
    //   .then(function(response) {
    //     axios
    //       .put(
    //         `${AppConfig.serverURL}/api/attendeeCount/${id}`,
    //         attendeeCountObj
    //       )
    //       .then(response => {
    //         dispatch(getSpeakers());
    //         dispatch(createSpeakerSuccess());
    //       });
    //   })
    //   .catch(error => {
    //     dispatch(createSpeakerFail(error.response.data, error.response.status));
    //     //dispatch(logRegistrationError());
    //   });
  };
};
// export const createSpeaker = (speaker, attendeeCount) => {
//   let id = attendeeCount._id;
//   let attendeeCountObj = {
//     attendeeCount: attendeeCount.attendeeCount,
//     totalCount: attendeeCount.totalCount + 1,
//     speakerCount: attendeeCount.speakerCount + 1,
//     event: attendeeCount.event
//   };
//   speaker["attendeeCount"] = attendeeCount.speakerCount + 1;
//   speaker["attendeeLabel"] = "SPE";
//   return dispatch => {
//     axios
//       .post(`${AppConfig.serverURL}/api/speaker`, speaker)
//       .then(response => {
//         axios
//           .put(
//             `${AppConfig.serverURL}/api/attendeeCount/${id}`,
//             attendeeCountObj
//           )
//           .then(response => {
//             dispatch(getSpeakers());
//             dispatch(createSpeakerSuccess());
//           });
//       })
//       .catch(error => {
//         dispatch(createSpeakerFail(error.response.data, error.response.status));
//         //dispatch(logRegistrationError());
//       });
//   };
// };
export const sendEmailToSpeaker = speaker => {
  if (speaker.isEmail === "false") {
    speaker = { ...speaker, isEmail: true };
    return dispatch => {
      axios
        .post(`${AppConfig.serverURL}/api/speaker/inform`, speaker)
        .then(response => {
          dispatch(getSpeakers());
        })
        .catch(error => {
          // console.log(error);
        });
    };
  } else {
    return dispatch => {
      // console.log(speaker);
    };
  }
};

export const deleteSpeaker = id => {
  return dispatch => {
    axios
      .delete(`${AppConfig.serverURL}/api/speaker/${id}`)
      .then(response => {
        dispatch(getSpeakers());
        dispatch(deleteSpeakerSuccess());
      })
      .catch(error => {
        dispatch(logRegistrationError());
        dispatch(deleteSpeakerFail());
      });
  };
};

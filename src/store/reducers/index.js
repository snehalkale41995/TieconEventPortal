import { combineReducers } from "redux";
import eventReducer from "./event";
import sessionReducer from "./session";
import roomReducer from "./room";
import registrationReducer from "./registration";
import speakerReducer from "./speaker";
import attendeeCountReducer from "./attendeeCount";
import authReducer from "./auth";
import formReducer from "./questionForms";
import attendanceReducer from "./attendance";
import staticPageReducer from "./staticPages";
import sponsorReducer from "./sponsor";
import profileListReducer from "./profileList";
import appThemeReducer from "./appTheme";
import bulkUploadReducer from "./bulkUpload";

const rootReducer = combineReducers({
  event: eventReducer,
  session: sessionReducer,
  room: roomReducer,
  registration: registrationReducer,
  attendeeCount: attendeeCountReducer,
  speaker: speakerReducer,
  auth: authReducer,
  questionForm: formReducer,
  attendance: attendanceReducer,
  staticPages: staticPageReducer,
  sponsor: sponsorReducer,
  profileList: profileListReducer,
  appTheme: appThemeReducer,
  bulkUpload : bulkUploadReducer
});

export default rootReducer;

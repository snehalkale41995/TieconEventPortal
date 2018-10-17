import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Dashboard from "../../views/Dashboard/";
import Events from "../../views/Events/";
import Rooms from "../../views/Rooms/Rooms";
import RoomsModule from "../../views/Rooms/RoomsModule";
import Registration from "../../views/Registration/Registration";
import AttendanceList from "../../views/Attendance/AttendanceList";
import DynamicForms from "../../views/DynamicForms/DynamicForms";
import QuestionForms from "../../views/DynamicForms/QuestionForms";
import RegistrationModule from "../../views/Registration/RegistrationModule";
import Speakers from "../../views/Speakers/Speakers";
import Sessions from "../../views/Sessions/SessionForm";
import AboutUs from "../../views/StaticPages/AboutUs";
import AboutEternus from "../../views/StaticPages/AboutEternus";
import HelpDesk from "../../views/StaticPages/HelpDesk";
import EventLocation from "../../views/StaticPages/Location";
import Sponsors from "../../views/Sponsors/Sponsors";
import EventReports from "../../views/Reports/EventReports";
import SessionReports from "../../views/Reports/SessionReports";
import AttendeeReports from "../../views/Reports/AttendeeReports";
import Layout from "../../components/Layout/";
import Logout from "../Authentication/Logout";
import Login from "../Authentication/Login";
import AppTheme from "../../views/AppTheme/AppTheme";
import { connect } from "react-redux";

let routes;
class App extends Component {
  render() {
    let user = localStorage.getItem("user");
    //if(this.props.email !== "") {
    if (user) {
      routes = (
        <Layout {...this.props}>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/events" component={Events} />
            <Route path="/sessions" component={Sessions} />
            <Route path="/rooms" component={Rooms} />
            <Route path="/roomsList" component={RoomsModule} />
            {/* <Route path="/registration" component={Registration} /> */}
            <Route path="/speakers" component={Speakers} />
            <Route path="/registrationList" component={RegistrationModule} />
            <Route path="/staticPages/aboutUs" component={AboutUs} />
            <Route path="/staticPages/aboutEternus" component={AboutEternus} />
            <Route
              path="/staticPages/eventLocation"
              component={EventLocation}
            />
            <Route path="/staticPages/helpDesk" component={HelpDesk} />
            <Route path="/attendance" component={AttendanceList} />
            <Route path="/reports/eventReports" component={EventReports} />
            <Route path="/reports/sessionReports" component={SessionReports} />
            <Route
              path="/reports/attendeeReports"
              component={AttendeeReports}
            />
            <Route path="/dynamicForms" component={DynamicForms} />
            <Route path="/questionForms" component={QuestionForms} />
            <Route path="/sponsors" component={Sponsors} />
            <Route path="/logout" component={Logout} />
            <Route path="/appTheme" component={AppTheme} />
            <Redirect from="/" to="/dashboard" />
            <Redirect to="/" />
          </Switch>
        </Layout>
      );
    } else {
      routes = (
        <Switch>
          <Route path="/login" component={Login} />
          <Redirect from="/" to="/login" />
          <Redirect to="/" />
        </Switch>
      );
    }
    return <div>{routes}</div>;
  }
}
const mapStateToProps = state => {
  return {
    email: state.auth.email
  };
};
export default connect(mapStateToProps)(App);

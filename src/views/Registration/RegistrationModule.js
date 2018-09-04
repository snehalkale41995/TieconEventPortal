import RegistrationList from "./RegistrationList.js";
import Registration from "../Registration/Registration.js";
import React, { Component } from "react";
import { Route } from "react-router-dom";

class RegistrationModule extends Component {
  render() {
    return (
      <div>
        <Route
          exact
          path={this.props.match.path}
          component={RegistrationList}
        />
        <Route
          path={`${this.props.match.path}/registration/:id?`}
          component={Registration}
        />
      </div>
    );
  }
}

export default RegistrationModule;

import React, { Component } from "react";
import { Route } from "react-router-dom";
import ProfileList from "./ProfileList";
import ProfileForm from "./ProfileForm";

class Profiles extends Component {
  render() {
    return (
      <div>
        <Route exact path={this.props.match.path} component={ProfileList} />
        <Route
          path={`${this.props.match.path}/profileForm/:id?`}
          component={ProfileForm}
        />
      </div>
    );
  }
}

export default Profiles;

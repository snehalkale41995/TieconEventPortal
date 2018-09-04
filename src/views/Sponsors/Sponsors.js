import SponsorsList from "./SponsorsList.js";
import SponsorForm from "./SponsorForm.js";
import React, { Component } from "react";
import { Route } from "react-router-dom";

class Sponsors extends Component {
  render() {
    return (
      <div>
        <Route exact path={this.props.match.path} component={SponsorsList} />
        <Route
          path={`${this.props.match.path}/sponsorForm/:id?`}
          component={SponsorForm}
        />
      </div>
    );
  }
}
export default Sponsors;

import React, { Component } from "react";
import { Route } from "react-router-dom";
import EventList from "./EventList";
import EventForm from "./EventForm";

class Events extends Component {
  render() {
    return (
      <div>
        <Route exact path={this.props.match.path} component={EventList} />
        <Route
          path={`${this.props.match.path}/EventForm/:id?`}
          component={EventForm}
        />
      </div>
    );
  }
}

export default Events;

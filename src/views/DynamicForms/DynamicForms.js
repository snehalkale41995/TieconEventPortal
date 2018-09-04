import FormList from "./FormList.js";
import QuestionForms from "./QuestionForms.js";
import RenderForm from "./RenderForm.js";
import React, { Component } from "react";
import { Route } from "react-router-dom";

class DynamicForms extends Component {
  render() {
    return (
      <div>
        <Route exact path={this.props.match.path} component={FormList} />
        <Route
          path={`${this.props.match.path}/questionForms/:id?`}
          component={QuestionForms}
        />
        <Route
          path={`${this.props.match.path}/renderForm/:id?`}
          component={RenderForm}
        />
      </div>
    );
  }
}

export default DynamicForms;

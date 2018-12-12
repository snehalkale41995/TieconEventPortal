import React, { Component } from "react";
import { connect } from "react-redux";
import CardLayout from "../../components/CardLayout/";
import { Input, FormGroup, Col, Label } from "reactstrap";

let formLayout;
class RenderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: [],
      eventName: "",
      sessionName: "",
      formType: ""
    };
  }

  componentDidMount() {
    if (this.props.currentFormData.length !== 0) {
      this.setState({
        formData: this.props.currentFormData.formData
      });
    }
  }

  displayForm() {
    formLayout = this.state.formData.map((que, id) => {
      return (
        <div key={id}>
          <FormGroup row>
            <Col xs="12">
              <h4>
                {id + 1}) : {que.question}
              </h4>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col xs="12">{this.displayAnswerFields(que)}</Col>
          </FormGroup>
        </div>
      );
    });
    return formLayout;
  }

  displayAnswerFields(que) {
    if (que.inputType === "Text") {
      return (
        <Col md="6">
          <Input type="text" />
        </Col>
      );
    } else if (que.inputType === "Check Box") {
      return que.options.map((opt, id) => {
        return (
          <FormGroup key={id} check inline>
            <Label style={{ fontSize: 20 }}>
              <Input type="checkbox" value={opt.value} /> {opt.value}
            </Label>
          </FormGroup>
        );
      });
    } else if (que.inputType === "Radio Button") {
      return que.options.map((opt, id) => {
        return (
          <FormGroup key={id} check inline>
            <Input
              className="form-check-input"
              type="radio"
              name="inline-radios"
              value={opt.value}
            />
            <Label
              className="form-check-label"
              style={{ fontSize: 20 }}
              check
              htmlFor="inline-radio1"
            >
              {opt.value}
            </Label>
          </FormGroup>
        );
      });
    } else {
      return null;
    }
  }

  render() {
    return (
      <CardLayout name="Forms List">
        {this.state.formData.length !== 0 ? this.displayForm() : null}
      </CardLayout>
    );
  }
}
const mapStateToProps = state => {
  return {
    currentFormData: state.questionForm.formData
  };
};
export default connect(mapStateToProps)(RenderForm);

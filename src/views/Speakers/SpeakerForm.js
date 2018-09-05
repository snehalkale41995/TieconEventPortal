import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { FormGroup, Col, Button } from "reactstrap";
import InputElement from "../../components/Input/";
import CardLayout from "../../components/CardLayout/";
import Select from "react-select";
import "react-select/dist/react-select.css";
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class SpeakerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Speaker: {
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        briefInfo: "",
        profileImageURL: "",
        event: "",
        roleName: "Speaker"
      },
      firstNameRequired: false,
      lastNameRequired: false,
      emailRequired: false,
      contactRequired: false,
      eventRequired: false,
      editSpeaker: false,
      inValidContact: false,
      inValidEmail: false,
      invalidProfileUrl: false
    };
  }
  componentDidMount() {
    this.props.getEvents();
    let isEmpty = !Object.keys(this.props.speakerData).length;
    if (this.props.match.params.id !== undefined && !isEmpty) {
      let Speaker = _.pick(this.props.speakerData, [
        "firstName",
        "lastName",
        "email",
        "contact",
        "briefInfo",
        "profileImageURL",
        "roleName"
      ]);
      Speaker.event = this.props.speakerData.event._id;
      Speaker._id = this.props.speakerData._id;

      this.setState({
        Speaker: Speaker,
        editSpeaker: true
      });
    }
  }

  onChangeInput(event) {
    const { Speaker } = { ...this.state };
    Speaker[event.target.name] = event.target.value;
    this.setState({
      Speaker: Speaker,
      firstNameRequired: false,
      lastNameRequired: false,
      emailRequired: false,
      contactRequired: false,
      eventRequired: false,
      inValidContact: false,
      inValidEmail: false,
      invalidProfileUrl: false
    });
  }

  Toaster(compRef, successFlag, actionName) {
    let errorMessage = compRef.props.createError;
    if (successFlag) {
      toast.success("Speaker " + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      setTimeout(() => {
        compRef.redirectFunction();
      }, 1000);
    } else {
      errorMessage
        ? toast.error("Speaker Already Exists", {
            position: toast.POSITION.BOTTOM_RIGHT
          })
        : toast.error("Something Went wrong", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
    }
  }

  redirectFunction() {
    this.props.history.push("/speakers");
  }

  onSubmit() {
    let speaker = { ...this.state.Speaker };
    let attendeeCount = this.props.attendeeCount;
    let validContact;
    let validEmail;
    let invalidProfileUrl = false;
    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (speaker.profileImageURL !== "") {
      if (!re.test(speaker.profileImageURL)) {
        invalidProfileUrl = true;
      }
    }
    if (speaker.email) {
      validEmail = speaker.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    }
    if (speaker.contact) {
      validContact = speaker.contact.toString().length === 10;
    }
    if (
      validContact &&
      validEmail &&
      speaker.firstName &&
      speaker.lastName &&
      speaker.email &&
      speaker.contact &&
      speaker.event &&
      !invalidProfileUrl
    ) {
      let editedSpeaker = _.pick(speaker, [
        "firstName",
        "lastName",
        "email",
        "contact",
        "briefInfo",
        "profileImageURL",
        "event",
        "roleName"
      ]);

      this.state.editSpeaker
        ? this.updateSpeaker(speaker._id, editedSpeaker)
        : this.createSpeaker(speaker, attendeeCount);
    } else {
      !speaker.firstName ? this.setState({ firstNameRequired: true }) : null;
      !speaker.lastName ? this.setState({ lastNameRequired: true }) : null;
      !speaker.event ? this.setState({ eventRequired: true }) : null;
      !validContact && speaker.contact
        ? this.setState({ inValidContact: true })
        : null;
      validEmail && speaker.email
        ? null
        : this.setState({ inValidEmail: true });
      !speaker.email
        ? this.setState({ emailRequired: true, inValidEmail: false })
        : null;
      !speaker.contact
        ? this.setState({ contactRequired: true, inValidContact: false })
        : null;
      invalidProfileUrl ? this.setState({ invalidProfileUrl: true }) : null;
    }
  }

  updateSpeaker(id, editedSpeaker) {
    let compRef = this;
    this.props.editSpeakerData(id, editedSpeaker);
    setTimeout(() => {
      let speakerUpdated = this.props.speakerUpdated;
      compRef.Toaster(compRef, speakerUpdated, "Updated");
    }, 2000);
  }

  createSpeaker(speaker, attendeeCount) {
    let compRef = this;
    this.props.createSpeaker(speaker, attendeeCount);
    setTimeout(() => {
      let speakerCreated = this.props.speakerCreated;
      compRef.Toaster(compRef, speakerCreated, "Created");
    }, 2000);
  }
  onReset() {
    let Speaker = {
      firstName: "",
      lastName: "",
      email: "",
      contact: "",
      briefInfo: "",
      profileImageURL: "",
      event: ""
    };
    this.setState({
      Speaker: Speaker,
      firstNameRequired: false,
      lastNameRequired: false,
      emailRequired: false,
      contactRequired: false,
      eventRequired: false,
      inValidContact: false,
      inValidEmail: false,
      invalidProfileUrl: false
    });
  }

  handleEventSelectChange(value) {
    this.props.getAttendeeCountForEvent(value);
    if (value !== null) {
      let Speaker = { ...this.state.Speaker };
      Speaker.event = value;
      this.setState({ Speaker: Speaker, eventRequired: false });
    } else {
      let Speaker = { ...this.state.Speaker };
      Speaker.event = "";
      this.setState({ Speaker: Speaker, eventRequired: false });
    }
  }

  getSpeakerDetails() {
    let Speaker = { ...this.state.Speaker };
    Speaker = this.props.speakerData;
    this.setState({
      Speaker: Speaker
    });
  }
  render() {
    const { Speaker } = { ...this.state };
    const eventOptions = this.props.eventList;
    if (this.state.editSpeaker)
      this.buttons = (
        <Button
          type="submit"
          size="md"
          color="success"
          onClick={this.onSubmit.bind(this)}
        >
          Update
        </Button>
      );
    else
      this.buttons = (
        <Button
          type="submit"
          size="md"
          color="success"
          onClick={this.onSubmit.bind(this)}
        >
          Submit
        </Button>
      );
    return (
      <CardLayout name="Speaker">
        <FormGroup row>
          <Col xs="12" md="6">
            <InputElement
              type="text"
              placeholder="First name"
              name="firstName"
              icon="icon-user"
              maxLength="20"
              value={Speaker.firstName}
              required={this.state.firstNameRequired}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <InputElement
              type="text"
              placeholder="Last name"
              name="lastName"
              icon="icon-user"
              maxLength="20"
              value={Speaker.lastName}
              required={this.state.lastNameRequired}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="6">
            <InputElement
              type="email"
              placeholder="Email"
              name="email"
              icon="icon-envelope"
              value={Speaker.email}
              disabled={this.state.editSpeaker}
              inValid={this.state.inValidEmail}
              required={this.state.emailRequired}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <InputElement
              type="number"
              placeholder="Contact number"
              name="contact"
              icon="icon-phone"
              value={Speaker.contact}
              maxLength="10"
              inValid={this.state.inValidContact}
              required={this.state.contactRequired}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="6">
            <Select
              placeholder="Select event"
              value={Speaker.event}
              options={eventOptions}
              simpleValue
              onChange={this.handleEventSelectChange.bind(this)}
            />
            {this.state.eventRequired ? (
              <div
                style={{ color: "red", marginTop: 0 }}
                className="help-block"
              >
                *Please select event
              </div>
            ) : null}
          </Col>
          <Col md="6">
            <InputElement
              type="text"
              placeholder="Brief info"
              name="briefInfo"
              icon="icon-info"
              maxLength="45"
              value={Speaker.briefInfo}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="6">
            <InputElement
              type="text"
              placeholder="Profile image URL"
              name="profileImageURL"
              icon="icon-link"
              inValid={this.state.invalidProfileUrl}
              value={Speaker.profileImageURL}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="3">
            {this.buttons}
          </Col>
          <Col md="3">
            <Button
              type="button"
              size="md"
              color="primary"
              style={{ marginLeft: -182 }}
              onClick={() => this.onReset()}
            >
              Reset
            </Button>
          </Col>
          <Col md="3">
            <Button
              type="button"
              size="md"
              color="danger"
              style={{ marginLeft: -370 }}
              onClick={() => this.redirectFunction()}
            >
              Cancel
            </Button>
            <ToastContainer autoClose={2000} />
          </Col>
          {/* <Col md="6">
            <ToastContainer autoClose={2000} />
            <div style={{ color: "red" }} className="help-block">
              {this.props.speakerError}
            </div>
          </Col> */}
        </FormGroup>
      </CardLayout>
    );
  }
}
const mapStateToProps = state => {
  return {
    speakerError: state.speaker.error,
    speakerData: state.speaker.speakerData,
    eventList: state.event.eventList,
    attendeeCount: state.attendeeCount.attendeeCount,
    speakerCreated: state.speaker.speakerCreated,
    speakerUpdated: state.speaker.speakerUpdated,
    createError: state.speaker.createError
  };
};
const mapDispatchToProps = dispatch => {
  return {
    createSpeaker: (speaker, attendeeCount) =>
      dispatch(actions.createSpeaker(speaker, attendeeCount)),
    getSpeakerData: id => dispatch(actions.getSpeakerData(id)),
    editSpeakerData: (id, speaker) =>
      dispatch(actions.editSpeakerData(id, speaker)),
    getAttendeeCountForEvent: id =>
      dispatch(actions.getAttendeeCountForEvent(id)),
    getEvents: () => dispatch(actions.getEvents())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeakerForm);

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
import Loader from "../../components/Loader/Loader";
import RegistrationModal from "../../components/Modal/RegistrationModal";
class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Registration: {
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        profileName: "",
        briefInfo: "",
        profileImageURL: "",
        event: "",
        roleName: "",
        password: ""
      },
      firstNameRequired: false,
      lastNameRequired: false,
      emailRequired: false,
      contactRequired: false,
      eventRequired: false,
      editAttendee: false,
      inValidContact: false,
      profileRequired: false,
      inValidEmail: false,
      invalidProfileUrl: false,
      displayPasswordFlag: false
    };
  }
  componentDidMount() {
    this.props.getEvents();
    this.props.getProfileList();
    if (this.props.match.params.id !== undefined) {
      let empty = !Object.keys(this.props.attendeeData).length;
      if (!empty) {
        let Attendee = _.pick(this.props.attendeeData, [
          "firstName",
          "lastName",
          "email",
          "contact",
          "briefInfo",
          "profileImageURL"
        ]);
        this.props.attendeeData.event
          ? (Attendee.event = this.props.attendeeData.event._id)
          : null;
        Attendee.profileName = this.props.attendeeData.profileName;
        Attendee._id = this.props.attendeeData._id;
        this.setState({
          Registration: Attendee,
          editAttendee: true
        });
      } else {
        this.setState({ loading: true });
        this.props.getAttendeeById(this.props.match.params.id);
        let compRef = this;
        setTimeout(function() {
          let Attendee = _.pick(compRef.props.attendeeData, [
            "firstName",
            "lastName",
            "email",
            "contact",
            "briefInfo",
            "profileImageURL",
            "event",
            "profileName",
            "_id"
          ]);
          let Empty = !Object.keys(Attendee).length;
          if (Empty) {
            compRef.props.history.push("/sponsors");
          } else {
            compRef.setState({
              Registration: Attendee,
              editAttendee: true,
              loading: false
            });
          }
        }, 1000);
      }
    }
  }
  onChangeInput(event) {
    const { Registration } = { ...this.state };
    Registration[event.target.name] = event.target.value;
    this.setState({
      Registration: Registration,
      firstNameRequired: false,
      lastNameRequired: false,
      emailRequired: false,
      contactRequired: false,
      eventRequired: false,
      inValidContact: false,
      profileRequired: false,
      inValidEmail: false,
      invalidProfileUrl: false
    });
  }

  toggleFunction() {
    this.setState({ displayPasswordFlag: false });
  }
  onSubmit() {
    let compRef = this;
    let attendeeCount = this.props.attendeeCount;
    let attendee = { ...this.state.Registration };
    let password = "ES" + Math.floor(1000 + Math.random() * 9000);
    attendee.password = password;
    this.setState({ passwordModal: password });
    this.setState({ emailModal: attendee.email });
    let validContact;
    let validEmail;
    let invalidProfileUrl = false;
    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (attendee.profileImageURL !== "") {
      if (!re.test(attendee.profileImageURL)) {
        invalidProfileUrl = true;
      }
    }
    if (attendee.email) {
      validEmail = attendee.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    }
    if (attendee.contact) {
      validContact = attendee.contact.toString().length === 10;
    }

    if (
      validContact &&
      validEmail &&
      attendee.firstName &&
      attendee.lastName &&
      attendee.email &&
      attendee.contact &&
      attendee.event &&
      attendee.profileName &&
      !invalidProfileUrl
    ) {
      let editedAttendee = _.pick(attendee, [
        "firstName",
        "lastName",
        "email",
        "contact",
        "briefInfo",
        "profileImageURL",
        "event",
        "profileName",
        "roleName"
      ]);
      this.state.editAttendee
        ? this.props.editAttendeeData(attendee._id, editedAttendee)
        : this.props.createAttendee(attendee, attendeeCount);
      this.setState({ loading: true });
      setTimeout(() => {
        let createEditError = compRef.props.createEditError;
        let errorMessage = compRef.props.creatError;
        let status = "";
        compRef.state.editAttendee
          ? (status = "Updated")
          : (status = "Created");
        compRef.Toaster(compRef, createEditError, status, errorMessage);
      }, 1000);
    } else {
      !attendee.firstName ? this.setState({ firstNameRequired: true }) : null;
      !attendee.lastName ? this.setState({ lastNameRequired: true }) : null;
      !attendee.event ? this.setState({ eventRequired: true }) : null;
      !validContact && attendee.contact
        ? this.setState({ inValidContact: true })
        : null;
      !attendee.profileName ? this.setState({ profileRequired: true }) : null;
      validEmail && attendee.email
        ? null
        : this.setState({ inValidEmail: true });
      !attendee.email
        ? this.setState({ emailRequired: true, inValidEmail: false })
        : null;
      !attendee.contact
        ? this.setState({ contactRequired: true, inValidContact: false })
        : null;
      invalidProfileUrl ? this.setState({ invalidProfileUrl: true }) : null;
    }
  }
  onReset() {
    let Registration = {
      firstName: "",
      lastName: "",
      email: "",
      contact: "",
      profileName: "",
      briefInfo: "",
      profileImageURL: "",
      event: ""
    };
    this.setState({
      Registration: Registration,
      firstNameRequired: false,
      lastNameRequired: false,
      emailRequired: false,
      contactRequired: false,
      eventRequired: false,
      inValidContact: false,
      profileRequired: false,
      inValidEmail: false,
      invalidProfileUrl: false
    });
  }

  // Method for set only Numeric
  setInputToNumeric(e) {
    const re = /[0-9]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }



  Toaster(compRef, createEditError, actionName, errorMessage) {
    compRef.setState({ loading: false });
    if (!createEditError) {
      compRef.onReset();
      toast.success("Attendee " + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      setTimeout(() => {
        if (actionName === "Created") {
          compRef.setState({ displayPasswordFlag: true });
        } else compRef.setState({ displayPasswordFlag: false });

        if (actionName === "Updated") {
          compRef.redirectFunction();
        }
      }, 1000);
    } else {
      if (this.props.statusCode === 400) {
        toast.error("email Id Already Exists", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      } else {
        toast.error("Something Went wrong", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }
    }
  }
  redirectFunction() {
    this.setState({ loading: false });
    this.props.history.push("/registrationList");
  }
  handleEventChange(value) {
    if (value !== null) {
      this.props.getAttendeeCountForEvent(value);
      let Registration = { ...this.state.Registration };
      Registration.event = value;
      this.setState({
        Registration: Registration,
        eventRequired: false
      });
    } else {
      let Registration = { ...this.state.Registration };
      Registration.event = "";
      Registration.profileName = "";
      this.setState({ Registration: Registration, eventRequired: false });
    }
  }

  handleProfileChange(value) {
    if (value !== null) {
      let { Registration } = this.state;
      Registration.profileName = value;
      Registration.roleName = value;
      this.setState({
        Registration: Registration,
        eventRequired: false,
        profileRequired: false
      });
    } else {
      let Registration = { ...this.state.Registration };
      Registration.profileName = "";
      this.setState({ Registration: Registration, profileRequired: false });
    }
  }

  getAttendeeDetails() {
    let Registration = { ...this.state.Registration };
    Registration = this.props.attendeeData;
    this.setState({
      Registration: Registration
    });
  }

  render() {
    const { Registration } = { ...this.state };
    const eventOptions = this.props.eventList;
    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <CardLayout name="Registration">
        <FormGroup row>
          <Col xs="12" md="6">
            <InputElement
              type="text"
              placeholder="First name"
              name="firstName"
              icon="icon-user"
              maxLength="20"
              value={Registration.firstName}
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
              value={Registration.lastName}
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
              inValid={this.state.inValidEmail}
              disabled={this.state.editAttendee}
              value={Registration.email}
              required={this.state.emailRequired}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <InputElement
              type="text"
              placeholder="Contact number"
              name="contact"
              icon="icon-phone"
              maxLength="10"
              inValid={this.state.inValidContact}
              onKeyPress={e => this.setInputToNumeric(e)}
              value={Registration.contact}
              required={this.state.contactRequired}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="6">
            <Select
              placeholder="Select event"
              value={Registration.event}
              options={eventOptions}
              simpleValue
              onChange={this.handleEventChange.bind(this)}
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
              value={Registration.briefInfo}
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
              value={Registration.profileImageURL}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <Select
              placeholder="Select profile"
              value={Registration.profileName}
              options={this.props.profileList}
              simpleValue
              onChange={this.handleProfileChange.bind(this)}
            />
            {this.state.profileRequired ? (
              <div
                style={{ color: "red", marginTop: 0 }}
                className="help-block"
              >
                *Please select profile
              </div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="3">
            {this.state.editAttendee ? (
              <Button
                type="button"
                size="md"
                color="success"
                onClick={() => this.onSubmit()}
              >
                Update
              </Button>
            ) : (
              <Button
                type="button"
                size="md"
                color="success"
                onClick={() => this.onSubmit()}
              >
                Create
              </Button>
            )}
          </Col>
          <Col md="3">
            <Button
              type="button"
              size="md"
              color="primary"
              style={{ marginLeft: -180 }}
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
        </FormGroup>
        <RegistrationModal
          openFlag={this.state.displayPasswordFlag}
          toggleFunction={this.toggleFunction.bind(this)}
          email={this.state.emailModal}
          password={this.state.passwordModal}
        />
      </CardLayout>
    );
  }
}
const mapStateToProps = state => {
  return {
    registrationError: state.registration.error,
    attendeeData: state.registration.attendeeData,
    eventList: state.event.eventList,
    attendeeCount: state.attendeeCount.attendeeCount,
    createEditError: state.registration.createEditError,
    statusCode: state.registration.statusCode,
    profileList: state.profileList.profileList,
    creatError: state.registration.creatError
  };
};
const mapDispatchToProps = dispatch => {
  return {
    createAttendee: (attendee, attendeeCount) =>
      dispatch(actions.createAttendee(attendee, attendeeCount)),
    getAttendeeData: id => dispatch(actions.getAttendeeData(id)),
    getAttendeeCountForEvent: id =>
      dispatch(actions.getAttendeeCountForEvent(id)),
    editAttendeeData: (id, attendee) =>
      dispatch(actions.editAttendeeData(id, attendee)),
    getEvents: () => dispatch(actions.getEvents()),
    getProfileList: () => dispatch(actions.getProfileList()),
    getAttendeeById: id => dispatch(actions.getAttendeeById(id))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration);

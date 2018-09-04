import React, { Component } from "react";
import { connect } from "react-redux";
import CardLayout from "../../components/CardLayout/";
import { Col, Button, FormGroup } from "reactstrap";
import Select from "react-select";
import "react-select/dist/react-select.css";
import * as actions from "../../store/actions/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class ProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Profile: {
        profileId: "",
        profileName: "",
        eventValue: ""
      },
      updateflag: false,
      eventNameRequired: false,
      submitted: false,
      profileNameRequired: false
    };
  }
  componentDidMount() {
    this.props.getEvents();
    this.props.getProfileList();

    if (this.props.match.params.id !== undefined) {
      let profileId = this.props.match.params.id;
      this.setState({ updateflag: true });
      if (this.props.profiles.length !== 0) {
        let profile = this.props.profiles.find(o => o._id === profileId);
        let ProfileObj = {
          profileId: profile._id,
          profileName: profile.profileName,
          eventValue: profile.event._id
        };
        this.setState({
          Profile: ProfileObj
        });
      }
    }
  }

  handleEventSelectChange(value) {
    let eventValue = value;
    let Profile = {
      ...this.state.Profile
    };
    Profile["eventValue"] = eventValue;
    this.setState({
      Profile: Profile,
      eventNameRequired: false
    });
  }

  handleProfileSelectChange(value) {
    let profileName = value;
    let Profile = {
      ...this.state.Profile
    };
    Profile["profileName"] = profileName;
    this.setState({
      Profile: Profile,
      profileNameRequired: false
    });
  }

  redirectFunction() {
    this.props.history.push("/profiles");
  }

  Toaster(compRef, successFlag, actionName) {
    if (successFlag) {
      toast.success("Profile " + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      setTimeout(() => {
        compRef.redirectFunction();
      }, 1000);
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  onSubmitHandler() {
    let profile = { ...this.state.Profile };
    let compRef = this;
    this.validateForm();
    if (profile.profileName && profile.eventValue) {
      this.props.createProfile(profile);
      setTimeout(() => {
        let profileCreated = this.props.profileCreated;
        compRef.Toaster(compRef, profileCreated, "Created");
      }, 1000);
    }
  }

  validateForm() {
    let profile = { ...this.state.Profile };
    !profile.profileName ? this.setState({ profileNameRequired: true }) : null;
    !profile.eventValue ? this.setState({ eventNameRequired: true }) : null;
  }

  onUpdateHandler() {
    let profile = { ...this.state.Profile };
    let compRef = this;
    this.validateForm();
    if (profile.profileName && profile.eventValue) {
      this.props.updateProfile(profile);
      setTimeout(() => {
        let profileUpdated = this.props.profileUpdated;
        compRef.Toaster(compRef, profileUpdated, "Updated");
      }, 1000);
    }
  }

  resetField() {
    let Profile = {
      profileName: "",
      eventValue: ""
    };
    this.setState({
      Profile: Profile,
      profileNameRequired: false,
      eventNameRequired: false
    });
  }

  render() {
    const eventList = this.props.eventList;
    const profileList = this.props.profileList;
    const { eventValue, profileName } = this.state.Profile;
    this.headerText = "";

    if (this.state.updateflag) {
      this.headerText = "Profile";
      this.buttons = (
        <Button
          type="submit"
          size="md"
          color="success"
          onClick={this.onUpdateHandler.bind(this)}
        >
          <i className="icon-note" /> Update
        </Button>
      );
    } else {
      this.headerText = "Profile Form";
      this.buttons = (
        <Button
          type="submit"
          size="md"
          color="success"
          onClick={this.onSubmitHandler.bind(this)}
        >
          <i className="icon-note" /> Add Profile
        </Button>
      );
    }

    return (
      <CardLayout name="Profile">
        <FormGroup row>
          <Col xs="12" md="6">
            <Select
              placeholder="Select Event Name"
              value={eventValue}
              options={eventList}
              simpleValue
              onChange={this.handleEventSelectChange.bind(this)}
            />
            {this.state.eventNameRequired ? (
              <div
                style={{ color: "red", marginTop: 0 }}
                className="help-block"
              >
                Please select event
              </div>
            ) : null}
            <br />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col md="6">
            <Select
              placeholder="Select Profile Name"
              value={profileName}
              options={profileList}
              simpleValue
              onChange={this.handleProfileSelectChange.bind(this)}
            />
            {this.state.profileNameRequired ? (
              <div
                style={{ color: "red", marginTop: 0 }}
                className="help-block"
              >
                *Please select profile
              </div>
            ) : null}
            <br />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="8" md="3">
            {this.buttons}
          </Col>
          <Col md="3">
            <Button
              onClick={this.resetField.bind(this)}
              type="reset"
              size="md"
              color="danger"
            >
              {" "}
              Reset
            </Button>
            <ToastContainer autoClose={2000} />
          </Col>
        </FormGroup>
      </CardLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    eventList: state.event.eventList,
    profiles: state.profile.profiles,
    profileList: state.profileList.profileList,
    profileCreated: state.profile.profileCreated,
    profileUpdated: state.profile.profileUpdated
  };
};

const matchDispatchToProps = dispatch => {
  return {
    getEvents: () => dispatch(actions.getEvents()),
    getProfileList: () => dispatch(actions.getProfileList()),
    createProfile: profile => dispatch(actions.createProfile(profile)),
    updateProfile: profile => dispatch(actions.updateProfile(profile))
  };
};
export default connect(
  mapStateToProps,
  matchDispatchToProps
)(ProfileForm);

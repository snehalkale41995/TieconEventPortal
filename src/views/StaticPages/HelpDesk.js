import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { FormGroup, Col, Button } from "reactstrap";
import InputElement from "../../components/Input/";
import CardLayout from "../../components/CardLayout/";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";
import Loader from "../../components/Loader/Loader";
class HelpDesk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      helpDesk: {
        event: "",
        eventSupportEmail: "",
        eventSupportContact: "",
        techSupportEmail: "",
        techSupportContact: ""
      },
      eventValue: "",
      eventEmailRequired: false,
      eventContactRequired: false,
      techEmailRequired: false,
      techContactRequired: false,
      eventRequired: false,
      inValidEventEmail: false,
      inValidTechEmail: false,
      inValidEventContact: false,
      inValidTechContact: false,
      loading: true
    };
  }
  componentDidMount() {
    this.props.getEvents();
    let compRef = this;
    setTimeout(function() {
      compRef.setState({ loading: false });
    }, 1000);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.helpDesk !== this.props.helpDesk) {
      let isEmpty = !Object.keys(this.props.helpDesk).length;
      if (!isEmpty) {
        this.setState({
          helpDesk: this.props.helpDesk
        });
      } else {
        this.setState(prevState => ({
          helpDesk: {
            ...prevState.helpDesk,
            eventSupportEmail: "",
            eventSupportContact: "",
            techSupportEmail: "",
            techSupportContact: ""
          }
        }));
      }
    }
  }
  onChangeInput(event) {
    let helpDesk = { ...this.state.helpDesk };
    helpDesk[event.target.name] = event.target.value;
    this.setState({
      helpDesk: helpDesk,
      eventEmailRequired: false,
      eventContactRequired: false,
      techEmailRequired: false,
      techContactRequired: false,
      inValidEventEmail: false,
      inValidTechEmail: false,
      inValidEventContact: false,
      inValidTechContact: false
    });
  }
  handleEventChange(value) {
    if (value !== null) {
      let helpDesk = { ...this.state.helpDesk };
      helpDesk.event = value;
      this.setState({
        helpDesk: helpDesk,
        eventValue: value,
        eventEmailRequired: false,
        eventContactRequired: false,
        techEmailRequired: false,
        techContactRequired: false,
        eventRequired: false,
        inValidEventEmail: false,
        inValidTechEmail: false,
        inValidEventContact: false,
        inValidTechContact: false
      });
      this.props.getHelpDeskForEvent(value);
      let compRef = this;
      setTimeout(() => {
        let getHelpDeskError = compRef.props.getHelpDeskError;
        if (getHelpDeskError) {
          toast.error("Something went wrong", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }
      }, 1000);
    } else {
      this.onReset();
    }
  }
  onSubmit() {
    let helpDesk = { ...this.state.helpDesk };
    let eventEmailValid;
    let techEmailValid;
    if (helpDesk.eventSupportEmail) {
      eventEmailValid = helpDesk.eventSupportEmail.match(
        /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
      );
    }
    if (helpDesk.techSupportEmail) {
      techEmailValid = helpDesk.techSupportEmail.match(
        /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
      );
    }
    if (
      techEmailValid &&
      eventEmailValid &&
      helpDesk.event &&
      (helpDesk.eventSupportContact &&
        helpDesk.eventSupportContact.toString().length === 10) &&
      helpDesk.eventSupportEmail &&
      helpDesk.techSupportEmail &&
      (helpDesk.techSupportContact &&
        helpDesk.techSupportContact.toString().length === 10)
    ) {
      this.setState({ loading: true });
      let isEmpty = !Object.keys(this.props.helpDesk).length;
      let helpDesk = _.pick(this.state.helpDesk, [
        "event",
        "eventSupportEmail",
        "eventSupportContact",
        "techSupportEmail",
        "techSupportContact"
      ]);
      let id;
      !isEmpty ? (id = this.props.helpDesk._id) : null;
      isEmpty
        ? this.props.createHelpDeskInfo(helpDesk)
        : this.props.editHelpDeskInfo(id, helpDesk);
      let compRef = this;
      setTimeout(() => {
        let creatEditHelpDeskError = compRef.props.creatEditHelpDeskError;
        let status = "";
        !isEmpty ? (status = "Updated") : (status = "Created");
        compRef.Toaster(compRef, creatEditHelpDeskError, status);
      }, 1000);
    } else {
      if (!helpDesk.event) {
        this.setState({ eventRequired: true });
      }
      if (helpDesk.eventSupportContact.toString().length !== 10) {
        this.setState({ inValidEventContact: true });
      }
      if (helpDesk.techSupportContact.toString().length !== 10) {
        this.setState({ inValidTechContact: true });
      }
      if (!helpDesk.eventSupportContact) {
        this.setState({
          inValidEventContact: false,
          eventContactRequired: true
        });
      }
      if (!helpDesk.techSupportContact) {
        this.setState({ inValidTechContact: false, techContactRequired: true });
      }
      if (!eventEmailValid) {
        this.setState({ inValidEventEmail: true });
      }
      if (!techEmailValid) {
        this.setState({ inValidTechEmail: true });
      }
      if (!helpDesk.eventSupportEmail) {
        this.setState({ inValidEventEmail: false, eventEmailRequired: true });
      }
      if (!helpDesk.techSupportEmail) {
        this.setState({ inValidTechEmail: false, techEmailRequired: true });
      }
    }
  }
  Toaster(compRef, createEditError, actionName) {
    this.setState({ loading: false });
    if (!createEditError) {
      this.onReset();
      toast.success("Help Desk Information " + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }
  onReset() {
    this.setState(prevState => ({
      helpDesk: {
        ...prevState.helpDesk,
        event: "",
        eventSupportEmail: "",
        eventSupportContact: "",
        techSupportEmail: "",
        techSupportContact: ""
      },
      eventValue: "",
      eventEmailRequired: false,
      eventContactRequired: false,
      techEmailRequired: false,
      techContactRequired: false,
      eventRequired: false,
      inValidEventEmail: false,
      inValidTechEmail: false,
      inValidEventContact: false,
      inValidTechContact: false
    }));
  }
  render() {
    const { helpDesk } = { ...this.state };
    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <CardLayout name="Help Desk">
        <FormGroup row style={{ marginTop: 20 }}>
          <Col xs="12" md="4">
            <Select
              placeholder="Select event"
              value={this.state.eventValue}
              options={this.props.eventList}
              simpleValue
              onChange={this.handleEventChange.bind(this)}
            />
            {this.state.eventRequired ? (
              <div
                style={{ color: "red", marginTop: -1 }}
                className="help-block"
              >
                *Please select event
              </div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row style={{ marginTop: 30 }}>
          <Col xs="12" md="6">
            <InputElement
              icon="icon-envelope"
              type="email"
              label="Event support email"
              placeholder="Event support email"
              name="eventSupportEmail"
              inValid={this.state.inValidEventEmail}
              required={this.state.eventEmailRequired}
              value={helpDesk.eventSupportEmail}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <InputElement
              icon="icon-phone"
              type="text"
              label="Event support contact"
              placeholder="Event support contact"
              name="eventSupportContact"
              maxLength="10"
              inValid={this.state.inValidEventContact}
              required={this.state.eventContactRequired}
              value={helpDesk.eventSupportContact}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="6">
            <InputElement
              icon="icon-envelope"
              type="email"
              label="Technical support email"
              placeholder="Technical support email"
              name="techSupportEmail"
              inValid={this.state.inValidTechEmail}
              required={this.state.techEmailRequired}
              value={helpDesk.techSupportEmail}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <InputElement
              type="text"
              icon="icon-phone"
              label="Technical support contact"
              placeholder="Technical support contact"
              name="techSupportContact"
              maxLength="10"
              inValid={this.state.inValidTechContact}
              required={this.state.techContactRequired}
              value={helpDesk.techSupportContact}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="3">
            <Button
              type="button"
              size="md"
              color="success"
              onClick={() => this.onSubmit()}
            >
              Submit
            </Button>
          </Col>
          <Col md="3">
            <Button
              type="button"
              size="md"
              color="danger"
              style={{ marginLeft: -160 }}
              onClick={() => this.onReset()}
            >
              Reset
            </Button>
          </Col>
          <Col md="6">
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
    helpDesk: state.staticPages.helpDesk,
    getHelpDeskError: state.staticPages.getHelpDeskError,
    creatEditHelpDeskError: state.staticPages.creatEditHelpDeskError
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getEvents: () => dispatch(actions.getEvents()),
    getHelpDeskForEvent: id => dispatch(actions.getHelpDeskForEvent(id)),
    createHelpDeskInfo: helpDesk =>
      dispatch(actions.createHelpDeskInfo(helpDesk)),
    editHelpDeskInfo: (id, helpDesk) =>
      dispatch(actions.editHelpDeskInfo(id, helpDesk))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HelpDesk);

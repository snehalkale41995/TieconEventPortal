import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import InputElement from "../../components/Input/";
import CardLayout from "../../components/CardLayout/";
import { InputGroup, InputGroupText, Input, Col, Button, FormGroup } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";

class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Event: {
        id: "",
        eventName: "",
        venue: "",
        description: "",
        startDate: "",
        endDate: "",
        eventLogo: ""
      },
      submitted: false,
      inValidDates: false,
      updateflag: false,
      endDateRequired: false,
      eventNameRequired: false,
      venueRequired: false,
      startDateRequired: false,
      loading: false,
      invalidEventLogo: false
    };
    this.redirectFunction = this.redirectFunction.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id !== undefined) {
      this.setState({ updateflag: true });
      if (this.props.events.length !== 0) {
        let event = this.props.events.find(
          o => o._id === this.props.match.params.id
        );
        this.setCurrentEvent(event);
      } else {
        this.setState({ loading: true });
        this.props.getEventById(this.props.match.params.id);
        let compRef = this;
        setTimeout(function() {
          if (Object.keys(compRef.props.currentEvent).length) {
            compRef.setCurrentEvent(compRef.props.currentEvent);
          } else {
            compRef.props.history.push("/events");
          }
        }, 1000);
      }
    }
  }

  setCurrentEvent(currentEvent) {
    let Event = {
      id: currentEvent._id,
      eventName: currentEvent.eventName,
      venue: currentEvent.venue,
      description: currentEvent.description,
      startDate: moment(currentEvent.startDate),
      endDate: moment(currentEvent.endDate),
      eventLogo: currentEvent.eventLogo
    };
    this.setState({
      Event: Event,
      loading: false
    });
  }

  changeFunction(date, type) {
    let Event = {
      ...this.state.Event
    };
    Event[type] = date;
    this.setState({
      Event: Event,
      startDateRequired: false,
      inValidDates: false,
      endDateRequired: false
    });
  }

  onChangeHandler(event) {
    let eventDetailArray = {
      ...this.state.Event
    };
    eventDetailArray[event.target.name] = event.target.value;
    this.setState({
      Event: eventDetailArray,
      eventNameRequired: false,
      venueRequired: false,
      invalidEventLogo: false
    });
  }

  validateForm() {
    let event = { ...this.state.Event };
    let startDate = new Date(event["startDate"]).setHours(0, 0, 0, 0);
    let endDate = new Date(event["endDate"]).setHours(0, 0, 0, 0);
    let invalidEventLogo = false;
    var validLogo = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (
      event.eventLogo !== undefined &&
      event.eventLogo !== "" &&
      event.eventLogo !== null
    ) {
      if (!validLogo.test(event.eventLogo)) {
        invalidEventLogo = true;
      }
    }
    !event.eventName ? this.setState({ eventNameRequired: true }) : null;
    !event.startDate ? this.setState({ startDateRequired: true }) : null;
    !event.endDate ? this.setState({ endDateRequired: true }) : null;
    !event.venue ? this.setState({ venueRequired: true }) : null;
    endDate < startDate ? this.setState({ inValidDates: true }) : null;
    invalidEventLogo ? this.setState({ invalidEventLogo: true }) : null;
  }

  onSubmitHandler() {
    let compRef = this;
    this.validateForm();
    setTimeout(() => {
      compRef.createEvent();
    }, 1000);
  }

  createEvent() {
    let event = { ...this.state.Event };
    let compRef = this;
    if (
      event.eventName &&
      !this.state.inValidDates &&
      !this.state.invalidEventLogo &&
      event.venue &&
      event.startDate &&
      event.endDate
    ) {
      this.setState({ loading: true });
      this.props.createEvent(event);
      setTimeout(() => {
        let eventCreated = this.props.eventCreated;
        compRef.Toaster(compRef, eventCreated, "Created");
      }, 1500);
    } else {
      this.setState({ loading: false });
    }
  }
  redirectFunction() {
    this.props.history.push("/events");
  }

  Toaster(compRef, successFlag, actionName) {
    this.setState({ loading: false });
    if (successFlag) {
      toast.success("Event " + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      setTimeout(() => {
        compRef.redirectFunction();
      }, 1000);
    } else {
      compRef.setState({ loading: false });
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  onUpdateHandler() {
    let compRef = this;
    this.validateForm();
    this.setState({ loading: true });
    setTimeout(() => {
      compRef.updateEvent();
    }, 1000);
  }

  updateEvent() {
    let event = { ...this.state.Event };
    let compRef = this;
    if (
      event.eventName &&
      !this.state.invalidEventLogo &&
      !this.state.inValidDates &&
      event.venue &&
      event.startDate &&
      event.endDate
    ) {
      this.props.updateEvent(event);
      setTimeout(() => {
        let eventUpdated = this.props.eventUpdated;
        compRef.Toaster(compRef, eventUpdated, "Updated");
      }, 1500);
    } else {
      this.setState({ loading: false });
    }
  }

  resetField() {
    let Event = {
      eventName: "",
      description: "",
      venue: "",
      startDate: "",
      endDate: ""
    };
    this.setState({
      Event: Event,
      endDateRequired: false,
      eventNameRequired: false,
      venueRequired: false,
      startDateRequired: false,
      inValidDates: false,
      invalidEventLogo: false
    });
  }

  render() {
    if (this.state.updateflag)
      this.buttons = (
        <Button
          type="submit"
          size="md"
          color="success"
          onClick={this.onUpdateHandler.bind(this)}
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
          onClick={this.onSubmitHandler.bind(this)}
        >
          Create
        </Button>
      );

    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <CardLayout name="Event">
        <FormGroup row>
          <Col xs="12" md="4">
            <InputElement
              type="text"
              placeholder="Event name"
              name="eventName"
              icon="icon-home"
              maxLength="50"
              value={this.state.Event.eventName}
              required={this.state.eventNameRequired}
              onchanged={event => this.onChangeHandler(event)}
            />
          </Col>
          <Col sm={{ size: 4, order: 2, offset: 1 }}>
          <InputGroup className="mb-3">
          <InputGroupText><i className="icon-note"></i></InputGroupText>
          <Input style={{height:'36px'}} maxLength="500" type="textarea" placeholder="Description" name="description"  value={this.state.Event.description}
           onChange={event => this.onChangeHandler(event)}/>
          </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col md="5">
            <InputGroup className="mb-3">
              <InputGroupText>
                <i className="icon-calendar" />
              </InputGroupText>
              <DatePicker
                className="datepicker"
                selected={this.state.Event.startDate}
                onChange={event => this.changeFunction(event, "startDate")}
                placeholderText="--Select Start Date--"
              />
            </InputGroup>
            {this.state.startDateRequired ? (
              <div
                style={{ color: "red", marginTop: -12 }}
                className="help-block"
              >
                *Start date is required
              </div>
            ) : null}
            {this.state.inValidDates ? (
              <div
                style={{ color: "red", marginTop: -12 }}
                className="help-block"
              >
                *Please enter valid Start Date and End Date
              </div>
            ) : null}
          </Col>
          <Col md="5">
            <InputGroup className="mb-3">
              <InputGroupText>
                <i className="icon-calendar" />
              </InputGroupText>
              <DatePicker
                className="datepicker"
                selected={this.state.Event.endDate}
                onChange={event => this.changeFunction(event, "endDate")}
                placeholderText="--Select End Date--"
              />
            </InputGroup>
            {this.state.endDateRequired ? (
              <div
                style={{ color: "red", marginTop: -12 }}
                className="help-block"
              >
                *End date is required
              </div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row />
        <FormGroup row>
          <Col xs="12" md="4">
            <InputElement
              type="text"
              placeholder="Venue"
              name="venue"
              icon="icon-home"
              maxLength="255"
              value={this.state.Event.venue}
              required={this.state.venueRequired}
              onchanged={event => this.onChangeHandler(event)}
            />
          </Col>
          <Col sm={{ size: 4, order: 2, offset: 1 }}>
            <InputElement
              icon="icon-link"
              type="text"
              placeholder="Event Logo"
              name="eventLogo"
              inValid={this.state.invalidEventLogo}
              value={this.state.Event.eventLogo}
              onchanged={event => this.onChangeHandler(event)}
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
              onClick={() => this.resetField()}
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
          <Col md="3" />
        </FormGroup>
      </CardLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    events: state.event.events,
    eventCreated: state.event.eventCreated,
    eventUpdated: state.event.eventUpdated,
    currentEvent: state.event.currentEvent
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createEvent: event => dispatch(actions.createEvent(event)),
    updateEvent: event => dispatch(actions.updateEvent(event)),
    getEventById: id => dispatch(actions.getEventById(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventForm);

import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import InputElement from "../../components/Input/";
import CardLayout from "../../components/CardLayout/";
import SessionIndicator from "../../components/Calendar/SessionIndicator";
import * as calendarStyle from "../../components/Calendar/CalendarStyles";
import { Row, Col, Button, FormGroup, Label, InputGroup, InputGroupText, Input} from "reactstrap";
import Modal from "../../components/Modal/ModalCart";
import ValidModal from "../../components/Modal/sessionValidModal";

import moment from "moment";
import Select from "react-select";
import "react-select/dist/react-select.css";
import Calendar from "../../components/Calendar/";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ValidationError from "../../components/ValidationError/ValidationError";
import Loader from "../../components/Loader/Loader";


class SessionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Session: {
        sessionId: "",
        sessionName: "",
        room: "",
        event: "",
        description: "",
        extraServices: "",
        speakers: [],
        volunteers: [],
        startTime: "",
        endTime: "",
        sessionCapacity: "",
        sessionType: "",
        isRegistrationRequired: false
      },
      submitted: false,
      isCommon: true,
      calendarSessionList: [],
      sessionTypeValue: "",
      eventValue: "",
      roomValue: "",
      speakerValue: "",
      volunteerValue: "",
      updateFlag: false,
      sessionTypeRequired: false,
      sessionCapacityRequired: false,
      sessionNameRequired: false,
      roomRequired: false,
      eventRequired: false,
      startTimeRequired: false,
      speakersRequired: false,
      volunteersRequired: false,
      endTimeRequired: false,
      editDeleteFlag: false,
      createFlag: true,
      slotPopupFlag: false,
      loading: false,
      inValidSessionCapacity: false,
      deleteFlag: false,
      validModalFlag : false
    };
  }

  componentDidMount() {
    this.props.getEvents();
    this.props.getAttendees();
    this.props.getRooms();
    this.props.getSessions();
    this.props.getSpeakerList();
    this.props.getSessionTypeList();
  }

  onChangeHandler(session) {
    let sessionDetails = { ...this.state.Session };
    sessionDetails[session.target.name] = session.target.value;
    this.setState({
      Session: sessionDetails,
      sessionNameRequired: false
    });
  }

  ChangeCapacityHandler(session) {
    let value = session.target.value;
    if (value > 0 || value == "") {
      if (!value.startsWith(".")) {
        let sessionDetails = { ...this.state.Session };
        sessionDetails[session.target.name] = session.target.value;
        this.setState({
          Session: sessionDetails,
          sessionCapacityRequired: false,
          inValidSessionCapacity: false
        });
      }
    }
  }

  eventDaysStyleGetter(date) {
    let eventDaysStyle = calendarStyle.eventDaysStyleGetter(
      date,
      this.state.eventStartDate,
      this.state.eventEndDate
    );
    return eventDaysStyle;
  }
  eventStyleGetter(event) {
    let eventStyle = calendarStyle.eventStyleGetter(event);
    return eventStyle;
  }

  navigateEventDate(date) {
    this.setState({ eventDate: date });
  }

  changeRoom(roomValue) {
    let rooms = this.props.rooms;
    let Session = { ...this.state.Session };
    Session["room"] = roomValue;
    let currentRoomCapacity;
    if (roomValue != null) {
      rooms.forEach(room => {
        if (room._id === roomValue) {
          currentRoomCapacity = room.capacity;
          this.setState({ currentRoomCapacity });
        }
      });
    }

    let calendarSessionList = [];
    this.setState({
      roomValue,
      Session: Session,
      calendarSessionList: [],
      roomRequired: false
    });
    if (this.state.eventValue && roomValue) {
      this.props.getSessions();
      setTimeout(() => {
        this.props.sessions.forEach(session => {
          if (session.event._id === this.state.eventValue) {
            if (session.room === roomValue) {
              this.displaySessions(session, calendarSessionList);
            }
          }
        });
      }, 1000);
    }
  }

  changeEvent(eventValue) {
    let volunteerList = [],
      speakerList = [],
      roomList = [];
    let attendees = this.props.attendees;
    let rooms = this.props.rooms;
    let speakers = this.props.speakers;
    let events = this.props.events;
    let Session = { ...this.state.Session };
    Session["event"] = eventValue;
    this.setState({
      eventValue,
      Session: Session,
      eventRequired: false,
      calendarSessionList: []
    });

    rooms.forEach(room => {
      if (room.event._id === eventValue) {
        roomList.push({ label: room.roomName, value: room._id });
      }
    });

    events.forEach(event => {
      if (event._id === eventValue) {
        new Date(event["startDate"]).setHours(0, 0, 0, 0);
        let eventDate = moment(event.startDate).startOf("day");
        let eventStartDate = new Date(event.startDate).setHours(0, 0, 0, 0);
        let eventEndDate = new Date(event.endDate).setHours(0, 0, 0, 0);
        this.setState({ eventDate, eventStartDate, eventEndDate });
      }
    });

    speakers.forEach(speaker => {
      if (speaker.event._id === eventValue) {
        speakerList.push({
          label: speaker.firstName + " " + speaker.lastName,
          value: speaker._id
        });
      }
    });

    attendees.forEach(attendee => {
      if (attendee.event != null) {
        if (attendee.event._id === eventValue) {
          attendee.profiles.forEach(profile => {
            if (profile === "Volunteer") {
              volunteerList.push({
                label: attendee.firstName + " " + attendee.lastName,
                value: attendee._id
              });
            }
          });
        }
      }
    });
    this.setState({ roomList, volunteerList, speakerList });
  }

  updateCalendar(eventId, room) {
    let calendarSessionList = [];
    let compRef = this;
    compRef.props.sessions.forEach(session => {
      if (session.event._id === eventId) {
        if (session.room === room) {
          this.displaySessions(session, calendarSessionList);
        }
      }
    });
  }

  displaySessions(session, calendarSessionList) {
    let sessionObj = Object.assign({}, session);
    let sessionTimeDetails = {
      start: moment(session.startTime).toDate(),
      end: moment(session.endTime).toDate(),
      title: session.sessionName
    };
    calendarSessionList.push(Object.assign({}, sessionObj, sessionTimeDetails));
    this.setState({ calendarSessionList: calendarSessionList });
  }

  changeSessionType(value) {
    let Session = { ...this.state.Session };
    if (value != null) {
      if (value === "common") {
        Session.speakers = "";
        Session.volunteers = "";
        Session.sessionCapacity = "";
        Session.isRegistrationRequired = false;
        this.setState({
          isCommon: true,
          Session: Session,
          speakerValue: "",
          volunteerValue: ""
        });
      } else {
        this.setState({ isCommon: false });
      }
      Session["sessionType"] = value;
      this.setState({
        Session: Session,
        sessionTypeRequired: false,
        sessionTypeValue: value
      });
    } else {
      Session["sessionType"] = "";
      this.setState({
        Session: Session,
        sessionTypeRequired: true,
        sessionTypeValue: ""
      });
    }
  }

  changeSpeakers(speakerValue) {
    if (speakerValue !== null) {
      let Session = { ...this.state.Session };
      let speakerArray = [];
      speakerArray.push(speakerValue);
      let len = speakerArray.length;
      if (len) {
        let lastEle = speakerArray[len - 1];
        Session.speakers = lastEle.split(",");
        this.setState({
          Session: Session,
          speakerValue,
          speakersRequired: false
        });
      }
    }
  }

  changeVolunteers(volunteerValue) {
    if (volunteerValue !== null) {
      let Session = { ...this.state.Session };
      let volunteerArray = [];
      volunteerArray.push(volunteerValue);
      let len = volunteerArray.length;
      if (len) {
        let lastEle = volunteerArray[len - 1];
        Session.volunteers = lastEle.split(",");
        this.setState({
          Session: Session,
          volunteerValue,
          volunteersRequired: false
        });
      }
    }
  }

  toggleSessionRequired() {
    let Session = { ...this.state.Session };
    Session["isRegistrationRequired"] = !Session.isRegistrationRequired;
    this.setState({ Session: Session });
  }

  deleteConfirm() {
    let deleteFlag = this.state.deleteFlag;
    this.setState({
      deleteFlag: !deleteFlag
    });
  }
  Toaster(successFlag, actionName) {
    this.setState({ loading: false });
    let compRef = this;
    if (successFlag) {
      toast.success("Session " + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      compRef.setState({ createFlag: true, editDeleteFlag: false });
      compRef.resetField();
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  validateForm() {
    let session = { ...this.state.Session };
    let validRoomCapacity;
    let currentRoomCapacity = this.state.currentRoomCapacity;
    !session.sessionName ? this.setState({ sessionNameRequired: true }) : null;
    !session.event ? this.setState({ eventRequired: true }) : null;
    !session.room ? this.setState({ roomRequired: true }) : null;
    !session.startTime ? this.setState({ startTimeRequired: true }) : null;
    !session.endTime ? this.setState({ endTimeRequired: true }) : null;
    !session.sessionType ? this.setState({ sessionTypeRequired: true }) : null;
    if (!this.state.isCommon) {
      if (session.sessionCapacity && currentRoomCapacity) {
        validRoomCapacity = session.sessionCapacity <= currentRoomCapacity;
      }

      !session.sessionCapacity
        ? this.setState({ sessionCapacityRequired: true })
        : null;
      !validRoomCapacity && session.sessionCapacity && session.room
        ? this.setState({ inValidSessionCapacity: true })
        : null;
      !session.speakers ||
      session.speakers.length == 0 ||
      session.speakers[0] == "" ||
      session.speakers[0] == null
        ? this.setState({ speakersRequired: true })
        : null;
      !session.volunteers ||
      session.volunteers.length == 0 ||
      session.volunteers[0] == "" ||
      session.volunteers[0] == null
        ? this.setState({ volunteersRequired: true })
        : null;
    }
  }

  onSubmitHandler() {
    let session = { ...this.state.Session };
    let eventId = this.state.eventValue;
    let room = this.state.roomValue;
    let startTime = session.startTime;
    if (eventId == null || eventId == ""||room == null || room == "" ||!startTime  ) {
      this.setState({validModalFlag : true});
    }
    else{
      this.setState({validModalFlag : false});
    }

    this.validateForm();
    if (this.state.isCommon) {
      if (
        session.sessionName &&
        session.sessionType &&
        session.event &&
        session.startTime &&
        session.endTime &&
        session.room
      ) {
        this.createSession(session, eventId, room);
      }
    } else {
      setTimeout(() => {
        if (
          session.sessionName &&
          session.sessionType &&
          session.event &&
          !this.state.speakersRequired &&
          !this.state.volunteersRequired &&
          !this.state.inValidSessionCapacity &&
          session.volunteers &&
          session.startTime &&
          session.endTime &&
          session.room &&
          session.sessionCapacity
        ) {
          this.createSession(session, eventId, room);
        }
      }, 800);
    }
  }

  createSession(session, eventId, room) {
    let compRef = this;
    this.setState({ loading: true });
    this.props.createSession(session);
    setTimeout(() => {
      this.updateCalendar(eventId, room);
    }, 2500);
    setTimeout(() => {
      let sessionCreated = this.props.sessionCreated;
      compRef.Toaster(sessionCreated, "Created");
    }, 1000);
  }

  onUpdateHandler() {
    let session = { ...this.state.Session };
    let eventId = this.state.eventValue;
    let room = this.state.roomValue;

    this.validateForm();
    if (this.state.isCommon) {
      if (
        session.sessionName &&
        session.sessionType &&
        session.event &&
        session.startTime &&
        session.endTime
      ) {
        session["sessionCapacity"] = "";
        this.updateSession(session, eventId, room);
      }
    } else {
      setTimeout(() => {
        if (
          session.sessionName &&
          session.sessionType &&
          session.event &&
          !this.state.speakersRequired &&
          !this.state.inValidSessionCapacity &&
          !this.state.volunteersRequired &&
          session.startTime &&
          session.endTime &&
          session.room &&
          session.sessionCapacity
        ) {
          this.updateSession(session, eventId, room);
        }
      }, 200);
    }
  }

  updateSession(session, eventId, room) {
    let compRef = this;
    this.setState({ loading: true });
    this.props.updateSession(session);
    setTimeout(() => {
      this.updateCalendar(eventId, room);
    }, 2500);
    setTimeout(() => {
      let sessionUpdated = this.props.sessionUpdated;
      compRef.Toaster(sessionUpdated, "Updated");
    }, 1000);
  }

  onDeleteHandler() {
    let compRef = this;
    let session = { ...this.state.Session };
    let eventId = session.event._id;
    let room = session.room;
    this.setState({ loading: true });
    this.setState({ deleteFlag: false });
    this.props.deleteSession(session._id);
    setTimeout(() => {
      this.updateCalendar(eventId, room);
    }, 2500);

    setTimeout(() => {
      let sessionDeleted = this.props.sessionDeleted;
      compRef.Toaster(sessionDeleted, "Deleted");
    }, 1000);
  }

  slotConfirmPopup() {
    this.setState({
      slotPopupFlag: !this.state.slotPopupFlag
    });
  }
  toggleValidModal() {
    this.setState({
      validModalFlag: !this.state.validModalFlag
    });
  }

  slotConfirmSuccess() {
    let compRef = this;
    let Session = { ...this.state.Session };
    if (this.state.editDeleteFlag === true) {
      Session.sessionName = "";
      Session.description = "";
      Session.speakers = [];
      Session.volunteers = [];
      Session.sessionCapacity = "";
      Session.sessionType = "";
      Session.isRegistrationRequired = false;
      this.setState({
        Session: Session,
        sessionTypeValue: "",
        speakerValue: "",
        volunteerValue: ""
      });
    }
    let sessionStart = this.state.sessionStart;
    let sessionEnd = this.state.sessionEnd;

    let slotConfirmMessage =
      `Start Time : ${moment(sessionStart).format("DD/MM/YYYY,h:mm A")} ` +
      `,\r\n End Time: ${moment(sessionEnd).format("DD/MM/YYYY,h:mm A")}`;
    compRef.setState({ slotConfirmMessage: slotConfirmMessage });

    Session["startTime"] = sessionStart.toString();
    Session["endTime"] = sessionEnd.toString();

    compRef.setState({
      Session: Session,
      startTimeRequired: false,
      endTimeRequired: false,
      slotConfirmMessage,
      createFlag: true,
      editDeleteFlag: false,
      slotPopupFlag: false
    });
  }

  selectSlot(slotInfo) {
    let dateselected = new Date(slotInfo.start).setHours(0, 0, 0, 0);
    let room = this.state.roomValue;
    let event = this.state.eventValue;
    if (event == null || event == "") {
      this.setState({ eventRequired: true });
    } else {
      this.setState({ eventRequired: false });
    }
    if (room == null || room == "") {
      this.setState({ roomRequired: true });
    } else {
      this.setState({ roomRequired: false });
    }
    let selectFlag = true;
    let compRef = this;

    setTimeout(() => {
      if (
        compRef.state.eventStartDate <= dateselected &&
        dateselected <= compRef.state.eventEndDate &&
        room !== null &&
        room !== ""
      ) {
        if (
          compRef.state.eventValue !== null &&
          compRef.state.roomValue !== null
        ) {
          compRef.props.sessions.forEach(session => {
            if (
              session.event._id === compRef.state.eventValue &&
              session.room === compRef.state.roomValue
            ) {
              let isSameStart = moment(slotInfo.start).isSame(
                moment(session.startTime)
              );
              let isSameEnd = moment(slotInfo.end).isSame(
                moment(session.endTime)
              );

              let isBetweenStart = moment(slotInfo.start).isBetween(
                moment(session.startTime),
                moment(session.endTime)
              );
              let isBetweenEnd = moment(slotInfo.end).isBetween(
                moment(session.startTime),
                moment(session.endTime)
              );
              let isBetweenStartOld = moment(session.startTime).isBetween(
                moment(slotInfo.start),
                moment(slotInfo.end)
              );
              let isBetweenEndOld = moment(session.endTime).isBetween(
                moment(slotInfo.start),
                moment(slotInfo.end)
              );
              if (
                isBetweenStart ||
                isBetweenEnd ||
                isBetweenStartOld ||
                isBetweenEndOld ||
                isSameStart ||
                isSameEnd
              ) {
                selectFlag = false;
              }
            }
          });
          if (selectFlag === false) return;
          else {
            let SlotalertMessage =
              "Confirm Slot :" +
              " " +
              " " +
              "Start Time :" +
              " " +
              moment(slotInfo.start).format("DD/MM/YYYY,h:mm A") +
              " " +
              "and " +
              "" +
              "End Time :" +
              "" +
              moment(slotInfo.end).format("DD/MM/YYYY,h:mm A");
            let sessionStart = slotInfo.start;
            let sessionEnd = slotInfo.end;

            compRef.setState({
              SlotalertMessage,
              sessionStart,
              sessionEnd
            });
            compRef.slotConfirmPopup();
          }
        }
      }
    }, 1000);
  }

  selectSession(session) {
    let sessionObj = {};
    if (session.sessionCapacity == null) {
      session.sessionCapacity = "";
    }
    this.setState({
      sessionCapacityRequired: false,
      sessionNameRequired: false,
      roomRequired: false,
      eventRequired: false,
      startTimeRequired: false,
      speakersRequired: false,
      sessionTypeRequired: false,
      volunteersRequired: false
    });

    sessionObj = Object.assign({}, session);
    if (sessionObj.sessionType === "common") {
      this.setState({ isCommon: true });
    } else this.setState({ isCommon: false });

    this.setState({
      Session: sessionObj,
      editDeleteFlag: true,
      createFlag: false,
      speakerValue: sessionObj.speakers,
      volunteerValue: sessionObj.volunteers,
      sessionTypeValue: sessionObj.sessionType,
      slotConfirmMessage: ""
    });
  }

  resetField() {
    let Session;
    if (this.state.editDeleteFlag) {
      Session = {
        ...this.state.Session,
        sessionId: "",
        sessionName: "",
        description: "",
        extraServices: "",
        speakers: [],
        volunteers: [],
        sessionCapacity: "",
        sessionType: "",
        isRegistrationRequired: false
      };
    } else {
      Session = {
        ...this.state.Session,
        sessionId: "",
        sessionName: "",
        description: "",
        extraServices: "",
        speakers: [],
        volunteers: [],
        startTime: "",
        endTime: "",
        sessionCapacity: "",
        sessionType: "",
        isRegistrationRequired: false
      };
    }

    this.setState({
      Session: Session,
      speakerValue: "",
      volunteerValue: "",
      updateFlag: false,
      sessionCapacityRequired: false,
      sessionNameRequired: false,
      roomRequired: false,
      eventRequired: false,
      startTimeRequired: false,
      speakersRequired: false,
      sessionTypeRequired: false,
      sessionTypeValue: "",
      volunteersRequired: false,
      endTimeRequired: false,
      slotConfirmMessage: "",
      inValidSessionCapacity: false
    });
  }

  render() {
    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <div>
        <FormGroup row>
          <Col xs="6" md="12">
            <SessionIndicator />
          </Col>
        </FormGroup>
        <div style={{ marginTop: -25 }}>
          <FormGroup row>
            <Col xs="12" md="5">
              <Select
                onChange={this.changeEvent.bind(this)}
                placeholder="Select event"
                simpleValue
                value={this.state.eventValue}
                options={this.props.eventList}
              />
              <ValidationError
                required={this.state.eventRequired}
                displayName="Event name"
              />
            </Col>
            <Col xs="12" md="5">
              <Select
                onChange={this.changeRoom.bind(this)}
                placeholder="Select room"
                simpleValue
                value={this.state.roomValue}
                options={this.state.roomList}
              />
              <ValidationError
                required={this.state.roomRequired}
                displayName="Room name"
              />
            </Col>
          </FormGroup>
        </div>
        <br />
        <br />
        {this.state.startTimeRequired ? (
          <div
            style={{ color: "red", marginTop: 0, fontSize: "12px" }}
            className="help-block"
          >
            *Please select slot
          </div>
        ) : null}
        <br /> <br />
        <Row>
          <Col md="8">
            <Calendar
              events={this.state.calendarSessionList}
              onSelectSlot={slotInfo => this.selectSlot(slotInfo)}
              selectSession={event => this.selectSession(event)}
              eventDate={this.state.eventDate}
              eventStyleGetter={event => this.eventStyleGetter(event)}
              eventDaysStyleGetter={day => this.eventDaysStyleGetter(day)}
              navigateEventDate={date => this.navigateEventDate(date)}
            />
          </Col>
          <Col md="4">
            <div>
              <span style={{ color: "black" }}>
                {this.state.slotConfirmMessage}
              </span>
            </div>
            <CardLayout name="">
              <FormGroup row>
                <Col xs="12">
                  <InputElement
                    type="text"
                    placeholder="Session name"
                    maxLength="250"
                    name="sessionName"
                    icon="icon-calendar"
                    maxLength="100"
                    required={this.state.sessionNameRequired}
                    value={this.state.Session.sessionName}
                    onchanged={session => this.onChangeHandler(session)}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="12">
                  <Select
                    simpleValue
                    onChange={this.changeSessionType.bind(this)}
                    placeholder="Select session type"
                    value={this.state.sessionTypeValue}
                    options={this.props.sessionTypeList}
                  />
                  <ValidationError
                    required={this.state.sessionTypeRequired}
                    displayName="Session type"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="12">
                  <Select
                    multi
                    onChange={this.changeSpeakers.bind(this)}
                    placeholder="Select speakers"
                    simpleValue
                    disabled={this.state.isCommon}
                    value={this.state.speakerValue}
                    options={this.state.speakerList}
                  />
                  <ValidationError
                    required={
                      this.state.speakersRequired && !this.state.isCommon
                    }
                    displayName="Speaker"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="12">
                  <Select
                    multi
                    placeholder="Select volunteers"
                    simpleValue
                    value={this.state.volunteerValue}
                    disabled={this.state.isCommon}
                    options={this.state.volunteerList}
                    onChange={this.changeVolunteers.bind(this)}
                  />
                  <ValidationError
                    required={
                      this.state.volunteersRequired && !this.state.isCommon
                    }
                    displayName="Volunteer"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="12">
                <InputGroup className="mb-3">
          <InputGroupText><i className="icon-note"></i></InputGroupText>
          <Input style={{height:'36px'}} maxLength="500" type="textarea" placeholder="Description" name="description"  value={this.state.Session.description}
           onChange={session => this.onChangeHandler(session)}/>
          </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col xs="12">
                  <InputElement
                    type="number"
                    placeholder="Session capacity"
                    name="sessionCapacity"
                    icon="icon-pie-chart"
                    disabled={this.state.isCommon}
                    required={
                      this.state.sessionCapacityRequired && !this.state.isCommon
                    }
                    value={this.state.Session.sessionCapacity}
                    onchanged={session => this.ChangeCapacityHandler(session)}
                  />
                </Col>
              </FormGroup>
              {this.state.inValidSessionCapacity ? (
                <div
                  style={{ color: "red", marginTop: -30 }}
                  className="help-block"
                >
                  *Capacity should be less than Room capacity(
                  {this.state.currentRoomCapacity})
                </div>
              ) : null}
              <FormGroup row>
                <Col xs="12">
                  <input
                    disabled={this.state.isCommon}
                    type="checkbox"
                    checked={this.state.Session.isRegistrationRequired}
                    onChange={this.toggleSessionRequired.bind(this)}
                  />
                  <Label> Registration Required </Label>
                </Col>
              </FormGroup>
              {this.state.editDeleteFlag && (
                <div>
                  <Row>
                    <Col sm="12">
                      <Button
                        name="update"
                        onClick={this.onUpdateHandler.bind(this)}
                        color="success"
                      >
                        Update
                      </Button>
                      &nbsp;&nbsp;
                      <Button
                        onClick={this.deleteConfirm.bind(this)}
                        color="danger"
                      >
                        Delete
                      </Button>
                      &nbsp;&nbsp;
                      <Button
                        onClick={this.resetField.bind(this)}
                        color="primary"
                      >
                        <i className="fa fa-ban" /> Reset
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}
              {this.state.createFlag && (
                <Row sm={{ size: "auto", offset: 2 }}>
                  <Col md="12">
                    <Button
                      onClick={this.onSubmitHandler.bind(this)}
                      type="submit"
                      color="primary"
                    >
                      Create Session
                    </Button>
                    &nbsp;&nbsp;
                    <Button onClick={this.resetField.bind(this)} color="danger">
                      <i className="fa fa-ban" />
                      Reset
                    </Button>
                  </Col>
                </Row>
              )}
              <ToastContainer autoClose={2000} />
              <Modal
                    openFlag={this.state.deleteFlag}
                    toggleFunction={this.deleteConfirm.bind(this)}
                    confirmFunction={this.onDeleteHandler.bind(this)}
                    message=" Are you sure you want to permanently delete this session?"
                  />
            </CardLayout>
          </Col>
        </Row>
        <Modal
          openFlag={this.state.slotPopupFlag}
          toggleFunction={this.slotConfirmPopup.bind(this)}
          confirmFunction={this.slotConfirmSuccess.bind(this)}
          message={this.state.SlotalertMessage}
        />
        <ValidModal
          openFlag={this.state.validModalFlag}
          toggleFunction={this.toggleValidModal.bind(this)}
          confirmFunction={this.toggleValidModal.bind(this)}
          event={this.state.eventValue}
          room={this.state.roomValue}
          startTime={this.state.Session.startTime}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    eventList: state.event.eventList,
    rooms: state.room.rooms,
    attendees: state.registration.attendeeList,
    speakers: state.speaker.speakerList,
    sessions: state.session.sessions,
    events: state.event.events,
    sessionTypeList: state.session.sessionTypeList,
    sessionDeleted: state.session.sessionDeleted,
    sessionUpdated: state.session.sessionUpdated,
    sessionCreated: state.session.sessionCreated
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getEvents: () => dispatch(actions.getEvents()),
    getAttendees: () => dispatch(actions.getAttendees()),
    getRooms: () => dispatch(actions.getRooms()),
    getSpeakerList: () => dispatch(actions.getSpeakers()),
    createSession: session => dispatch(actions.createSession(session)),
    getSessions: () => dispatch(actions.getSessions()),
    deleteSession: sessionId => dispatch(actions.deleteSession(sessionId)),
    updateSession: session => dispatch(actions.updateSession(session)),
    getSessionTypeList: () => dispatch(actions.getSessionTypeList())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionForm);

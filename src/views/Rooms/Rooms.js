import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { FormGroup, Col, Button } from "reactstrap";
import InputElement from "../../components/Input/";
import CardLayout from "../../components/CardLayout/";
import Select from "react-select";
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
class Rooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Room: {
        roomName: "",
        event: "",
        capacity: ""
      },
      events: [],
      editRoom: false,
      roomNameRequired: false,
      eventRequired: false,
      capacityRequired: false,
      loading: false,
      inValidCapacity: false
    };
  }
  componentDidMount() {
    this.props.getEvents();
    if (this.props.match.params.id !== undefined) {
      let currentroom = _.pick(this.props.currentRoom, [
        "roomName",
        "capacity"
      ]);
      let Empty = !Object.keys(currentroom).length;
      if (!Empty) {
        currentroom.event = this.props.currentRoom.event._id;
        this.setState({
          ...this.state.Room,
          Room: currentroom,
          editRoom: true
        });
      } else {
        this.setState({ loading: true });
        this.props.getRoomById(this.props.match.params.id);
        let compRef = this;
        setTimeout(function() {
          let currentroom = _.pick(compRef.props.currentRoom, [
            "roomName",
            "capacity"
          ]);
          let Empty = !Object.keys(currentroom).length;
          if (Empty) {
            compRef.props.history.push("/roomsList");
          } else {
            currentroom.event = compRef.props.currentRoom.event._id;
            compRef.setState({
              ...compRef.state.Room,
              Room: currentroom,
              editRoom: true,
              loading: false
            });
          }
        }, 1000);
      }
    }
  }

  onChangeInput(event) {
    const { Room } = { ...this.state };
    Room[event.target.name] = event.target.value;
    this.setState({
      Room: Room,
      roomNameRequired: false,
      eventRequired: false,
      capacityRequired: false,
      inValidCapacity: false
    });
  }

  onSubmit() {
    let Room = { ...this.state.Room };
    let id = this.props.currentRoom._id;
    if (Room.roomName && Math.floor(Room.capacity) > 0 && Room.event) {
      this.setState({ loading: true });
      this.state.editRoom
        ? this.props.editRoom(id, Room)
        : this.props.createRoom(Room);
      let compRef = this;
      setTimeout(() => {
        let creatEditRoomError = compRef.props.creatEditRoomError;
        let status = "";
        compRef.state.editRoom ? (status = "Updated") : (status = "Created");
        compRef.Toaster(compRef, creatEditRoomError, status);
      }, 1000);
    } else {
      !Room.roomName ? this.setState({ roomNameRequired: true }) : null;
      !Room.event ? this.setState({ eventRequired: true }) : null;
      Math.floor(Room.capacity) <= 0 && Room.capacity
        ? this.setState({ inValidCapacity: true })
        : null;
      !Room.capacity
        ? this.setState({ capacityRequired: true, inValidCapacity: false })
        : null;
    }
  }
  Toaster(compRef, createEditError, actionName) {
    compRef.setState({ loading: false });
    if (!createEditError) {
      compRef.onReset();
      toast.success("Room " + actionName + " Successfully.", {
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
  redirectFunction() {
    this.setState({ loading: false });
    this.props.history.push("/roomsList");
  }
  onReset() {
    this.setState({
      Room: {
        roomName: "",
        event: "",
        capacity: ""
      },
      roomNameRequired: false,
      eventRequired: false,
      capacityRequired: false,
      inValidCapacity: false
    });
  }

  handleEventSelectChange(value) {
    if (value !== null) {
      let Room = { ...this.state.Room };
      Room.event = value;
      this.setState({ Room: Room, eventRequired: false });
    } else {
      let Room = { ...this.state.Room };
      Room.event = "";
      this.setState({ Room: Room, eventRequired: true });
    }
  }
  render() {
    const { Room } = this.state;
    const options = [
      { label: "Auditorium ", value: "Auditorium " },
      { label: "Projector", value: "Projector" },
      { label: "AV", value: "AV" },
      { label: "Speakers", value: "Speakers" },
      { label: "Mike", value: "Mike" }
    ];
    const eventOptions = this.props.eventList;
    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <CardLayout name="Room">
        <FormGroup row>
          <Col xs="12" md="6">
            <InputElement
              icon="icon-home"
              type="text"
              placeholder="Room name"
              name="roomName"
              maxLength="20"
              required={this.state.roomNameRequired}
              value={Room.roomName}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <Select
              placeholder="Select event"
              value={Room.event}
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
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="6">
            <InputElement
              className="inputNumber"
              icon="icon-pie-chart"
              type="number"
              placeholder="Capacity"
              name="capacity"
              value={Room.capacity}
              inValid={this.state.inValidCapacity}
              maxLength="10"
              required={this.state.capacityRequired}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="3">
            {this.state.editRoom ? (
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
          </Col>
          <ToastContainer autoClose={2000} />
        </FormGroup>
      </CardLayout>
    );
  }
}
const mapStateToProps = state => {
  return {
    rooms: state.room.rooms,
    eventList: state.event.eventList,
    currentRoom: state.room.currentRoom,
    creatEditRoomError: state.room.creatEditRoomError,
    getRoomError: state.room.getRoomError
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getRooms: () => dispatch(actions.getRooms()),
    createRoom: room => dispatch(actions.createRoom(room)),
    editRoom: (id, room) => dispatch(actions.editRoom(id, room)),
    getEvents: () => dispatch(actions.getEvents()),
    getRoomById: id => dispatch(actions.getRoomById(id))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Rooms);

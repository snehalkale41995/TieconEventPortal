import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actions from "../../store/actions/index";
import {
  FormGroup,
  Col,
  Button,
  Card,
  CardHeader,
  Row,
  CardBody
} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal/ModalCart";
class RoomsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: "",
      loading: true,
      deleteFlag: false,
      roomId: ""
    };
  }
  componentDidMount() {
    this.props.getRoomsList();
    this.getRoomErrorToaster();
    this.props.getEvents();
    let compRef = this;
    setTimeout(function() {
      compRef.setState({ loading: false });
    }, 1000);
  }
  getRoomErrorToaster() {
    let compRef = this;
    setTimeout(() => {
      let getRoomError = compRef.props.getRoomError;
      if (getRoomError) {
        toast.error("Something went wrong", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }
    }, 1000);
  }
  onDeleteRoom(cell, row) {
    return (
      <Link to={this} onClick={() => this.confirmDelete(row._id)}>
        <i className="fa fa-trash" title="Delete" />
      </Link>
    );
  }
  confirmDelete(id) {
    let deleteFlag = this.state.deleteFlag;
    this.setState({
      deleteFlag: !deleteFlag,
      roomId: id
    });
  }
  deleteRoom() {
    let id = this.state.roomId;
    this.props.deleteRoom(id);
    let compRef = this;
    this.setState({ deleteFlag: false });
    setTimeout(() => {
      let deleteRoomError = compRef.props.deleteRoomError;
      compRef.Toaster(compRef, deleteRoomError, "Delete");
    }, 1000);
  }

  Toaster(compRef, deleteRoomError, actionName) {
    if (!deleteRoomError) {
      toast.success("Room " + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }
  onEditRoom(cell, row) {
    return (
      <Link
        to={`${this.props.match.url}/rooms/${row._id}`}
        onClick={() => this.getRoomToEdit(row)}
      >
        <i className="fa fa-pencil" title="Edit" />
      </Link>
    );
  }
  getRoomToEdit(row) {
    this.props.storeCurrentRoom(row);
  }
  handleEventChange(value) {
    if (value !== null) {
      this.setState({
        event: value
      });
      this.props.getRoomsForEvent(value);
      this.getRoomErrorToaster();
    } else {
      this.setState({
        event: ""
      });
      this.props.getRoomsList();
      this.getRoomErrorToaster();
    }
  }
  render() {
    const options = {
      sizePerPageList: [
        {
          text: "50",
          value: 50
        },
        {
          text: "100",
          value: 100
        },
        {
          text: "200",
          value: 200
        },
        {
          text: "All",
          value: this.props.roomList.length
        },
        {
          text: "All",
          value: this.props.roomList.length
        }
      ],
      sizePerPage: 50
    };
    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <div>
        <ToastContainer autoClose={2000} />
        <FormGroup row className="marginBottomZero">
          <Col xs="6" md="3">
            <Link to={`${this.props.match.url}/rooms`}>
              <Button type="button" color="primary" size="small">
                <i className="fa fa-plus" />
                Create Room
              </Button>
            </Link>
          </Col>
        </FormGroup>
        <br />
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" lg="12">
              <Card>
                <CardHeader>
                  <FormGroup row className="marginBottomZero">
                    <Col xs="6" md="3">
                      <h1 className="regHeading paddingTop8">Rooms List</h1>
                    </Col>
                  </FormGroup>
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="4">
                      <Select
                        name="Event"
                        placeholder="Select event"
                        options={this.props.eventList}
                        value={this.state.event}
                        simpleValue
                        onChange={this.handleEventChange.bind(this)}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <BootstrapTable
                      ref="table"
                      data={this.props.roomList}
                      pagination={true}
                      search={true}
                      options={options}
                      exportCSV={true}
                      csvFileName="Rooms List"
                    >
                      <TableHeaderColumn
                        dataField="_id"
                        headerAlign="left"
                        isKey
                        hidden
                      >
                        Id
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="roomName"
                        headerAlign="left"
                        width="100"
                        dataSort={true}
                      >
                        Room Name
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="eventName"
                        headerAlign="left"
                        width="100"
                        dataSort={true}
                      >
                        Event Name
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="capacity"
                        headerAlign="left"
                        width="100"
                        dataSort={true}
                      >
                        Capacity
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="edit"
                        dataFormat={this.onEditRoom.bind(this)}
                        headerAlign="left"
                        width="30"
                        export={false}
                      >
                        Edit
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="delete"
                        dataFormat={this.onDeleteRoom.bind(this)}
                        headerAlign="left"
                        width="30"
                        export={false}
                      >
                        Delete
                      </TableHeaderColumn>
                    </BootstrapTable>
                    <Modal
                      openFlag={this.state.deleteFlag}
                      toggleFunction={this.confirmDelete.bind(this)}
                      confirmFunction={this.deleteRoom.bind(this)}
                      message=" Are you sure you want to permanently delete this room ?"
                    />
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    roomList: state.room.rooms,
    eventList: state.event.eventList,
    deleteRoomError: state.room.deleteRoomError,
    getRoomError: state.room.getRoomError
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getRoomsList: () => dispatch(actions.getRooms()),
    storeCurrentRoom: room => dispatch(actions.storeCurrentRoom(room)),
    deleteRoom: id => dispatch(actions.deleteRoom(id)),
    getEvents: () => dispatch(actions.getEvents()),
    getRoomsForEvent: eventId => dispatch(actions.getRoomsForEvent(eventId))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomsList);

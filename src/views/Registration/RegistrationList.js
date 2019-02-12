import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actions from "../../store/actions/index";
import axios from "axios";

import {
  FormGroup,
  Col,
  Button,
  Card,
  CardHeader,
  Row,
  CardBody
} from "reactstrap";
import * as attendeeCardMethod from "../../components/AttendeeCard/";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
import MessageModal from "../../components/Modal/MessageModal";
import Modal from "../../components/Modal/ModalCart";
class RegistrationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: "",
      profile: "",
      loading: true,
      modalPopupFlag: false,
      deleteFlag: false,
      attendeeId: ""
    };
  }
  componentDidMount() {
    let compRef = this;
    this.props.getAttendeeList();
    this.props.getProfileList();
    setTimeout(() => {
      let getAttendeeError = compRef.props.getAttendeeError;
      if (getAttendeeError) {
        toast.error("Something went wrong", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }
      compRef.setState({ loading: false });
    }, 1000);
    this.props.getEvents();
  }
  onPrintAttendeeQRCode(cell, row) {
    return (
      <Link to={this} onClick={() => attendeeCardMethod.onGenerateQRcode(row)}>
        <i className="fa fa-print" title="Print" />
      </Link>
    );
  }

  ondeleteAttendee(cell, row) {
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
      attendeeId: id
    });
  }

  deleteAttendee() {
    let id = this.state.attendeeId;
    this.props.deleteAttendee(id);
    let compRef = this;
    this.setState({ deleteFlag: false });
    setTimeout(() => {
      let deleteAttendeeError = compRef.props.deleteAttendeeError;
      let deleteErrorMsg = compRef.props.deleteError;
      compRef.Toaster(compRef, deleteAttendeeError, "Delete", deleteErrorMsg);
    }, 1000);
  }

  Toaster(compRef, deleteAttendeeError, actionName, deleteErrorMsg) {
    if (!deleteAttendeeError) {
      toast.success("Attendee " + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      deleteErrorMsg
        ? toast.error(deleteErrorMsg, {
            position: toast.POSITION.BOTTOM_RIGHT
          })
        : toast.error("Something went wrong", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
    }
  }

  onEditAttendee(cell, row) {
    return (
      <Link
        to={`${this.props.match.url}/registration/${row._id}`}
        onClick={() => this.props.storeAttendeeData(row)}
      >
        <i className="fa fa-pencil" title="Edit" />
      </Link>
    );
  }

  getSelectedRowKeys() {
    let selectedUsersId = this.refs.table.state.selectedRowKeys;
    if (selectedUsersId.length > 0) {
      let users = [];
      this.props.attendeeList.forEach(attendee => {
        selectedUsersId.forEach(userId => {
          if (attendee._id === userId) {
            users.push({ userInfo: attendee });
          }
        });
      });
      attendeeCardMethod.generateQRcodeBulk(
        users,
        this.state.eventName,
        this.state.profile
      );
    } else {
      this.setState({ modalPopupFlag: true });
    }
  }
  sendemail(attendee) {
    console.log('Here 3',attendee);

    
      axios
        .post(`http://localhost:3011/api/attendee/inform`, attendee)
        .then(response => {  
          console.log("response",response);
       
        })
        .catch(error => {
          console.log("(error)", error.response);
          // dispatch(
          //   creatEditAttendeeFail(error.response.data, error.response.status)
          // );
        });
   
  };
  sendEmailToSelectedRowKeys() {
    console.log('Here',this.refs.table.state.selectedRowKeys);
    let selectedUsersId = this.refs.table.state.selectedRowKeys;
    if (selectedUsersId.length > 0) {
      let users = [];
      this.props.attendeeList.forEach(attendee => {
        selectedUsersId.forEach(userId => {
          if (attendee._id === userId) {
            users.push({ userInfo: attendee });
          }
        });
      });
      users.forEach(user => {
        console.log('Here 2',user.userInfo);
        this.sendemail(user.userInfo)
      });
    } else { 
      this.setState({ modalPopupFlag: true });
    }
  }
  toggleFunction() {
    this.setState({ modalPopupFlag: false });
  }
  handleEventChange(value) {
    if (value !== null) {
      this.setState({ event: value });
      this.props.getAttendeesForEvent(value);
    } else {
      this.setState({ event: "" });
      this.props.getAttendeeList();
    }

    let eventName = "";
    this.props.eventList.forEach(event => {
      if (event.value === value) {
        eventName = event.label;
      }
    });
    this.setState({ eventName });
  }

  handleProfileChange(value) {
    this.setState({ profile: value });
    this.props.getAttendeesForEventAndProfile(this.state.event, value);
    if (this.state.event) {
      if (value === "" || value === null) {
        this.props.getAttendeesForEvent(this.state.event);
      }
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
          value: this.props.attendeeList.length
        }
      ],
      sizePerPage: 50
    };
    const selectRowProp = {
      mode: "checkbox"
    };
    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <div>
        <ToastContainer autoClose={2000} />
        <FormGroup row className="marginBottomZero">
          <Col xs="6" md="3">
            <Link to={`${this.props.match.url}/registration`}>
              <Button type="button" color="primary">
                <i className="fa fa-plus" />
                Add Attendee
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
                    <Col xs="12" md="3">
                      <h1 className="regHeading paddingTop8">Attendee List</h1>
                    </Col>
                    <Col xs="12" md="3">
                      <Select
                        name="Event"
                        placeholder="Select event"
                        options={this.props.eventList}
                        value={this.state.event}
                        simpleValue
                        onChange={this.handleEventChange.bind(this)}
                      />
                    </Col>
                    <Col xs="12" md="3">
                      <Select
                        name="Profile"
                        placeholder="Select profile"
                        options={this.props.profileList}
                        value={this.state.profile}
                        simpleValue
                        onChange={this.handleProfileChange.bind(this)}
                      />
                    </Col>
                    <Col xs="12" md="1">
                      <Button
                        type="button"
                        onClick={this.getSelectedRowKeys.bind(this)}
                        color="success"
                      >
                        <i className="fa fa-print" />
                      
                      </Button>
                    </Col>
                    <Col xs="12" md="1">
                      <Button
                        type="button"
                        onClick={this.sendEmailToSelectedRowKeys.bind(this)}
                        color="success"
                      >
                        <i className="fa fa-envelope" />
                      
                      </Button>
                    </Col>
                  </FormGroup>
                </CardHeader>
                <CardBody>
                  <BootstrapTable
                    ref="table"
                    data={this.props.attendeeList}
                    pagination={true}
                    search={true}
                    selectRow={selectRowProp}
                    options={options}
                    exportCSV={true}
                    csvFileName="Attendee List"
                    version="4"
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
                      dataField="firstName"
                      headerAlign="left"
                      width="60"
                      csvHeader="First Name"
                      dataSort={true}
                    >
                      First Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="lastName"
                      headerAlign="left"
                      width="60"
                      csvHeader="Last Name"
                      dataSort={true}
                    >
                      Last Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="email"
                      headerAlign="left"
                      width="80"
                      csvHeader="Email"
                      dataSort={true}
                    >
                      Email
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="password"
                      headerAlign="left"
                      width="80"
                      dataSort={true}
                    >
                      Password
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="eventName"
                      headerAlign="left"
                      width="80"
                      csvHeader="Event Name"
                      dataSort={true}
                    >
                      Event
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="edit"
                      dataFormat={this.onEditAttendee.bind(this)}
                      headerAlign="left"
                      width="40"
                      export={false}
                    >
                      Edit
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="delete"
                      dataFormat={this.ondeleteAttendee.bind(this)}
                      headerAlign="left"
                      width="40"
                      export={false}
                    >
                      Delete
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="print"
                      dataFormat={this.onPrintAttendeeQRCode.bind(this)}
                      headerAlign="left"
                      width="30"
                      export={false}
                    >
                      Print
                    </TableHeaderColumn>
                  </BootstrapTable>
                  <MessageModal
                    openFlag={this.state.modalPopupFlag}
                    toggleFunction={this.toggleFunction.bind(this)}
                    message="Please select attendees for printing"
                  />
                  <Modal
                    openFlag={this.state.deleteFlag}
                    toggleFunction={this.confirmDelete.bind(this)}
                    confirmFunction={this.deleteAttendee.bind(this)}
                    message=" Are you sure you want to permanently delete this attendee ?"
                  />
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
    registrationError: state.registration.error,
    attendeeList: state.registration.attendeeList,
    eventList: state.event.eventList,
    getAttendeeError: state.registration.getAttendeeError,
    deleteAttendeeError: state.registration.deleteAttendeeError,
    profileList: state.profileList.profileList,
    deleteError: state.registration.deleteError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAttendeeList: () => dispatch(actions.getAttendees()),
    storeAttendeeData: attendee =>
      dispatch(actions.storeAttendeeData(attendee)),
    deleteAttendee: id => dispatch(actions.deleteAttendee(id)),
    getEvents: () => dispatch(actions.getEvents()),
    getAttendeesForEvent: eventId =>
      dispatch(actions.getAttendeesForEvent(eventId)),
    getAttendeesForEventAndProfile: (eventId, profileName) =>
      dispatch(actions.getAttendeesForEventAndProfile(eventId, profileName)),
    getProfileList: () => dispatch(actions.getProfileList())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationList);

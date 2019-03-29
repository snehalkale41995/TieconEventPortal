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
import Select from "react-select";
import "react-select/dist/react-select.css";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";
import * as attendeeCardMethod from "../../components/AttendeeCard/";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
import MessageModal from "../../components/Modal/MessageModal";
import Modal from "../../components/Modal/ModalCart";
class SpeakerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: "",
      loading: true,
      modalPopupFlag: false,
      deleteFlag: false,
      speakerId: ""
    };
  }
  componentDidMount() {
    this.props.getSpeakerList();
    this.props.getEvents();
    let compRef = this;
    setTimeout(() => {
      compRef.setState({ loading: false });
    }, 1000);
  }

  deleteSpeaker() {
    let id = this.state.speakerId;
    let compRef = this;
    this.props.deleteSpeaker(id);
    this.setState({ deleteFlag: false });
    setTimeout(() => {
      let speakerDeleted = this.props.speakerDeleted;
      compRef.Toaster(compRef, speakerDeleted, "Deleted");
    }, 2000);
  }
  ondeleteSpeaker(cell, row) {
    return (
      <Link to={this} onClick={() => this.confirmDelete(row._id)}>
        <i className="fa fa-trash" />
      </Link>
    );
  }
  confirmDelete(id) {
    let deleteFlag = this.state.deleteFlag;
    this.setState({
      deleteFlag: !deleteFlag,
      speakerId: id
    });
  }

  onEditSpeaker(cell, row) {
    return (
      <Link
        to={`${this.props.match.url}/speakerForm/${row._id}`}
        onClick={() => this.props.storeSpeakerData(row)}
      >
        <i className="fa fa-pencil" title="Edit" />
      </Link>
    );
  }
  handleEventChange(value) {
    if (value !== null) {
      this.setState({ event: value });
      this.props.getSpeakersForEvent(value);
      let eventName = "";
      this.props.eventList.forEach(event => {
        if (event.value === value) {
          eventName = event.label;
        }
      });
      this.setState({ eventName });
    } else {
      this.setState({ event: "" });
      this.props.getSpeakerList();
    }
  }

  Toaster(compRef, successFlag, actionName) {
    if (successFlag) {
      toast.success("Speaker " + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  getSelectedRowKeys() {
    let selectedUsersId = this.refs.table.state.selectedRowKeys;
    if (selectedUsersId.length > 0) {
      let users = [];
      this.props.speakerList.forEach(speaker => {
        selectedUsersId.forEach(userId => {
          if (speaker._id === userId) {
            users.push({ userInfo: speaker });
          }
        });
      });
      attendeeCardMethod.generateQRcodeBulk(
        users,
        this.state.eventName,
        "speaker"
      );
    } else {
      this.setState({ modalPopupFlag: true });
    }
  }

  sendEmailToSelectedRowKeys() {
    let selectedUsersId = this.refs.table.state.selectedRowKeys;
    if (selectedUsersId.length > 0) {
      let users = [];
      this.props.speakerList.forEach(speaker => {
        selectedUsersId.forEach(userId => {
          if (speaker._id === userId) {
            users.push({ userInfo: speaker });
          }
        });
      });
      users.forEach(user => {
        this.props.sendEmailToSpeaker(user.userInfo);
      });
      // this.props.getAttendeeList();
    } else {
      this.setState({ modalPopupFlag: true });
    }
  }
  toggleFunction() {
    this.setState({ modalPopupFlag: false });
  }
  onPrintSpeakerQRCode(cell, row) {
    return (
      <Link to={this} onClick={() => attendeeCardMethod.onGenerateQRcode(row)}>
        <i className="fa fa-print" />
      </Link>
    );
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
          value: this.props.speakerList.length
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
            <Link to={`${this.props.match.url}/speakerForm`}>
              <Button type="button" color="primary" size="small">
                <i className="fa fa-plus" />
                Add Speaker
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
                      <h1 className="regHeading paddingTop8">Speaker List</h1>
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
                    <Col
                      xs="12"
                      md="1"
                      style={{ marginLeft: 30, marginTop: 7 }}
                    >
                      <Button
                        type="button"
                        onClick={this.getSelectedRowKeys.bind(this)}
                        color="success"
                        title="Print QR code"
                      >
                        <i className="fa fa-print" />
                      </Button>
                    </Col>
                    {/* <Col xs="12" md="1" style={{ marginTop: 7 }}>
                      <Button
                        type="button"
                        onClick={this.sendEmailToSelectedRowKeys.bind(this)}
                        color="success"
                        title="Send email"
                      >
                        <i className="fa fa-envelope" />
                      </Button>
                    </Col> */}
                  </FormGroup>
                </CardHeader>
                <CardBody>
                  <BootstrapTable
                    ref="table"
                    data={this.props.speakerList}
                    pagination={true}
                    search={true}
                    selectRow={selectRowProp}
                    options={options}
                    exportCSV={true}
                    csvFileName="Speakers List.csv"
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
                      width="100"
                      csvHeader="First Name"
                      dataSort={true}
                    >
                      First Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="lastName"
                      headerAlign="left"
                      width="100"
                      csvHeader="Last Name"
                      dataSort={true}
                    >
                      Last Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="email"
                      headerAlign="left"
                      width="100"
                      csvHeader="Email"
                      dataSort={true}
                    >
                      Email
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="password"
                      headerAlign="left"
                      width="100"
                      dataSort={true}
                    >
                      Password
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="eventName"
                      headerAlign="left"
                      width="100"
                      csvHeader="Event"
                      dataSort={true}
                    >
                      Event
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="edit"
                      dataFormat={this.onEditSpeaker.bind(this)}
                      headerAlign="left"
                      width="40"
                      export={false}
                    >
                      Edit
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="delete"
                      dataFormat={this.ondeleteSpeaker.bind(this)}
                      headerAlign="left"
                      width="40"
                      export={false}
                    >
                      Delete
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="print"
                      dataFormat={this.onPrintSpeakerQRCode.bind(this)}
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
                    message="Please select speakers for printing"
                  />
                  <Modal
                    openFlag={this.state.deleteFlag}
                    toggleFunction={this.confirmDelete.bind(this)}
                    confirmFunction={this.deleteSpeaker.bind(this)}
                    message=" Are you sure you want to permanently delete this speaker ?"
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
    speakerError: state.speaker.error,
    speakerList: state.speaker.speakerList,
    eventList: state.event.eventList,
    speakerDeleted: state.speaker.speakerDeleted
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendEmailToSpeaker: speaker =>
      dispatch(actions.sendEmailToSpeaker(speaker)),
    getSpeakerList: () => dispatch(actions.getSpeakers()),
    storeSpeakerData: attendee => dispatch(actions.storeSpeakerData(attendee)),
    deleteSpeaker: id => dispatch(actions.deleteSpeaker(id)),
    getEvents: () => dispatch(actions.getEvents()),
    getSpeakersForEvent: eventId =>
      dispatch(actions.getSpeakersForEvent(eventId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeakerList);

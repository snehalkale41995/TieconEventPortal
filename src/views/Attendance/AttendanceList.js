import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import * as actions from "../../store/actions/index";
import { FormGroup, Col, Button, Input, InputGroup } from "reactstrap";
import CardLayout from "../../components/CardLayout/";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";
import _ from "lodash";
class AttendanceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: "",
      session: ""
    };
  }
  componentDidMount() {
    let thisRef = this;
    this.props.getAttendanceList();
    this.props.getEvents();
  }

  handleEventChange(value) {
    if (value !== null) {
      this.props.getAttendanceByEvent(value);
      this.setState({ event: value });
      this.props.getSessions(value);
    } else {
      this.setState({ event: "", session: "" });
    }
  }

  handleSessionChange(value) {
    let eventId = this.state.event;
    if (value !== null) {
      this.props.getAttendanceBySession(eventId, value);
      this.setState({ session: value });
    } else {
      this.setState({ session: "" });
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
          value: this.props.attendanceList.length
        }
      ],
      sizePerPage: 50
    };
    return (
      <CardLayout name="Attendance List">
        <FormGroup row>
          <Col xs="12" md="4">
            <Select
              name="Event"
              placeholder="Select event"
              options={this.props.events}
              value={this.state.event}
              simpleValue
              onChange={this.handleEventChange.bind(this)}
            />
          </Col>
          <Col md="4">
            <Select
              name="Session"
              placeholder="Select session"
              options={this.props.sessions}
              value={this.state.session}
              simpleValue
              onChange={this.handleSessionChange.bind(this)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <BootstrapTable
            ref="table"
            data={this.props.attendanceList}
            pagination={true}
            search={true}
            options={options}
            exportCSV={true}
            csvFileName="Attendance List"
            version="4"
          >
            <TableHeaderColumn dataField="_id" headerAlign="left" isKey hidden>
              Id
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="userName"
              headerAlign="left"
              width="100"
              csvHeader="Attendee Name"
              dataSort={true}
            >
              Attendee Name
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="eventName"
              headerAlign="left"
              width="100"
              csvHeader="Event Name"
              dataSort={true}
            >
              Event Name
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="sessionName"
              headerAlign="left"
              width="100"
              dataSort={true}
              csvHeader="Session Name"
            >
              Session Name
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField="profile"
              headerAlign="left"
              width="100"
              csvHeader="Profile"
              dataSort={true}
            >
              Profile
            </TableHeaderColumn>
          </BootstrapTable>
        </FormGroup>
      </CardLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    attendanceList: state.attendance.attendance,
    events: state.event.eventList,
    sessions: state.questionForm.sessions,
    attendeeList: state.registration.attendeeList,
    speakerList: state.speaker.speakerList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAttendanceList: () => dispatch(actions.getAttendanceList()),
    getAttendanceByEvent: eventId =>
      dispatch(actions.getAttendanceByEvent(eventId)),
    getAttendanceBySession: (eventId, sessionId) =>
      dispatch(actions.getAttendanceBySession(eventId, sessionId)),
    getEvents: () => dispatch(actions.getEvents()),
    getSessions: id => dispatch(actions.getSessionsOfEvent(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttendanceList);

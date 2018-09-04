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

class AttendanceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: "",
      session: "",
      attendance: []
    };
  }
  componentDidMount() {
    this.props.getAttendanceList();
    this.props.getEvents();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.attendanceList !== this.props.attendanceList) {
      this.setState({
        attendance: this.props.attendanceList
      });
    }
  }
  handleEventChange(value) {
    if (value !== null) {
      this.setState({ event: value });
      this.props.getSessions(value);
    } else {
      this.setState({ event: "", session: "" });
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
          value: this.state.attendance.length
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
              //onChange = {this.handleEventChange.bind(this)}
            />
          </Col>
          <Col md="4">
            {this.props.attendanceError !== "" ? (
              <div
                style={{ color: "red", marginTop: -50, fontSize: 15 }}
                className="help-block"
              >
                Error : {this.props.attendanceError}
              </div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row>
          <BootstrapTable
            ref="table"
            data={this.state.attendance}
            pagination={true}
            search={true}
            options={options}
            exportCSV={true}
            csvFileName="Attendance List"
          >
            <TableHeaderColumn dataField="_id" headerAlign="left" isKey hidden>
              Id
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="attendeeName"
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
              dataField="scannedBy"
              headerAlign="left"
              width="100"
              csvHeader="Scanned By"
              dataSort={true}
            >
              Scanned By
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="time"
              headerAlign="left"
              width="100"
              csvHeader="Time"
              dataSort={true}
            >
              Time
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
    attendanceError: state.attendance.error,
    events: state.event.eventList,
    sessions: state.questionForm.sessions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAttendanceList: () => dispatch(actions.getAttendanceList()),
    getEvents: () => dispatch(actions.getEvents()),
    getSessions: id => dispatch(actions.getSessionsOfEvent(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttendanceList);

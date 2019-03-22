import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import * as actions from "../../store/actions/index";
import {
  Row,
  Col,
  Button,
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  FormGroup
} from "reactstrap";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";
import _ from "lodash";
class SessionQA extends Component {
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
      this.props.getAttendanceList();
    }
  }

  handleSessionChange(value) {
    let eventId = this.state.event;
    if (value !== null) {
      this.props.getAttendanceBySession(eventId, value);
      this.setState({ session: value });
    } else {
      this.setState({ session: "" });
      this.props.getAttendanceList();
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
      <div>
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" lg="12">
              <Card>
                <CardHeader>
                  <FormGroup row className="marginBottomZero">
                    <Col xs="12" md="4">
                      <h1 className="regHeading paddingTop8">
                        Session Questions
                      </h1>
                    </Col>
                    <Col xs="10" md="3">
                      <Select
                        name="Event"
                        placeholder="Select event"
                        options={this.props.events}
                        value={this.state.event}
                        simpleValue
                        onChange={this.handleEventChange.bind(this)}
                      />
                    </Col>
                    <Col xs="10" md="3">
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
                </CardHeader>
                <CardBody>
                  <BootstrapTable
                    ref="table"
                    data={this.props.attendanceList}
                    pagination={true}
                    search={true}
                    options={options}
                    exportCSV={true}
                    csvFileName="Session Questions"
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
    attendanceList: state.attendance.attendance,
    events: state.event.eventList,
    sessions: state.questionForm.sessions
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
)(SessionQA);

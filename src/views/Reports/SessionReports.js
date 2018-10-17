import React, { Component } from "react";
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
import _ from "lodash";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
class SessionReports extends React.Component {
  constructor() {
    super();
    this.state = {
      attendanceList: [],
      eventDropDown: [],
      attendee: [],
      attendanceData: [],
      tableVisible: false,
      attendanceDataFiltered: [],
      roles: new Set(),
      event: "",
      session: "",
      sessions : []
    };
    this.renderTable = this.renderTable.bind(this);
  }

  componentDidMount() {
    this.props.getAttendanceList();
    this.props.getEvents();
  }

  handleEventChange(value) {
    let thisRef = this;
    if (value !== null) {
      this.props.getAttendanceByEvent(value);
      this.setState({ event: value, tableVisible: false });
      this.props.getSessions(value);
      setTimeout(function() {
        thisRef.setState({ sessions: thisRef.props.sessions });
      }, 1000);
      this.renderCounts();
    } else {
      this.setState({ event: "", session: "" });
      this.props.getAttendanceList();
      thisRef.setState({ sessions: [] });
      this.renderCounts();
    }
  }

  handleSessionChange(value) {
    let eventId = this.state.event;
    if (value !== null) {
      this.props.getAttendanceBySession(eventId, value);
      this.setState({ session: value, tableVisible: false });
      this.renderCounts();
    } else {
      this.setState({ session: "" });
      this.props.getAttendanceList();
      this.renderCounts();
    }
  }

  renderCounts() {
    let color = [
      "primary",
      "secondary",
      "success",
      "info",
      "warning",
      "danger",
      "link"
    ];
    let roles = this.props.roles;
    let sessionsCount = [];
    roles.forEach(item => {
      sessionsCount.push({
        label: item,
        count: _.filter(this.props.attendanceList, { profile: item }).length
      });
    });
    return sessionsCount.map((item, index) => (
      <Button
        style={{ marginRight: 20, marginBottom: 20 }}
        color={color[index] ? color[index] : color[1]}
        onClick={this.renderTable.bind(this, item.label)}
        outline
      >
        {item.label} <Badge color="secondary">{item.count}</Badge>
      </Button>
    ));
  }

  renderTable(role) {
    let attendanceData = Object.assign([], this.props.attendanceList);
    this.setState({
      attendanceDataFiltered: _.filter(attendanceData, { profile: role }),
      tableVisible: true
    });
  }

  render() {
    // Define constant for sorting
    const sortingOptions = {
      defaultSortName: "userName",
      defaultSortOrder: "asc",
      sizePerPage: 50,
      paginationPosition: "top",
      hideSizePerPage: true
    };
    let counts = this.renderCounts();
    let totalCounts = this.props.attendanceList.length;
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
                         Attendance Report
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
                        options={this.state.sessions}
                        value={this.state.session}
                        simpleValue
                        onChange={this.handleSessionChange.bind(this)}
                      />
                    </Col>
                  </FormGroup>
                </CardHeader>
                {/* <div>{totalCounts}</div> */}
                <div style={{ padding: "10px 20px" }}>{counts}</div>
                <CardBody
                  style={{
                    display: this.state.tableVisible ? "block" : "none"
                  }}
                >
                  <BootstrapTable
                    ref="table"
                    data={this.state.attendanceDataFiltered}
                    pagination={true}
                    options={sortingOptions}
                    version="4"
                  >
                    <TableHeaderColumn
                      dataField="id"
                      headerAlign="left"
                      isKey
                      hidden
                    >
                      ID
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="userName"
                      headerAlign="left"
                      width="200"
                      dataSort
                    >
                      Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="eventName"
                      headerAlign="left"
                      width="200"
                      dataSort
                    >
                      Event Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="sessionName"
                      headerAlign="left"
                      width="200"
                      dataSort
                    >
                      Session Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="profile"
                      headerAlign="left"
                      width="250"
                    >
                      Profile Name
                    </TableHeaderColumn>
                  </BootstrapTable>
                </CardBody>
                <div
                  style={{
                    display: totalCounts != 0 ? "none" : "block",
                    margin: "auto",
                    paddingBottom: 15
                  }}
                >
                  No Data Found
                </div>
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
    sessions: state.questionForm.sessions,
    roles: state.attendance.roles
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
)(SessionReports);

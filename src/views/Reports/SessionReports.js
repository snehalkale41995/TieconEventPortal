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
      session: ""
    };

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.refresh = this.refresh.bind(this);
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

  // // Method for get attendance data
  // componentWillMount() {
  //   let componentRef = this;
  //   let events = [],
  //     eventList = [],
  //     eventsID = [],
  //     attendee = [];
  //   // let sessionList = localStorage.getItem("sessionList");
  //   // var sessions = JSON.parse(sessionList);

  //   // for (var key in sessions) {
  //   //   eventList.push({
  //   //     label: sessions[key]["sessionInfo"]["eventName"],
  //   //     value: sessions[key]["id"]
  //   //   });
  //   // }
  //   // this.setState({ eventDropDown: eventList });
  // }

  refresh() {
    this.handleSelectChange(this.state.value);
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

    let sessions = this.state.roles;
    let sessionsCount = [];
    sessions.forEach(item => {
      sessionsCount.push({
        label: item,
        count: _.filter(this.state.attendanceData, { profiles: item }).length
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
    let attendanceData = Object.assign([], this.state.attendanceData);
    this.setState({
      attendanceDataFiltered: _.filter(attendanceData, { profiles: role }),
      tableVisible: true
    });
  }
  // Method For handle changed value of dropdown & fill attendance list table
  handleSelectChange(value) {
    let tableVisible = this.setState.tableVisible;
    let attendanceList = [],
      attendeeList = [],
      attendanceData = [];
    let roles = new Set();
    if (value != null) {
      // Query for get attendance data by session Id
      // DBUtil.getDocRef("Attendance")
      //   .where("sessionId", "==", value)
      //   .get()
      //   .then(snapshot => {
      //     snapshot.forEach(function(doc) {
      //       var data = doc.data();
      //       attendanceData.push({
      //         id: doc.id,
      //         fullName: data.userName,
      //         profiles: data.userRole,
      //         userId: data.userId
      //       });
      //       roles.add(data.userRole);
      //     });
      //     // Set default value for current state
      //     this.setState({
      //       attendanceData: Object.assign(
      //         [],
      //         _.uniqBy(attendanceData, "userId")
      //       ),
      //       roles,
      //       value,
      //       tableVisible: false
      //     });
      //   });
      this.renderCounts();
    }
  }

  render() {
    // Define constant for sorting
    const sortingOptions = {
      defaultSortName: "fullName",
      defaultSortOrder: "asc",
      sizePerPage: 50,
      paginationPosition: "top",
      hideSizePerPage: true
    };
    let counts = this.renderCounts();
    return (
      <div>
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" lg="12">
              <Card>
                <CardHeader>
                  <FormGroup row className="marginBottomZero">
                    <Col xs="12" md="6">
                      <h1 className="regHeading paddingTop8">
                        Session Attendance Report
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
                    <Col
                      xs="1"
                      md="1"
                      style={{ display: counts.length == 0 ? "none" : "block" }}
                      className="refresh"
                    >
                      <i
                        style={{ fontWeight: "bold" }}
                        onClick={this.refresh}
                        title="Refresh"
                        className="icon-refresh"
                      />
                    </Col>
                  </FormGroup>
                </CardHeader>
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
                      dataField="fullName"
                      headerAlign="left"
                      width="200"
                      dataSort
                    >
                      Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="profiles"
                      headerAlign="left"
                      width="250"
                    >
                      Profile Name
                    </TableHeaderColumn>
                  </BootstrapTable>
                </CardBody>
                <div
                  style={{
                    display: counts.length != 0 ? "none" : "block",
                    margin: "auto",
                    paddingBottom: 15
                  }}
                >
                  Please select a Session
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
)(SessionReports);

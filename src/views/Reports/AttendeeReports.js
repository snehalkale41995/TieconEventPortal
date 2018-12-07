import React, { Component } from "react";
import { Bar, Doughnut, Line, Pie, Polar, Radar } from "react-chartjs-2";
import {
  CardColumns,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  FormGroup
} from "reactstrap";
import _ from "lodash";
import Highcharts from "highcharts";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Select from "react-select";
import "react-select/dist/react-select.css";

class AttendeeReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfiles: [],
      attendeeList: [],
      attendeeCounter: [],
      event: ""
    };
  }

  componentDidMount() {
    let thisRef = this;
    this.props.getAttendeeList();
    this.props.getSpeakerList();
    this.props.getProfileArray();
    this.props.getEvents();
    setTimeout(function() {
      thisRef.getCounts();
    }, 1000);
  }

  handleEventChange(value) {
    let thisRef = this;
    if (value !== null) {
      this.setState({ event: value, tableVisible: false });
      this.props.getAttendeesForEvent(value);
      this.props.getSpeakersForEvent(value);
      setTimeout(function() {
        thisRef.getCounts();
      }, 1000);
    } else {
      this.setState({ event: "" });
      this.props.getAttendeeList();
      this.props.getSpeakerList();
      setTimeout(function() {
        thisRef.getCounts();
      }, 1000);
    }
  }
  getCounts() {
    let attendeeProfileDetails = this.props.attendeeList.concat(
      this.props.speakerList
    );
    let profileRoles = this.props.ProfileArray;
    let attendeeCounter = [];

    profileRoles.forEach((role, index) => {
      if (index == 0) {
        attendeeCounter.push({
          name: role,
          y: _.filter(attendeeProfileDetails, { roleName: role }).length,
          sliced: true,
          selected: true
        });
      } else {
        attendeeCounter.push({
          name: role,
          y: _.filter(attendeeProfileDetails, { roleName: role }).length
        });
      }
    });
    this.setState({
      attendeeCounter: attendeeCounter
    });
    this.createPieChart();
  }

  createPieChart() {
    Highcharts.chart("profileReport", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie"
      },
      title: {
        text: "Profile Report"
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>"
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.y} ",
            style: {
              color:
                (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                "black"
            }
          }
        }
      },
      series: [
        {
          name: "Profile Report",
          colorByPoint: true,
          data: this.state.attendeeCounter
        }
      ]
    });
  }
  render() {
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-left">
          <Col>
            <FormGroup>
              <Col xs="12" md="12" style={{ float: "left" }}>
                <Card>
                  <CardHeader>
                    <FormGroup row className="marginBottomZero">
                      <Col xs="12" md="4">
                        <h1 className="regHeading paddingTop8">
                          Registration Report
                        </h1>
                      </Col>
                      <Col xs="10" md="3">
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
                  </CardHeader>
                  <CardBody>
                    <div
                      id="profileReport"
                      style={{
                        minwidth: "310px",
                        height: "400px",
                        maxwidth: "600px",
                        margin: "0 auto"
                      }}
                    />
                  </CardBody>
                </Card>
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    attendeeList: state.registration.attendeeList,
    eventList: state.event.eventList,
    ProfileArray: state.profileList.ProfileArray,
    speakerList: state.speaker.speakerList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAttendeeList: () => dispatch(actions.getAttendees()),
    getSpeakerList: () => dispatch(actions.getSpeakers()),
    getEvents: () => dispatch(actions.getEvents()),
    getAttendeesForEvent: eventId =>
      dispatch(actions.getAttendeesForEvent(eventId)),
    getSpeakersForEvent: eventId =>
      dispatch(actions.getSpeakersForEvent(eventId)),
    getProfileArray: () => dispatch(actions.getProfileArray())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttendeeReports);

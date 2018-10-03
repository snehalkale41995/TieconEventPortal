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
class AttendeeReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfiles: [],
      attendeeList: [],
      attendeeCounter: []
    };
  }

  componentWillMount() {
    // this.getUserProfiles();
    // this.getAttendees();
    let thisRef = this;
    this.props.getAttendeeList();
    this.props.getSpeakerList();
    this.props.getProfileList();
    setTimeout(function() {
      thisRef.getCounts();
    }, 1000);
  }

  getUserProfiles() {
    let thisRef = this;
    // DBUtil.getDocRef("UserProfiles")
    //   .get()
    //   .then(snapshot => {
    //     let updatedProfiles = [...thisRef.state.userProfiles];
    //     snapshot.forEach(function(doc) {
    //       updatedProfiles.push(doc.data().profileName);
    //     });
    //     thisRef.setState({
    //       userProfiles: updatedProfiles
    //     });
    //   })
    //   .catch(err => {
    //     console.log("Error", err);
    //   });
  }

  getAttendees() {
    let thisRef = this;
    // DBUtil.getDocRef("Attendee")
    //   .get()
    //   .then(snapshot => {
    //     let updatedAttendeeList = [...thisRef.state.attendeeList];
    //     snapshot.forEach(doc => {
    //       updatedAttendeeList.push({
    //         profiles: doc.data().profileServices[0],
    //         name: doc.data().fullName
    //       });
    //     });
    //     thisRef.setState({
    //       attendeeList: updatedAttendeeList
    //     });
    //     thisRef.getCounts();
    //   })
    //   .catch(err => {
    //     console.log("Error", err);
    //   });
  }

  getCounts() {
    console.log("profileList", this.props.profileList);
    let attendeeProfileDetails = this.props.attendeeList.concat(
      this.props.speakerList
    );
    console.log("attendeeProfileDetails", attendeeProfileDetails);
    let profileRoles = this.props.profileList;

    let attendeeCounter = [];

    profileRoles.forEach((role, index) => {
      if (index == 0) {
        attendeeCounter.push({
          name: role.label,
          y: _.filter(attendeeProfileDetails, { roleName: role.label }).length,
          sliced: true,
          selected: true
        });
      } else {
        attendeeCounter.push({
          name: role.label,
          y: _.filter(attendeeProfileDetails, { roleName: role.label }).length
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
                  <CardHeader>Profile Report</CardHeader>
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
    profileList: state.profileList.profileList,
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
    getProfileList: () => dispatch(actions.getProfileList())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttendeeReports);

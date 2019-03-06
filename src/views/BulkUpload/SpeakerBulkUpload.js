import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import moment from "moment";
import Loader from "../../components/Loader/Loader";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
class SpeakerBulkRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      loading: true
    };
  }
  componentDidMount() {
    this.props.getEvents();
    let compRef = this;
    setTimeout(function() {
      compRef.setState({ loading: false });
    }, 1000);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.events !== this.props.events) {
      this.setState({
        events: this.props.events
      });
    }
  }
  render() {
    var ColorCode = "#808587";
    let today = new Date().setHours(0, 0, 0, 0);
    if (this.state.loading || this.props.events.length === 0) {
      return <Loader loading={this.state.loading} />;
    } else {
      return (
        <div className="animated fadeIn">
          <div>
            {this.props.events.map((event, index) => {
              index % 2 === 0
                ? (ColorCode = "#8bc3d7")
                : (ColorCode = "#808587");
                
         if(today<=new Date(event["endDate"]).setHours(0, 0, 0, 0)){
              return (
                <Row key={index} className="justify-content-left">
                  <Col xs="6">
                    <Card
                      className="mx-12"
                      style={{ backgroundColor: ColorCode }}
                    >
                      <CardHeader>
                        <h3>{event.eventName}</h3>
                      </CardHeader>
                      <CardBody
                        style={{ fontWeight: "bold", fontSize: 20 }}
                        className="p-8"
                      >
                        <Row>
                        <Col xs="12">
                          <h5> {event.description} </h5>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="12" md="4">
                            <h5>
                              <i className="fa fa-map-marker" /> {event.venue}
                            </h5>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="8">
                            <h5>
                              <i className="fa fa-clock-o" />
                              {moment(event.startDate).format(
                                "DD.MM.YYYY"
                              )} - {moment(event.endDate).format("DD.MM.YYYY")}
                            </h5>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                  <ToastContainer autoClose={2000} />
                </Row>
              );
         }
            })}
          </div>
          {/* <div>
            <div class="pm-button">
              <a href="https://www.payumoney.com/paybypayumoney/#/AA5AF4F8AAE527C22E26FA4FB3A0CCAE">
                <img src="https://www.payumoney.com/media/images/payby_payumoney/new_buttons/21.png" />
              </a>
            </div>{" "}
          </div> */}
        </div>
      );
    }
  }
}
const mapStateToProps = state => {
  return {
    events: state.event.events
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getEvents: () => dispatch(actions.getEvents())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeakerBulkRegistration);

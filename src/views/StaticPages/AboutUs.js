import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { FormGroup, Col, Button } from "reactstrap";
import InputElement from "../../components/Input/";
import CardLayout from "../../components/CardLayout/";
import _ from "lodash";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutUs: {
        info: "",
        url: "",
        event: ""
      },
      loading: true,
      infoRequired: false,
      eventRequired: false,
      invalidUrl: false
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
    if (prevProps.aboutUs !== this.props.aboutUs) {
      let isEmpty = !Object.keys(this.props.aboutUs).length;
      if (!isEmpty) {
        this.setState({
          aboutUs: this.props.aboutUs
        });
      } else {
        this.setState(prevState => ({
          aboutUs: {
            ...prevState.aboutUs,
            info: "",
            url: ""
          }
        }));
      }
    }
  }
  onChangeInput(event) {
    let aboutUs = { ...this.state.aboutUs };
    aboutUs[event.target.name] = event.target.value;
    this.setState({
      aboutUs: aboutUs,
      infoRequired: false,
      eventRequired: false,
      invalidUrl: false
    });
  }
  handleEventChange(value) {
    if (value !== null) {
      let aboutUs = { ...this.state.aboutUs };
      aboutUs.event = value;
      this.setState({
        aboutUs: aboutUs,
        infoRequired: false,
        eventRequired: false,
        invalidUrl: false
      });
      this.props.getAboutUsForEvent(value);
      let compRef = this;
      setTimeout(() => {
        let getAboutUsError = compRef.props.getAboutUsError;
        if (getAboutUsError) {
          toast.error("Something went wrong", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }
      }, 1000);
    } else {
      this.onReset();
    }
  }
  onSubmit() {
    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    var invalidUrl = false;
    if (!re.test(this.state.aboutUs.url)) {
      invalidUrl = true;
    }
    if (this.state.aboutUs.info && this.state.aboutUs.event && !invalidUrl) {
      this.setState({ loading: true });
      let isEmpty = !Object.keys(this.props.aboutUs).length;
      let aboutUs = _.pick(this.state.aboutUs, ["info", "url", "event"]);
      let id;
      !isEmpty ? (id = this.props.aboutUs._id) : null;
      isEmpty
        ? this.props.createAboutUs(aboutUs)
        : this.props.editAboutUs(id, aboutUs);
      let compRef = this;
      setTimeout(() => {
        let creatEditAboutUsError = compRef.props.creatEditAboutUsError;
        let status = "";
        !isEmpty ? (status = "Updated") : (status = "Created");
        compRef.Toaster(compRef, creatEditAboutUsError, status);
      }, 1000);
    } else {
      !this.state.aboutUs.info ? this.setState({ infoRequired: true }) : null;
      !this.state.aboutUs.event ? this.setState({ eventRequired: true }) : null;
      invalidUrl ? this.setState({ invalidUrl: true }) : null;
    }
  }
  Toaster(compRef, createEditError, actionName) {
    this.setState({ loading: false });
    if (!createEditError) {
      this.onReset();
      toast.success("About Us Information " + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }
  onReset() {
    this.setState(prevState => ({
      aboutUs: {
        ...prevState.aboutUs,
        info: "",
        url: "",
        event: ""
      },
      infoRequired: false,
      eventRequired: false,
      invalidUrl: false
    }));
  }
  render() {
    const { info, url, event } = { ...this.state.aboutUs };
    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <CardLayout name="About Us">
        <FormGroup row>
          <Col xs="12" md="4">
            <Select
              placeholder="Select event"
              value={event}
              options={this.props.eventList}
              simpleValue
              onChange={this.handleEventChange.bind(this)}
            />
            {this.state.eventRequired ? (
              <div
                style={{ color: "red", marginTop: -1 }}
                className="help-block"
              >
                *Please select event
              </div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="6">
            <InputElement
              icon="icon-info"
              type="text"
              placeholder="Information about us"
              name="info"
              maxLength="250"
              value={info}
              required={this.state.infoRequired}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <InputElement
              icon="icon-link"
              type="text"
              placeholder="Website Url"
              name="url"
              inValid={this.state.invalidUrl}
              value={url}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="3">
            <Button
              type="button"
              size="md"
              color="success"
              onClick={() => this.onSubmit()}
            >
              Submit
            </Button>
          </Col>
          <Col md="3">
            <Button
              type="button"
              size="md"
              color="danger"
              onClick={() => this.onReset()}
              style={{ marginLeft: -160 }}
            >
              Reset
            </Button>
          </Col>
          <Col md="6">
            <ToastContainer autoClose={2000} />
          </Col>
        </FormGroup>
      </CardLayout>
    );
  }
}
const mapStateToProps = state => {
  return {
    aboutUs: state.staticPages.aboutUs,
    getAboutUsError: state.staticPages.getAboutUsError,
    creatEditAboutUsError: state.staticPages.creatEditAboutUsError,
    eventList: state.event.eventList
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getEvents: () => dispatch(actions.getEvents()),
    getAboutUs: () => dispatch(actions.getAboutUsInfo()),
    createAboutUs: aboutUs => dispatch(actions.createAboutUsInfo(aboutUs)),
    editAboutUs: (id, aboutUs) =>
      dispatch(actions.editAboutUsInfo(id, aboutUs)),
    getAboutUsForEvent: eventId => dispatch(actions.getAboutUsForEvent(eventId))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutUs);

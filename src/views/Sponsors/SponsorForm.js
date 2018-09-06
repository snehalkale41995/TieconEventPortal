import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { FormGroup, Col, Button } from "reactstrap";
import InputElement from "../../components/Input/";
import CardLayout from "../../components/CardLayout/";
import Select from "react-select";
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
class SponsorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Sponsor: {
        name: "",
        event: "",
        description: "",
        websiteURL: "",
        imageURL: "",
        category: ""
      },
      editSponsor: false,
      nameRequired: false,
      eventRequired: false,
      categoryRequired: false,
      invalidImageUrl: false,
      invalidWebsiteUrl: false,
      loading: false
    };
  }
  componentDidMount() {
    this.props.getEvents();
    if (this.props.match.params.id !== undefined) {
      let currentSponsor = _.pick(this.props.currentSponsor, [
        "name",
        "eventName",
        "category",
        "websiteURL",
        "imageURL",
        "description"
      ]);
      let Empty = !Object.keys(currentSponsor).length;
      if (!Empty) {
        currentSponsor.event = this.props.currentSponsor.event._id;
        this.setState({
          ...this.state.Sponsor,
          Sponsor: currentSponsor,
          editSponsor: true
        });
      } else {
        this.setState({ loading: true });
        this.props.getSponsorById(this.props.match.params.id);
        let compRef = this;
        setTimeout(function() {
          let currentSponsor = _.pick(compRef.props.currentSponsor, [
            "name",
            "eventName",
            "category",
            "websiteURL",
            "imageURL",
            "description"
          ]);
          let Empty = !Object.keys(currentSponsor).length;
          if (Empty) {
            compRef.props.history.push("/sponsors");
          } else {
            currentSponsor.event = compRef.props.currentSponsor.event;
            compRef.setState({
              ...compRef.state.Sponsor,
              Sponsor: currentSponsor,
              editSponsor: true,
              loading: false
            });
          }
        }, 1000);
      }
    }
  }
  onChangeInput(event) {
    const { Sponsor } = { ...this.state };
    Sponsor[event.target.name] = event.target.value;
    this.setState({
      Sponsor: Sponsor,
      nameRequired: false,
      invalidImageUrl: false,
      invalidWebsiteUrl: false
    });
  }
  handleEventChange(value) {
    if (value !== null) {
      let Sponsor = { ...this.state.Sponsor };
      Sponsor.event = value;
      this.setState({ Sponsor: Sponsor, eventRequired: false });
    } else {
      let Sponsor = { ...this.state.Sponsor };
      Sponsor.event = "";
      this.setState({ Sponsor: Sponsor, eventRequired: true });
    }
  }

  handleCategoryChange(value) {
    if (value !== null) {
      let Sponsor = { ...this.state.Sponsor };
      Sponsor.category = value;
      this.setState({ Sponsor: Sponsor, categoryRequired: false });
    } else {
      let Sponsor = { ...this.state.Sponsor };
      Sponsor.category = "";
      this.setState({ Sponsor: Sponsor, categoryRequired: true });
    }
  }

  //Method to get orderNumber
  getOrderNumber(category) {
    let orderNumber = 0;
    switch (category) {
      case "Gold Sponsor":
        orderNumber = 1;
        break;
      case "Associate Sponsor":
        orderNumber = 2;
        break;
      case "Award Sponsor":
        orderNumber = 3;
        break;
      case "Lanyard & Badge Sponsor":
        orderNumber = 4;
        break;
      case "Strategic Communication Partner":
        orderNumber = 5;
        break;
      case "Technoloogy Partner":
        orderNumber = 6;
        break;
      case "Ecosystem Partner":
        orderNumber = 7;
        break;
      case "Radio Partner":
        orderNumber = 8;
        break;
      case "Post Event Engagement Partner":
        orderNumber = 9;
        break;
      case "Other":
        orderNumber = 10;
        break;
    }
    return orderNumber;
  }

  onSubmit() {
    let Sponsor = _.pick(this.state.Sponsor, [
      "name",
      "event",
      "category",
      "description",
      "websiteURL",
      "imageURL",
      "orderNumber"
    ]);
   
    let orderNumber;
    orderNumber = this.getOrderNumber(Sponsor.category);
    Sponsor.orderNumber = orderNumber;
    let invalidImageUrl = false;
    let invalidWebsiteUrl = false;
    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (Sponsor.imageURL !== "") {
      if (!re.test(Sponsor.imageURL)) {
        invalidImageUrl = true;
      }
    }
    if (Sponsor.websiteURL !== "") {
      if (!re.test(Sponsor.websiteURL)) {
        invalidWebsiteUrl = true;
      }
    }
    let id = this.props.currentSponsor._id;
    if (
      Sponsor.name &&
      Sponsor.category &&
      Sponsor.event &&
      !invalidImageUrl &&
      !invalidWebsiteUrl
    ) {
      this.setState({ loading: true });
      this.state.editSponsor
        ? this.props.editSponsor(id, Sponsor)
        : this.props.createSponsor(Sponsor);
      let compRef = this;

      setTimeout(() => {
        let creatEditSponsorError = compRef.props.creatEditSponsorError;
        let status = "";
        compRef.state.editSponsor ? (status = "Updated") : (status = "Created");
        compRef.Toaster(compRef, creatEditSponsorError, status);
      }, 1000);
    } else {
      !Sponsor.name ? this.setState({ nameRequired: true }) : null;
      !Sponsor.category ? this.setState({ categoryRequired: true }) : null;
      !Sponsor.event ? this.setState({ eventRequired: true }) : null;
      invalidWebsiteUrl ? this.setState({ invalidWebsiteUrl: true }) : null;
      invalidImageUrl ? this.setState({ invalidImageUrl: true }) : null;
    }
  }
  Toaster(compRef, creatEditSponsorError, actionName) {
    this.setState({ loading: false });
    if (!creatEditSponsorError) {
      compRef.onReset();
      toast.success("Sponsor " + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      setTimeout(() => {
        compRef.redirectFunction();
      }, 1000);
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }
  redirectFunction() {
    this.setState({ loading: false });
    this.props.history.push("/sponsors");
  }
  onReset() {
    this.setState(prevState => ({
      Sponsor: {
        ...prevState.Sponsor,
        name: "",
        event: "",
        description: "",
        websiteURL: "",
        imageURL: "",
        category: ""
      },
      nameRequired: false,
      eventRequired: false,
      categoryRequired: false,
      invalidImageUrl: false,
      invalidWebsiteUrl: false
    }));
  }

  render() {
    const { Sponsor } = this.state;
    const eventOptions = this.props.eventList;
    const categoryOptions = this.props.categoryOptions;
    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <CardLayout name="Sponsor">
        <FormGroup row>
          <Col xs="12" md="6">
            <InputElement
              icon="fa fa-money"
              type="text"
              placeholder="Sponsor name"
              name="name"
              maxLength="50"
              required={this.state.nameRequired}
              value={Sponsor.name}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <Select
              placeholder="Select event"
              value={Sponsor.event}
              options={eventOptions}
              simpleValue
              clearable
              onChange={this.handleEventChange.bind(this)}
            />
            {this.state.eventRequired ? (
              <div
                style={{ color: "red", marginTop: 0 }}
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
              placeholder="Description"
              name="description"
              maxLength="250"
              value={Sponsor.description}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <InputElement
              icon="icon-link"
              type="text"
              placeholder="Website URL"
              name="websiteURL"
              inValid={this.state.invalidWebsiteUrl}
              value={Sponsor.websiteURL}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="6">
            <InputElement
              icon="icon-link"
              type="text"
              placeholder="Image URL"
              name="imageURL"
              inValid={this.state.invalidImageUrl}
              value={Sponsor.imageURL}
              onchanged={event => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <Select
              placeholder="Select category"
              value={Sponsor.category}
              options={categoryOptions}
              simpleValue
              onChange={this.handleCategoryChange.bind(this)}
            />
            {this.state.categoryRequired ? (
              <div
                style={{ color: "red", marginTop: 0 }}
                className="help-block"
              >
                *Please select category
              </div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="3">
            {this.state.editSponsor ? (
              <Button
                type="button"
                size="md"
                color="success"
                onClick={() => this.onSubmit()}
              >
                Update
              </Button>
            ) : (
              <Button
                type="button"
                size="md"
                color="success"
                onClick={() => this.onSubmit()}
              >
                Create
              </Button>
            )}
          </Col>
          <Col md="3">
            <Button
              type="button"
              size="md"
              color="primary"
              style={{ marginLeft: -182 }}
              onClick={() => this.onReset()}
            >
              Reset
            </Button>
          </Col>
          <Col md="3">
            <Button
              type="button"
              size="md"
              color="danger"
              style={{ marginLeft: -370 }}
              onClick={() => this.redirectFunction()}
            >
              Cancel
            </Button>
            <ToastContainer autoClose={2000} />
          </Col>
        </FormGroup>
      </CardLayout>
    );
  }
}
const mapStateToProps = state => {
  return {
    eventList: state.event.eventList,
    currentSponsor: state.sponsor.currentSponsor,
    creatEditSponsorError: state.sponsor.creatEditSponsorError,
    categoryOptions: state.sponsor.categoryOptions
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getSponsors: () => dispatch(actions.getSponsors()),
    createSponsor: room => dispatch(actions.createSponsor(room)),
    editSponsor: (id, room) => dispatch(actions.editSponsor(id, room)),
    getEvents: () => dispatch(actions.getEvents()),
    getSponsorById: id => dispatch(actions.getSponsorById(id))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SponsorForm);

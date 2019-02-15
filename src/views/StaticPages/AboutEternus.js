import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import {
  FormGroup,
  Col,
  Button,
  InputGroup,
  InputGroupText,
  Input,
  Label
} from "reactstrap";
import InputElement from "../../components/Input/";
import CardLayout from "../../components/CardLayout/";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";
import Loader from "../../components/Loader/Loader";

class AboutEternus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutEternus: {
        info: "",
        url: ""
      },
      infoRequired: false,
      loading: true,
      invalidUrl: false
    };
  }
  componentDidMount() {
    this.props.getAboutEternus();
    let compRef = this;
    setTimeout(() => {
      let getAboutEternusError = compRef.props.getAboutEternusError;
      if (getAboutEternusError) {
        toast.error("Something went wrong", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }
      compRef.setState({ loading: false });
    }, 1000);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.aboutEternus !== this.props.aboutEternus) {
      this.setState({
        aboutEternus: this.props.aboutEternus
      });
    }
  }
  onChangeInput(event) {
    let aboutEternus = { ...this.state.aboutEternus };
    aboutEternus[event.target.name] = event.target.value;
    this.setState({
      aboutEternus: aboutEternus,
      infoRequired: false,
      invalidUrl: false
    });
  }
  onSubmit() {
    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    var invalidUrl = false;
    if (!re.test(this.state.aboutEternus.url)) {
      invalidUrl = true;
    }
    if (this.state.aboutEternus.info && !invalidUrl) {
      this.setState({ loading: true });
      let isEmpty = !Object.keys(this.props.aboutEternus).length;
      let aboutEternus = _.pick(this.state.aboutEternus, ["info", "url"]);
      let id;
      !isEmpty ? (id = this.props.aboutEternus._id) : null;
      isEmpty
        ? this.props.createAboutEternus(aboutEternus)
        : this.props.editAboutEternus(id, aboutEternus);
      let compRef = this;
      setTimeout(() => {
        let creatEditError = compRef.props.creatEditAboutEternusError;
        let status = "";
        !isEmpty ? (status = "Updated") : (status = "Created");
        compRef.Toaster(compRef, creatEditError, status);
      }, 1000);
    } else {
      !this.state.aboutEternus.info
        ? this.setState({ infoRequired: true })
        : null;
      invalidUrl ? this.setState({ invalidUrl: true }) : null;
    }
  }
  Toaster(compRef, createEditError, actionName) {
    if (!createEditError) {
      //compRef.onReset();
      compRef.setState({ loading: false });
      toast.success(
        "About Eternus Information " + actionName + " Successfully.",
        {
          position: toast.POSITION.BOTTOM_RIGHT
        }
      );
    } else {
      compRef.setState({ loading: false });
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }
  onReset() {
    this.setState(prevState => ({
      aboutEternus: {
        ...prevState.aboutEternus,
        info: "",
        url: ""
      },
      infoRequired: false,
      invalidUrl: false
    }));
  }
  render() {
    const { info, url } = { ...this.state.aboutEternus };
    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <CardLayout name="About Eternus">
        <FormGroup row style={{ marginTop: 30 }}>
          <Col xs="12" md="6">
            <Label style={{ fontSize: 16 }}>Information about eternus</Label>
            <InputGroup className="mb-3">
              <InputGroupText>
                <i className="icon-info" />
              </InputGroupText>
              <Input
                style={{ height: "36px" }}
                maxLength="500"
                type="textarea"
                placeholder="Information about eternus"
                name="info"
                value={info}
                onChange={event => this.onChangeInput(event)}
              />
            </InputGroup>
          </Col>
          {this.state.infoRequired ? (
            <div
              style={{ color: "red", fontSize: "12px", marginLeft: 10 }}
              className="help-block"
            >
              *Information about eternus is required
            </div>
          ) : null}
          <Col md="6">
            <InputElement
              icon="icon-link"
              type="text"
              label="Website Url"
              placeholder="Eternus website Url"
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
              style={{ marginLeft: -160 }}
              onClick={() => this.onReset()}
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
    aboutEternus: state.staticPages.aboutEternus,
    getAboutEternusError: state.staticPages.getAboutEternusError,
    creatEditAboutEternusError: state.staticPages.creatEditAboutEternusError
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getAboutEternus: () => dispatch(actions.getAboutEternusInfo()),
    createAboutEternus: aboutEternus =>
      dispatch(actions.createAboutEternusInfo(aboutEternus)),
    editAboutEternus: (id, aboutEternus) =>
      dispatch(actions.editAboutEternusInfo(id, aboutEternus))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AboutEternus);

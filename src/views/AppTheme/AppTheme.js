import React from "react";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";
import {
  appthemeConst,
  appTextConst
} from "../../components/AppThemeStyle/AppThemeStyle";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { FormGroup, Col, Button, Label, Row, Card, CardBody } from "reactstrap";
import InputElement from "../../components/Input/";
import CardLayout from "../../components/CardLayout/";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";

class AppTheme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AppConfig: {
        _id: "",
        appTitle: "",
        themeColor: { r: "241", g: "112", b: "19", a: "1" },
        textColor: { r: "241", g: "112", b: "19", a: "1" },
        appThemeColorHex: "#F17013",
        appTextColorHex: "#F17013",
        appLogo: ""
      },
      displayThemePicker: false,
      displayTextPicker: false,
      editAppTheme: false,
      loading: false,
      appTitleRequired: false,
      appLogoRequired: false,
      invalidAppLogo: false
    };
  }

  componentDidMount() {
    let compRef = this;
    this.setState({ loading: true });
    compRef.props.getAppTheme();
    setTimeout(function() {
      let appThemeData = compRef.props.appTheme;
      if (appThemeData !== undefined && appThemeData.length > 0) {
        compRef.setState({
          AppConfig: appThemeData[0],
          editAppTheme: true,
          loading: false
        });
      } else {
        compRef.setState({ editAppTheme: false, loading: false });
      }
    }, 1000);
  }

  handleThemeClick() {
    this.setState({ displayThemePicker: !this.state.displayThemePicker });
  }

  handleThemeClose() {
    this.setState({ displayThemePicker: false });
  }

  handleThemeChange(themeColor) {
    let AppConfig = this.state.AppConfig;
    AppConfig.themeColor = themeColor.rgb;
    AppConfig.appThemeColorHex = themeColor.hex;
    this.setState({ AppConfig: AppConfig });
  }

  onChangeInput(event) {
    const { AppConfig } = { ...this.state };
    AppConfig[event.target.name] = event.target.value;
    this.setState({
      AppConfig: AppConfig,
      appTitleRequired: false,
      appLogoRequired: false,
      invalidAppLogo: false
    });
  }

  handleTextClick() {
    this.setState({ displayTextPicker: !this.state.displayTextPicker });
  }
  handleTextClose() {
    this.setState({ displayTextPicker: false });
  }

  handleTextChange(textColor) {
    let AppConfig = this.state.AppConfig;
    AppConfig.textColor = textColor.rgb;
    AppConfig.appTextColorHex = textColor.hex;
    this.setState({ AppConfig: AppConfig });
  }

  Toaster(compRef, successFlag, actionName) {
    this.setState({ loading: false });
    let AppConfig = { ...this.state.AppConfig };
    AppConfig._id = compRef.props.appThemeId;
    if (successFlag) {
      toast.success("App Theme" + actionName + " Successfully.", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      compRef.setState({
        editAppTheme: true,
        AppConfig: AppConfig
      });
    } else {
      compRef.setState({ loading: false });
      compRef.setState({ editAppTheme: false });
      toast.error("Something went wrong", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  onReset() {
    this.setState({
      AppConfig: {
        appTitle: "",
        themeColor: { r: "241", g: "112", b: "19", a: "1" },
        textColor: { r: "241", g: "112", b: "19", a: "1" },
        appThemeColorHex: "#F17013",
        appTextColorHex: "#F17013",
        appLogo: ""
      },
      displayThemePicker: false,
      displayTextPicker: false,
      appTitleRequired: false,
      appLogoRequired: false,
      invalidAppLogo: false
    });
  }

  validateForm() {
    let AppConfig = { ...this.state.AppConfig };
    let invalidAppLogo = false;
    var validLogo = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (
      AppConfig.appLogo !== undefined &&
      AppConfig.appLogo !== "" &&
      AppConfig.appLogo !== null
    ) {
      if (!validLogo.test(AppConfig.appLogo)) {
        invalidAppLogo = true;
      }
    }
    !AppConfig.appTitle ? this.setState({ appTitleRequired: true }) : null;
    !AppConfig.appLogo ? this.setState({ appLogoRequired: true }) : null;
    invalidAppLogo ? this.setState({ invalidAppLogo: true }) : null;
  }

  onSubmit() {
    let compRef = this;
    this.validateForm();
    setTimeout(() => {
      compRef.createEvent();
    }, 1000);
  }

  createEvent() {
    let compRef = this;
    let AppConfig = { ...this.state.AppConfig };
    if (AppConfig.appTitle && AppConfig.appLogo && !this.state.invalidAppLogo) {
      this.setState({ loading: true });
      this.props.createAppTheme(AppConfig);
      setTimeout(() => {
        let appThemeCreated = this.props.appThemeCreated;
        compRef.Toaster(compRef, appThemeCreated, "Created");
      }, 1500);
    } else {
      this.setState({ loading: false });
    }
  }

  onUpdate() {
    let compRef = this;
    this.validateForm();
    setTimeout(() => {
      compRef.updateEvent();
    }, 1000);
  }

  updateEvent() {
    let compRef = this;
    let AppConfig = { ...this.state.AppConfig };
    let _id = AppConfig._id;
    if (AppConfig.appTitle && AppConfig.appLogo && !this.state.invalidAppLogo) {
      this.setState({ loading: true });
      this.props.updateAppTheme(AppConfig, _id);
      setTimeout(() => {
        let appThemeUpdated = this.props.appThemeUpdated;
        compRef.Toaster(compRef, appThemeUpdated, "Updated");
      }, 1500);
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    const appThemeStyles = appthemeConst(this.state.AppConfig.themeColor);
    const appTextStyles = appTextConst(this.state.AppConfig.textColor);
    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <div className="animated fadeIn">
        <Row className="justify-content-left">
          <Col md="10">
            <Card className="mx-6">
              <CardBody className="p-4">
                <h1>App Theme Configuration</h1>
                <br />
                <FormGroup row>
                  <Col xs="12" md="1">
                    <Label>App Title </Label>
                  </Col>
                  <Col xs="12" md="4">
                    <InputElement
                      type="text"
                      placeholder="App Title"
                      name="appTitle"
                      maxLength="20"
                      required={this.state.appTitleRequired}
                      value={this.state.AppConfig.appTitle}
                      onchanged={event => this.onChangeInput(event)}
                    />
                  </Col>
                  <Col xs="12" md="1">
                    <Label>Theme Color </Label>
                  </Col>
                  <Col xs="12" md="4">
                    <div
                      style={appThemeStyles.swatch}
                      onClick={this.handleThemeClick.bind(this)}
                    >
                      <div style={appThemeStyles.color} />
                    </div>
                    {this.state.displayThemePicker ? (
                      <div style={appThemeStyles.popover}>
                        <div
                          style={appThemeStyles.cover}
                          onClick={this.handleThemeClose.bind(this)}
                        />
                        <SketchPicker
                          color={this.state.AppConfig.themeColor}
                          width={300}
                          height={30}
                          onChange={this.handleThemeChange.bind(this)}
                        />
                      </div>
                    ) : null}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs="12" md="1">
                    <Label>App Logo </Label>
                  </Col>
                  <Col xs="12" md="4">
                    <InputElement
                      type="text"
                      placeholder="App Logo"
                      name="appLogo"
                      maxLength="20"
                      required={this.state.appLogoRequired}
                      inValid={this.state.invalidAppLogo}
                      value={this.state.AppConfig.appLogo}
                      onchanged={event => this.onChangeInput(event)}
                    />
                  </Col>
                  <Col xs="12" md="1">
                    <Label>Text Color </Label>
                  </Col>
                  <Col xs="12" md="4">
                    <div
                      style={appTextStyles.swatch}
                      onClick={this.handleTextClick.bind(this)}
                    >
                      <div style={appTextStyles.color} />
                    </div>
                    {this.state.displayTextPicker ? (
                      <div style={appTextStyles.popover}>
                        <div
                          style={appTextStyles.cover}
                          onClick={this.handleTextClose.bind(this)}
                        />
                        <SketchPicker
                          color={this.state.AppConfig.textColor}
                          width={300}
                          height={30}
                          onChange={this.handleTextChange.bind(this)}
                        />
                      </div>
                    ) : null}
                  </Col>
                </FormGroup>
                <br />
                <FormGroup row>
                  <Col xs="12" md="3">
                    {this.state.editAppTheme ? (
                      <Button
                        type="button"
                        size="md"
                        color="success"
                        onClick={() => this.onUpdate()}
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
                      onClick={() => this.onReset()}
                    >
                      Reset
                    </Button>
                  </Col>
                  <ToastContainer autoClose={2000} />
                </FormGroup>
                <ToastContainer autoClose={2000} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    appTheme: state.appTheme.appTheme,
    appThemeCreated: state.appTheme.appThemeCreated,
    appThemeUpdated: state.appTheme.appThemeUpdated,
    appThemeId: state.appTheme.appThemeId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createAppTheme: appTheme => dispatch(actions.createAppTheme(appTheme)),
    updateAppTheme: (appTheme, appThemeId) =>
      dispatch(actions.updateAppTheme(appTheme, appThemeId)),
    getAppTheme: () => dispatch(actions.getAppTheme())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppTheme);

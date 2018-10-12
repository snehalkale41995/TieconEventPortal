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

//F17013
class AppTheme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AppConfig: {
        appTitle: "",
        themeColor: { r: "241", g: "112", b: "19", a: "1" },
        textColor: { r: "241", g: "112", b: "19", a: "1" },
        appThemeColorHex: "#F17013",
        appTextColorHex: "#F17013",
        appLogo: ""
      },
      displayThemePicker: false,
      displayTextPicker: false
    };
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
      AppConfig: AppConfig
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

  onSubmit() {
    let AppConfig = { ...this.state.AppConfig };
    console.log("AppConfig", AppConfig);
    this.props.createAppTheme(AppConfig);
  }

  render() {
    const appThemeStyles = appthemeConst(this.state.AppConfig.themeColor);
    const appTextStyles = appTextConst(this.state.AppConfig.textColor);
    return (
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
                      //  required={this.state.roomNameRequired}
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
                      //  required={this.state.roomNameRequired}
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
                    {/* {this.state.editRoom ? ( */}
                    {/* <Button
                type="button"
                size="md"
                color="success"
                onClick={() => this.onSubmit()}
              >
                Update
              </Button>
            ) : ( */}
                    <Button
                      type="button"
                      size="md"
                      color="success"
                      onClick={() => this.onSubmit()}
                    >
                      Create
                    </Button>
                    {/* )}  */}
                  </Col>
                  <Col md="3">
                    <Button
                      type="button"
                      size="md"
                      color="primary"
                      // onClick={() => this.onReset()}
                    >
                      Reset
                    </Button>
                  </Col>
                  <ToastContainer autoClose={2000} />
                </FormGroup>
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
    appTheme: state.appTheme.appTheme
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createAppTheme: room => dispatch(actions.createAppTheme(room))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppTheme);

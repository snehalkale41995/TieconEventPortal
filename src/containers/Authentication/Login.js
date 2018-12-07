import React, { Component } from "react";
import FormLayout from "../../components/FormLayout/";
import { Button, FormGroup, Col } from "reactstrap";
import InputElement from "../../components/Input/";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: "",
        password: ""
      }
    };
  }
  onChangeHandler(event) {
    let user = { ...this.state.user };
    user[event.target.name] = event.target.value;
    this.setState({ user: user });
  }
  onSubmit() {
    let user = { ...this.state.user };
    if (user.email && user.password) {
      this.props.loginUser(user);
      let compRef = this;
      setTimeout(() => {
        let loginError = compRef.props.loginError;
        let loginErrorMsg = compRef.props.loginErrorMsg;
        compRef.Toaster(compRef, loginError, "Login ", loginErrorMsg);
      }, 1000);
    } else {
      toast.error("Please Enter Valid Email/Password...", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }
  Toaster(compRef, loginError, actionName, loginErrorMsg) {
    if (!loginError) {
      localStorage.setItem("user", this.state.user.email);
      toast.success(actionName + " Successfull...", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      setTimeout(() => {
        compRef.redirectFunction();
      }, 1000);
    } else {
      toast.error(loginErrorMsg, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }
  redirectFunction() {
    this.props.history.push("/");
  }
  onForgetPassword() {
    let user = { ...this.state.user };
    if (user.email) {
      this.props.forgetPassword(user.email);
      let compRef = this;
      setTimeout(() => {
        let forgetPasswordMsg = compRef.props.forgetPasswordMsg;
        compRef.forgetPasswordToast(forgetPasswordMsg);
      }, 1000);
    } else {
      toast.error("Please Enter Valid Email...", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }
  forgetPasswordToast(forgetPasswordMsg) {
    toast.success("Message..." + forgetPasswordMsg + "", {
      position: toast.POSITION.BOTTOM_RIGHT
    });
  }
  render() {
    return (
      <FormLayout>
        <h1>Login</h1>
        <p className="text-muted">Sign In to your account</p>
        <FormGroup row>
          <Col md="6" xs="12">
            <InputElement
              type="email"
              name="email"
              placeholder="Email"
              value={this.state.email}
              icon="icon-envelope"
              onchanged={event => this.onChangeHandler(event)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col md="6">
            <InputElement
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              icon="icon-key"
              onchanged={event => this.onChangeHandler(event)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="6">
            <Button color="primary" onClick={this.onSubmit.bind(this)}>
              Login
            </Button>
          </Col>
          <Col md="6">
            <Button color="link" onClick={this.onForgetPassword.bind(this)}>
              Forgot password?
            </Button>
            <ToastContainer autoClose={2000} />
          </Col>
        </FormGroup>
      </FormLayout>
    );
  }
}
const mapStateToProps = state => {
  return {
    loginError: state.auth.loginError,
    forgetPasswordMsg: state.auth.forgetPasswordMsg,
    loginErrorMsg: state.auth.loginErrorMsg
  };
};
const mapDispatchToProps = dispatch => {
  return {
    loginUser: user => dispatch(actions.loginUser(user)),
    forgetPassword: email => dispatch(actions.forgetPassword(email))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

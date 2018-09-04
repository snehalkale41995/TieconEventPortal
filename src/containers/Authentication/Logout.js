import { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
class Logout extends Component {
  componentDidMount() {
    this.props.logoutUser();
    localStorage.clear();
    this.props.history.push("/");
  }
  render() {
    return null;
  }
}
const mapDispatchToProps = dispatch => {
  return {
    logoutUser: () => dispatch(actions.logoutUser())
  };
};
export default connect(
  null,
  mapDispatchToProps
)(Logout);

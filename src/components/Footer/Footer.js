import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="app-footer">
        <span>
          <a href="https://pune.tie.org/">Event Management Application</a>{" "}
          &copy; 2018 Eternus.
        </span>
        <span className="ml-auto">
          Powered by{" "}
          <a href="https://www.eternussolutions.com/">
            Eternus Solutions Pvt. Ltd.
          </a>
        </span>
      </footer>
    );
  }
}

export default Footer;

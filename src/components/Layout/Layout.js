import React, { Component } from "react";
import { Container } from "reactstrap";
import Header from "../Header/";
import Sidebar from "../Sidebar/";
import Breadcrumb from "../Breadcrumb/";
import Aside from "../Aside/";
import Footer from "../Footer/";

class Layout extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props} />
          <main className="main">
            <Breadcrumb />
            <Container fluid>{this.props.children}</Container>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}
export default Layout;

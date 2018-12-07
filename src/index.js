import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, HashRouter, Route, Switch } from "react-router-dom";
import "flag-icon-css/css/flag-icon.min.css";
import "font-awesome/css/font-awesome.min.css";
import "simple-line-icons/css/simple-line-icons.css";
import "../scss/style.scss";
import "../scss/core/_dropdown-menu-right.scss";
import App from "./containers/App/";
import { Provider } from "react-redux";
import store from "./store";
import "./customStyle.css";

const app = (
  <Provider store={store}>
    <HashRouter>
      <Route path="/" component={App} />
    </HashRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

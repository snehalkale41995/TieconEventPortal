import React from "react";
import { Alert, Row, Col, Button, FormGroup } from "reactstrap";

const SessionIndicator = props => {
  return (
    <div style={{ marginTop: -10 }}>
      <FormGroup row>
        <Col xs="'12" md="2">
          <Alert style={{ height: "5px", backgroundColor :"#" + "527DDF" }}>
            <p style={{ marginTop: -10 }}>
              <center>Breakout</center>
            </p>
          </Alert>
        </Col>
        <Col xs="'12" md="2">
          <Alert style={{ height: "5px" ,backgroundColor :"#" + "AC9723"}} >
            <p style={{ marginTop: -10 }}>
              <center> Common </center>
            </p>
          </Alert>
        </Col>
        <Col xs="'12" md="2">
          <Alert style={{ height: "5px", backgroundColor :"#" + "33782E" }}>
            <p style={{ marginTop: -10 }}>
              <center> Deepdive</center>
            </p>
          </Alert>
        </Col>
        <Col xs="'12" md="2">
          <Alert style={{ height: "5px", backgroundColor :"#" + "EE6F56" }}>
            <p style={{ marginTop: -10 }}>
              <center> Keynote</center>
            </p>
          </Alert>
        </Col>
        <Col xs="'12" md="2">
          <Alert style={{ height: "5px", backgroundColor :"#" + "A1BCAB" }}>
            <p style={{ marginTop: -10 }}>
              <center> Panel </center>
            </p>
          </Alert>
        </Col>
       
      </FormGroup>
    </div>
  );
};

export default SessionIndicator;

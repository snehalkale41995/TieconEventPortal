import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";

const CardLayout = props => (
  <div className="animated fadeIn">
    <Row className="justify-content-left">
      <Col md="12">
        <Card className="mx-6">
          <CardBody className="p-4">
            <h1>{props.name}</h1>
            {props.children}
          </CardBody>
        </Card>
      </Col>
    </Row>
  </div>
);

export default CardLayout;

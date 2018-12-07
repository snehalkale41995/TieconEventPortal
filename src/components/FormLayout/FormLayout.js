import React, { Component } from "react";
import { Container, Row, Col, CardGroup, Card, CardBody } from "reactstrap";

class FormLayout extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>{this.props.children}</CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default FormLayout;


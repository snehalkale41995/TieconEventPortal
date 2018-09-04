import React from "react";
import {
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  FormGroup,
  Col,
  Button,
  Label
} from "reactstrap";

const AnswerLayout = props => {
  if (props.inputType === "Text") {
    return (
      <FormGroup row>
        <Col xs="12" md="6">
          <InputGroup className="mb-3">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="icon-question" />
              </InputGroupText>
            </InputGroupAddon>
            <Input type="text" placeholder="Answer" name={props.name} />
          </InputGroup>
        </Col>
      </FormGroup>
    );
  } else if (props.inputType === "Check Box") {
    return (
      <FormGroup row>
        <Col xs="12" md="9">
          {props.options.map((opt, id) => {
            return (
              <FormGroup key={id} check inline>
                <Label check>
                  <Input type="checkbox" />
                </Label>
                <Input
                  type="text"
                  placeholder="Add value"
                  name={id}
                  value={opt.value}
                  onChange={props.onChangeOptionValue}
                />
              </FormGroup>
            );
          })}
        </Col>
        <Col md="3">
          <Button color="primary" onClick={props.onAddOption}>
            <i className="icon-plus" />{" "}
          </Button>
          <Button color="danger" onClick={props.onDeleteOption}>
            <i className="icon-minus" />{" "}
          </Button>
        </Col>
      </FormGroup>
    );
  } else if (props.inputType === "Multiple choice") {
    return (
      <FormGroup row>
        <Col xs="12" md="9">
          {props.options.map((opt, id) => {
            return (
              <FormGroup key={id} check inline>
                <Input
                  className="form-check-input"
                  type="radio"
                  name="inline-radios"
                  value="option1"
                />
                <Input
                  type="text"
                  placeholder="Add choice"
                  name={id}
                  value={opt.value}
                  onChange={props.onChangeOptionValue}
                />
              </FormGroup>
            );
          })}
        </Col>
        <Col md="3">
          <Button color="primary" onClick={props.onAddOption}>
            <i className="icon-plus" />{" "}
          </Button>
          <Button color="danger" onClick={props.onDeleteOption}>
            <i className="icon-minus" />{" "}
          </Button>
        </Col>
      </FormGroup>
    );
  } else {
    return <div />;
  }
};
export default AnswerLayout;

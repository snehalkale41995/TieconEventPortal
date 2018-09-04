import React from "react";
import {
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  FormGroup,
  Col,
  Button
} from "reactstrap";
import Select from "react-select";
import "react-select/dist/react-select.css";

const options = [
  { label: "Text", value: "Text" },
  { label: "Check Box", value: "Check Box" },
  { label: "Multiple choice", value: "Multiple choice" }
];

const QuestionLayout = props => (
  <FormGroup row>
    <Col xs="12" md="6">
      <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i className="icon-question" />
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          placeholder="Enter question"
          name={props.name}
          maxLength="250"
          value={props.questionValue}
          onChange={props.onchanged}
        />
      </InputGroup>
    </Col>
    <Col md="3">
      <Select
        name={toString(props.name)}
        placeholder="Select input type"
        options={options}
        value={props.selectValue}
        onChange={props.onChangeSelect}
      />
    </Col>
    <Col md="3">
      <Button type="button" color="danger" onClick={props.onDeleteQuestion}>
        Delete Question
      </Button>
    </Col>
  </FormGroup>
);

export default QuestionLayout;

import React from "react";
import { Input, InputGroup, InputGroupText, InputGroupAddon } from "reactstrap";
import "./inputStyle.css";
const InputElement = props => (
  <InputGroup className="mb-3">
    <InputGroupAddon addonType="prepend">
      <InputGroupText>
        <i className={props.icon} />
      </InputGroupText>
    </InputGroupAddon>
    <Input
      disabled={props.disabled}
      type={props.type}
      placeholder={props.placeholder}
      name={props.name}
      maxLength={props.maxLength}
      onChange={props.onchanged}
      value={props.value}
      className={props.type}
    />
    {props.required ? (
      <div style={{ color: "red", fontSize: "12px" }} className="help-block">
        *{props.placeholder} is required
      </div>
    ) : null}
    {props.inValid ? (
      <div style={{ color: "red" }} className="help-block">
        {props.placeholder} is invalid
      </div>
    ) : null}
  </InputGroup>
);

export default InputElement;

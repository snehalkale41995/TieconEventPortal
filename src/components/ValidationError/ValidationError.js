import React from "react";

const ValidationError = props => (
  <div>
    {props.required ? (
      <div style={{ color: "red", marginTop: 0,fontSize: "12px" }}>
        * {props.displayName} is required
      </div>
    ) : null}
  </div>
);

export default ValidationError;

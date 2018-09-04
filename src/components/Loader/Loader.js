import React from "react";
import { ScaleLoader } from "react-spinners";

const Loader = props => (
  <div style={{ marginLeft: 500, marginTop: 251 }} className="animated fadeIn">
    <ScaleLoader color={"#20a8d8"} loading={props.loading} />
  </div>
);

export default Loader;

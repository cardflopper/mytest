import React from "react";
import "./Count.css";

let count = props => {
  return (
    <h2>
      {props.name} <span>({props.n})</span>
    </h2>
  );
};

export default count;

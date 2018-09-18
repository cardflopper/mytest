import React from "react";
import "./Count.css";

let count = props => {
  return (
    <React.Fragment>
      <span class="count">
        {props.name} <span> ({props.n})</span>
      </span>
    </React.Fragment>
  );
};

export default count;

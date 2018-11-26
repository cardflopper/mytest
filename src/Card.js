import React from "react";
import "./Card.css";

let card = props => {
  let src = `./images/${props.id}.jpg`;
  let classes = "";
  if (props.selected) {
    classes += "highlight ";
  }
  if (props.revealed) {
    classes += " revealed";
  }

  return (
    <img
      data-id={props.id}
      className={classes}
      onClick={props.cardClick}
      src={src}
      alt={props.id}
    />
  );
};

export default card;

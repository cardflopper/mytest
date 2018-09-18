import React from "react";
import Card from "./Card";
import "./CardGroup.css";

const cardGroup = props => {
  let matrix = [],
    size = 3;
  let cards = props.cards.slice();

  while (cards.length > 0) matrix.push(cards.splice(0, size));

  return (
    <table className="cardGroup">
      <tbody>
        {matrix.map((rowElement, r) => {
          return (
            <tr key={r}>
              {rowElement.map((colElement, c) => (
                <td key={3 * r + c}>
                  <Card
                    key={colElement.id}
                    id={colElement.id}
                    selected={colElement.isSelected}
                    cardClick={e => props.cardClick(e, r, c)}
                  />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default cardGroup;

import React, { Component } from "react";
import CardGroup from "./CardGroup";
import Count from "./Count";
import "./App.css";

class App extends Component {
  state = {
    tableCards: [],
    deck: [],
    showFoundSets: false,
    foundSets: []
  };
  constructor(props) {
    super(props);
    let initState = this.initialState(false, 12);
    this.state.deck = initState.deck;
    this.state.tableCards = initState.tableCards;
    this.state.foundSets = initState.foundSets;
  }

  restart = () => {
    let initState = this.initialState(false, 12);
    this.setState({ deck: initState.deck });
    this.setState({ tableCards: initState.tableCards });
    this.setState({ foundSets: initState.foundSets });
  };

  render() {
    return (
      <React.Fragment>
        <div className="header">
          <img alt="SET GAME" src="./images/logo.jpg" />
        </div>

        <div className="container">
          <div className="col">
            <h3 class="counters">
              <span>Deck ({this.state.deck.length})</span>

              <span>Table ({this.state.tableCards.length})</span>
            </h3>
            <div>
              <button className="addCardsButton" onClick={this.buttonHandler}>
                add 3 more Cards
              </button>
            </div>
            <CardGroup
              name="table"
              cards={this.state.tableCards}
              cardClick={this.cardClickHandler}
            />
          </div>
          <div className="col">
            <h3>Found Sets ({this.state.foundSets.length}) </h3>
            <CardGroup
              name="foundSets"
              cards={this.flattenArray(this.state.foundSets)}
              cardClick={() => {}}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  setIsNew(set) {
    if (this.state.foundSets.length === 0) return true;
    for (let fs of this.state.foundSets)
      if (fs.filter(i => set.indexOf(i) === -1).length === 0) return false;
    return true;
  }

  flattenArray(a) {
    if (a.length === 0) return [];
    let result = [];
    for (let i = 0; i < a.length; i++) result = result.concat(a[i]);
    return result;
  }

  buttonHandler = () => {
    let { drawn, deck } = this.drawCards();
    this.setState({
      tableCards: this.state.tableCards.slice().concat(drawn),
      deck: deck
    });
  };

  cardClickHandler = (e, row, col) => {
    let i = row * 3 + col,
      set = [],
      tableCards = this.state.tableCards.slice(),
      foundSets = this.state.foundSets.slice(),
      deck = this.state.deck,
      drawn = [];

    //these two lines must be in this order
    tableCards[i].isSelected = !tableCards[i].isSelected; //toggle isSelected at current index

    let numSelected = 0;
    for (let card of tableCards) if (card.isSelected === true) numSelected++;

    // here we have 3 cards selected and are checking for a set, updating table etc.
    if (numSelected === 3) {
      set = tableCards.filter(i => i.isSelected === true).map(k => k.id);

      console.log(set);

      if (this.checkIfSet(set) && this.setIsNew(set)) {
        //we need cards to be in {id,selected} format to display properly in CardGroup component
        foundSets.push(
          set.map(i => {
            return { id: i, isSelected: null };
          })
        );

        //remove cards that make up the set
        tableCards = tableCards.filter(card => card.isSelected === false);

        if (tableCards.length < 12) {
          console.log("need a fill!");
          ({ drawn, deck } = this.drawCards(Math.abs(12 - tableCards.length)));
        }
      }
      //called regardless of whether the triplet was a set or not
      numSelected = 0;
      tableCards.map(c => (c.isSelected = false));
    }

    let newState = {
      tableCards: tableCards.concat(drawn),
      foundSets: foundSets,
      deck: deck
    };

    this.setState(newState);
  };

  initialState(test = false, draw = 3) {
    let deck = [];
    for (let i = 0; i < 81; i++) {
      deck.push(i);
    }

    if (!test) deck = this.shuffle(deck);

    let tableCards = deck.splice(0, draw);

    return {
      deck: deck,
      tableCards: tableCards.map(i => {
        return { id: i, isSelected: false };
      }),
      selectedCards: [],
      foundSets: []
    };
  }

  drawCards(n = 3) {
    if (this.state.deck.length === 0 || n === 0)
      return { drawn: [], deck: this.state.deck };
    if (this.state.deck.length < n) n = this.state.deck.length;

    let deck = this.state.deck.slice();
    let drawn = deck.splice(0, n).map(i => {
      return { id: i, isSelected: false };
    });

    return { drawn: drawn, deck: deck };
  }

  //depends on getQualities(id)
  checkIfSet = cards => {
    let a = this.getQualities(cards[0]);
    let b = this.getQualities(cards[1]);
    let c = this.getQualities(cards[2]);

    let color = new Set([a.color, b.color, c.color]);
    let fill = new Set([a.fill, b.fill, c.fill]);
    let number = new Set([a.number, b.number, c.number]);
    let shape = new Set([a.shape, b.shape, c.shape]);

    if (color.size === 2) return 0;
    if (fill.size === 2) return 0;
    if (number.size === 2) return 0;
    if (shape.size === 2) return 0;
    return 1;
  };

  getQualities(id) {
    let color = Math.floor(id / 27),
      fill = Math.floor(id / 9) % 3,
      shape = Math.floor(id / 3) % 3,
      number = Math.floor(id / 1) % 3;
    return { color, fill, shape, number };
  }

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}

export default App;

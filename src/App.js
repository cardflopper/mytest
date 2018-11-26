import React, { Component } from "react";
import CardGroup from "./CardGroup";
import "./App.css";

class App extends Component {
  state = {
    tableCards: [],
    deck: [],
    showFoundSets: false,
    foundSets: [],
    availableSets: [],
    currentRevealedIndex: 0,
    showHints: false
  };
  constructor(props) {
    super(props);
    let initState = this.initialState(false, 12);
    this.state.deck = initState.deck;
    this.state.tableCards = initState.tableCards;
    this.state.foundSets = initState.foundSets;
    this.state.availableSets = initState.availableSets;
    this.state.currentRevealedIndex = initState.currentRevealedIndex;
    this.state.showHints = initState.showHints;
  }

  restart = () => {
    let initState = this.initialState(false, 12);
    this.setState({ deck: initState.deck });
    this.setState({ tableCards: initState.tableCards });
    this.setState({ foundSets: initState.foundSets });
    this.setState({ availableSets: initState.availableSets });
    this.setState({ currentRevealedIndex: initState.currentRevealedIndex });
    this.setState({ showHints: initState.showHints });
  };

  render() {
    let add3CardsButton = (
      <button onClick={this.addCardsButtonHandler}>+3 cards</button>
    );

    let toggleHintsButton = (
      <button onClick={this.toggleHintsButtonHandler}>
        {this.state.showHints ? "hide" : "show"} hints
      </button>
    );

    let nextHintButton = (
      <button onClick={this.nextHintButtonHandler}>next</button>
    );

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
              <span>Sets ({this.state.availableSets.length})</span>
            </h3>
            <div class="topRow">
              {this.state.deck.length > 0 ? add3CardsButton : null}
              {this.state.availableSets.length > 0 ? toggleHintsButton : null}
              {this.state.availableSets.length > 1 && this.state.showHints
                ? nextHintButton
                : null}
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

  flattenArray(a) {
    if (a.length === 0) return [];
    let result = [];
    for (let i = 0; i < a.length; i++) result = result.concat(a[i]);
    return result;
  }

  toggleHintsButtonHandler = () => {
    let tc = this.state.tableCards.slice();
    let set = this.state.currentRevealedIndex;
    let showHints = !this.state.showHints;
    tc.map(card => {
      card.isSelected = false;
      card.isRevealed = false;
    });
    if (showHints)
      this.state.availableSets[set].map(tableIndex => {
        tc[tableIndex].isRevealed = true;
      });

    this.setState({ tableCards: tc, showHints });
  };

  nextHintButtonHandler = () => {
    let set =
      (this.state.currentRevealedIndex + 1) % this.state.availableSets.length;

    let tc = this.state.tableCards.slice();

    tc.map(card => {
      card.isSelected = false;
      card.isRevealed = false;
    });
    if (this.state.showHints === true)
      this.state.availableSets[set].map(tableIndex => {
        tc[tableIndex].isRevealed = true;
      });

    this.setState({
      currentRevealedIndex: set,
      tableCards: tc
    });
  };

  findPossibleSets = tableCards => {
    let tc = tableCards;
    let n = tc.length;
    let sets = [];
    start: for (let i = 0; i < n - 2; i++) {
      for (let j = i + 1; j < n - 1; j++) {
        for (let k = j + 1; k < n; k++) {
          let result = this.checkIfSet([tc[i].id, tc[j].id, tc[k].id]);
          if (result === true) sets.push([i, j, k]);
        }
      }
    }
    return sets;
  };

  countPossibleSets = tableCards => {
    let tc = tableCards;
    let n = tc.length;
    let count = 0;
    start: for (let i = 0; i < n - 2; i++) {
      for (let j = i + 1; j < n - 1; j++) {
        for (let k = j + 1; k < n; k++) {
          let result = this.checkIfSet([tc[i].id, tc[j].id, tc[k].id]);
          if (result === true) count++;
        }
      }
    }
    return count;
  };

  addCardsButtonHandler = () => {
    let { drawn, deck } = this.drawCards();
    let tableCards = this.state.tableCards.slice().concat(drawn);
    tableCards.map(i => {
      i.isRevealed = false;
    });
    let availableSets = this.findPossibleSets(tableCards);
    let currentRevealedIndex = availableSets.length > 0 ? 0 : -1;
    this.setState({
      tableCards,
      deck,
      availableSets,
      currentRevealedIndex,
      showHints: false
    });
  };

  cardClickHandler = (e, row, col) => {
    let i = row * 3 + col,
      set = [],
      tableCards = this.state.tableCards.slice(),
      foundSets = this.state.foundSets.slice(),
      deck = this.state.deck,
      availableSets = this.state.availableSets,
      currentRevealedIndex = this.state.currentRevealedIndex,
      showHints = this.state.showHints,
      drawn = [];

    tableCards[i].isSelected = !tableCards[i].isSelected; //toggle isSelected at current index

    let numSelected = 0;
    for (let card of tableCards) if (card.isSelected === true) numSelected++;

    // here we have 3 cards selected and are checking for a set, updating table etc.
    if (numSelected === 3) {
      set = tableCards.filter(i => i.isSelected === true).map(k => k.id);

      console.log(set);

      if (this.checkIfSet(set)) {
        //we need cards to be in {id,selected} format to display properly in CardGroup component
        foundSets.push(
          set.map(i => {
            return { id: i, isSelected: null, isRevealed: null };
          })
        );

        //remove cards that make up the set
        tableCards = tableCards.filter(card => card.isSelected === false);

        if (tableCards.length < 12) {
          console.log("need a fill!");
          ({ drawn, deck } = this.drawCards(Math.abs(12 - tableCards.length)));
        }
        numSelected = 0;
        tableCards = tableCards.concat(drawn);
        tableCards.map(c => {
          c.isRevealed = false;
        });
        currentRevealedIndex = availableSets.length > 0 ? 0 : -1;
        availableSets = this.findPossibleSets(tableCards);
        showHints = false;
      }

      //if 3 cards were selected but no set was found
      tableCards.map(c => {
        c.isSelected = false;
      });
    }

    this.setState({
      tableCards,
      foundSets,
      deck,
      availableSets,
      currentRevealedIndex,
      showHints
    });
  };

  initialState = (test = false, draw = 3) => {
    let deck = [];
    for (let i = 0; i < 81; i++) {
      deck.push(i);
    }

    if (!test) deck = this.shuffle(deck);

    let tableCards = deck.splice(0, draw);
    tableCards = tableCards.map(i => {
      return { id: i, isSelected: false, isRevealed: false };
    });
    let availableSets = this.findPossibleSets(tableCards);
    let currentRevealedIndex = availableSets.length > 0 ? 0 : -1;
    return {
      deck: deck,
      tableCards,
      selectedCards: [],
      foundSets: [],
      availableSets,
      currentRevealedIndex,
      showHints: false
    };
  };

  drawCards(n = 3) {
    if (this.state.deck.length === 0 || n === 0)
      return { drawn: [], deck: this.state.deck };
    if (this.state.deck.length < n) n = this.state.deck.length;

    let deck = this.state.deck.slice();
    let drawn = deck.splice(0, n).map(i => {
      return { id: i, isSelected: false, isRevealed: false };
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

    if (color.size === 2) return false;
    if (fill.size === 2) return false;
    if (number.size === 2) return false;
    if (shape.size === 2) return false;
    return true;
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

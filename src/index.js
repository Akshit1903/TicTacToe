import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button
      className={`square ${props.isBold && " win-square"}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: lines[i] };
    }
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    let isBold = false;
    this.props.winningSquares.forEach((winningSquare) => {
      if (winningSquare === i) {
        isBold = true;
      }
    });
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isBold={isBold}
      />
    );
  }

  render() {
    let res = [];
    for (let i = 0; i < 3; i++) {
      res.push([]);
      for (let j = 3 * i; j < 3 * i + 3; j++) {
        res[i].push(j);
      }
    }
    return (
      <div>
        {res.map((item, count) => {
          return (
            <div key={count} className="board-row">
              {item.map((squareNumber) => {
                return (
                  <span key={squareNumber}>
                    {this.renderSquare(squareNumber)}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), message: "Game Start" }],
      xIsNext: true,
      stepNumber: 0,
      isDescending: false,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: [
        ...history,
        {
          squares: squares,
          message:
            squares[i] +
            " checked row " +
            Math.trunc(i / 3 + 1) +
            ", column " +
            Math.trunc((i % 3) + 1),
        },
      ],
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }
  jumpTo(step) {
    this.setState({
      xIsNext: step % 2 === 0,
      stepNumber: step,
    });
  }
  handleMovesSorting(event) {
    this.setState({ isDescending: event.target.value === "descending" });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerData = calculateWinner(current.squares);
    let status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    let winningSquares = [-1, -1, -1];
    if (winnerData) {
      winningSquares = winnerData.winningSquares;
      status = "Winner: " + winnerData.winner;
    } else if (history.length === 10) {
      status = "Match Draw";
    }

    const moves = history.map((step, move) => {
      if (move === this.state.stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              <strong>{step.message}</strong>
            </button>
          </li>
        );
      }
      return (
        <li key={move}>
          <button className="unseleted-move" onClick={() => this.jumpTo(move)}>
            {step.message}
          </button>
        </li>
      );
    });
    const movesListReversed = {};
    if (this.state.isDescending) {
      moves.reverse();
      movesListReversed["reversed"] = "_";
    }

    // Render's Return
    return (
      <div className="game">
        <div className="db">
          <h1>Tic Tac Toe &nbsp;</h1>
          <p>
            A mini project I made
            <br /> while learning React.&nbsp;&nbsp;
          </p>
          <p>Akshit Lalit &#169; {new Date().getFullYear()}</p>
        </div>

        <br />
        <div className="game-board ">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={winningSquares}
          />
        </div>
        <div className="game-info db">
          <div>
            <label>Order:</label>
            <select
              defaultValue={this.state.movesSorting}
              onChange={(event) => this.handleMovesSorting(event)}
            >
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </div>
          <div>
            <h3>{status}</h3>
          </div>
          <ol {...movesListReversed}>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

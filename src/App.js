import React, { Component } from 'react'

import './App.css';

const ROW = 20;
const COL = 20;
let arrHL = [];

class Square extends Component {
  render() {
    let clname = "square";
    if (this.props.highlight) {
      clname += " highlight";
    }
    return (
      <button type="button" className={clname} onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

function checkCol(row, col, arr) {
  if (row > ROW - 5) {
    return false;
  }
  let count;

  arrHL = [];
  arrHL.push(row * COL + col);

  for (count = 1; count < 5; count+=1) {
    if (arr[(row + count) * COL + col] !== arr[row * COL + col]) {
      return false;
    }
    arrHL.push((row + count) * COL + col);
  }

  if (row === 0 || (row + count) === COL) {
    return true;
  }
  
  if (arr[(row - 1) * COL + col] === null || arr[(row + count) * COL + col] === null) {
    return true;
  }
  return false;
}

function checkRow(row, col, arr) {
  if (col > COL - 5) {
    return false;
  }
  let count;
  arrHL = [];
  arrHL.push(row * COL + col);
  for (count = 1; count < 5; count+=1) {
    if (arr[row * COL + (col + count)] !== arr[row * COL + col]) {
      return false;
    }
    arrHL.push(row * COL + (col + count));
  }
  
  if (col === 0 || (col + count) === COL) {
    return true;
  }
  
  if (arr[row * COL + (col - 1)] === null || arr[row * COL + (col + count)] === null) {
    return true;
  }
  return false;
}



function checkDiagonal1(row, col, arr) {
  if (row > COL - 5 || col > COL - 5) {
    return false;
  }
  let count;
  arrHL = [];
  arrHL.push(row * COL + col);
  for (count = 1; count < 5; count+=1) {
    if (arr[(row + count) * COL + (col + count)] !== arr[row * COL + col]) {
      return false;
    }
    arrHL.push((row + count) * COL + (col + count));
  }
  if (row === 0 || (row + count) === ROW || col === 0 || (col + count) === COL) {
    return true;
  }
  if (arr[(row - 1) * COL + (col - 1)] === null || arr[(row + count) * COL + (col + count)] === null) {
    return true;
  }
  return false;
}

function checkDiagonal2(row, col, arr) {
  if (row < 4 || col > COL - 5) {
    return false;
  }
  let count;
  arrHL = [];
  arrHL.push(row * COL + col);
  for (count = 1; count < 5; count+=1) {
    if (arr[(row - count) * COL + (col + count)] !== arr[row * COL + col]) {
      return false;
    }
    arrHL.push((row - count) * COL + (col + count));
  }
  if (row === 4 || row === (ROW - 1) || col === 0 || (col + count) === COL) {
    return true;
  }
  if (arr[(row + 1) * COL + (col - 1)] === null || arr[(row - count) * COL + (col + count)] === null) {
    return true;
  }
  return false;
}

function calculateWinner(squares) {
  for (let i = 0; i < squares.length; i+=1) {
    if (squares[i]) {
      if (checkCol(parseInt(i / COL, 10), parseInt(i % COL, 10), squares) ||
        checkRow(parseInt(i / COL, 10), parseInt(i % COL, 10), squares) ||
        checkDiagonal1(parseInt(i / COL, 10), parseInt(i % COL, 10), squares) ||
        checkDiagonal2(parseInt(i / COL, 10), parseInt(i % COL, 10), squares)
      ) {
        return true;
      }
    }
  }
  return false;
}


class Board extends Component {

  renderSquare(i) {

    let hili = false;

    if (this.props.hl) {
      for (let j = 0; j < arrHL.length; j+=1) {
        if (i === arrHL[j]) {
          hili = true;
          break;
        }
      }
    }


    return (
      <Square
        highlight={hili}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
    );
  }


  render() {
    const numbers = [];
    for (let i = 0; i < 400; i+=1) {
      numbers.push(i);
    }
    const list = numbers.map(number => (
      this.renderSquare(number)
    ));

    return (
      <div>

        <div className="board-row" >
          {list}
        </div>

      </div>

    )
  }

}
class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(400).fill(null),
        mv: 0,

      }],
      stepNumber: 0,
      xIsNext: true,
      winner: null,
      sort: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const currentMove = current.mv;
    const squares = current.squares.slice();
    if (current.highlight || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    if(calculateWinner(squares)){
      const winner = squares[i]
    this.setState(t =>({
      history: history.concat([{
        squares,
        mv: currentMove + 1,
        curRow: parseInt(i / COL, 10),
        curCol: parseInt(i % COL, 10),
        highlight: true,
      }]),
      stepNumber: history.length,
      xIsNext: !t.xIsNext,
      winner,
     
      
    }));
    }
    else{
      
      this.setState(t=>({
        history: history.concat([{
          squares,
          mv: currentMove + 1,
          curRow: parseInt(i / COL, 10),
          curCol: parseInt(i % COL, 10),
          highlight: false,
        }]),
        stepNumber: history.length,
        xIsNext: !t.xIsNext,
        
        
        
      }));
    }
  }

  jumpTo(step) {
  
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  sortHistory(){
    this.setState(t =>({
      sort: !t.sort
    }));
  }

  render() {

    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];

    if(!this.state.sort){
      history.reverse();
    }

    const moves = history.map((step) => {
      
      const move = step.mv;
      const desc =  (move&&move!==0) ?
        `Đi đến bước ( ${  step.curRow  } , ${  step.curCol  } )` :
        'Game mới';
      return (
        <li key={move}>
          <button type="button" className="list"  onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    const status = calculateWinner(current.squares) === false ? `Next player: ${  this.state.xIsNext ? 'X' : 'O'}` : `The Winner is: ${  this.state.winner}`;

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
            hl={current.highlight}
            onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <div><button type="button" onClick={()=>  this.sortHistory()}>Sắp xếp</button></div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}



export default Game;

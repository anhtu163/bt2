
import React, { Component } from 'react'

import './App.css';

const ROW = 20, COL = 20;
var arrHL = [];

class Square extends Component {
  render() {
    let clname = "square";
    if (this.props.highlight) {
      clname += " highlight";
    }
    return (
      <button className={clname} onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }


}

function calculateWinner(squares) {
  for (var i = 0; i < squares.length; i++) {
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

function checkCol(row, col, arr) {
  if (row > ROW - 5) {
    return false;
  }
  let count;

  arrHL = [];
  arrHL.push(row * COL + col);

  for (count = 1; count < 5; count++) {
    if (arr[(row + count) * COL + col] !== arr[row * COL + col]) {
      return false;
    }
    arrHL.push((row + count) * COL + col);
  }
  //chặn bởi biên
  if (row === 0 || (row + count) === COL) {
    return true;
  }
  //không chặn 2 đầu
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
  for (count = 1; count < 5; count++) {
    if (arr[row * COL + (col + count)] !== arr[row * COL + col]) {
      return false;
    }
    arrHL.push(row * COL + (col + count));
  }
  //chặn bởi biên
  if (col === 0 || (col + count) === COL) {
    return true;
  }
  //không chặn 2 đầu
  if (arr[row * COL + (col - 1)] === null || arr[row * COL + (col + count)] === null) {
    return true;
  }
  return false;
}


// cheo \
function checkDiagonal1(row, col, arr) {
  if (row > COL - 5 || col > COL - 5) {
    return false;
  }
  let count;
  arrHL = [];
  arrHL.push(row * COL + col);
  for (count = 1; count < 5; count++) {
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

// cheo /
function checkDiagonal2(row, col, arr) {
  if (row < 4 || col > COL - 5) {
    return false;
  }
  let count;
  arrHL = [];
  arrHL.push(row * COL + col);
  for (count = 1; count < 5; count++) {
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



class Board extends Component {

  renderSquare(i) {

    var hili = false;

    //console.log(this.props.hl)
    if (this.props.hl) {
      for (var j = 0; j < arrHL.length; j++) {
        if (i === arrHL[j]) {
          hili = true;
          break;
        }
      }
    }

    //console.log(hili);

    return (
      <Square
        highlight={hili}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
    );
  }


  render() {
    let numbers = [];
    for (let i = 0; i < 400; i++) {
      numbers.push(i);
    }
    let list = numbers.map(number => (
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
      status: false,
      winner: null,
      highlight: false,
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
      var winner = squares[i]
    this.setState({
      history: history.concat([{
        squares: squares,
        mv: currentMove + 1,
        curRow: parseInt(i / COL, 10),
        curCol: parseInt(i % COL, 10),
        highlight: true,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winner: winner,
      status: true,
      
    });
    }
    else{
      
      this.setState({
        history: history.concat([{
          squares: squares,
          mv: currentMove + 1,
          curRow: parseInt(i / COL, 10),
          curCol: parseInt(i % COL, 10),
          highlight: false,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        
        status: false,
        
      });
    }
  }
  jumpTo(step) {
    //var item = document.getElementById(step);
    //item.style.background = "red";
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  sortHistory(){
    this.setState({
      sort: !this.state.sort
    });
  }

  render() {

    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];

    if(!this.state.sort){
      history.reverse();
    }

    const moves = history.map((step, id) => {
      //var t = step.mv
      var move = step.mv;
      const desc =  (move&&move!==0) ?
        'Đi đến bước ( ' + step.curRow + ' , ' + step.curCol + ' )' :
        'Game mới';
      return (
        <li key={move}>
          <button className="list"  onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status = calculateWinner(current.squares) === false ? 'Next player: ' + (this.state.xIsNext ? 'X' : 'O') : 'The Winner is: ' + this.state.winner;

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
            hl={current.highlight}
            onClick={(i) => this.handleClick(i)}></Board>
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <div><button onClick={()=>  this.sortHistory()}>Sắp xếp</button></div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}



export default Game;

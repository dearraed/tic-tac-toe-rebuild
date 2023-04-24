import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


const Square = (props) =>  {
  //const [clicked, setClicked]=useState()
    return (
      <button className="square" style={{color: props.color}} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }



class Board extends React.Component {
 
 renderSquare = (i) => {
     return <Square value={this.props.squares[i]} onClick= {() => this.props.onClick(i) } color={this.props.colors && this.props.colors[i]}/>;
  } 
   

render(){
  let board = [] 
  let boardRow = [];
  let index = 0;
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      board.push(this.renderSquare(index));
      index += 1;
    }
    boardRow.push(board);
    board = [];
   }
  return (
    <div>
      {boardRow.map((board, key) => (
        <div key={"borad-row-"+key} className="board-row">
            {board}        
          </div>
      )) }
    </div>

  );
}
  
}




class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      colors:Array(9).fill("black"),
      moves: [],
      sortAsc: true,
      line: []
    };
  }

   handleClick(i) {
    if(!this.state.sortAsc){
      this.sortMoves();
    }
   
    const history = this.state.history.slice(0, this.state.sortAsc ? this.state.stepNumber + 1 : this.state.history.length - this.state.stepNumber);
    const current = history[history.length - 1];
    const squares = current.squares.slice();  
    const location = i;
    const colors = Array(9).fill("black");
    const winner = calculateWinner(squares);
    if(winner || squares[i]){
      console.log("winner : ", winner);
      console.log("squares i : ", squares[i]);
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
       
    if(!winner){
      colors[i] = "red";
    }

    

    this.setState({  
        history: history.concat([{
        squares: squares,
        location: location,
        colRow : JSON.stringify(colRow[i]),
        colors: colors
      }]), 
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        colors: colors
    });

     
  }


    jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
 }

 sortMoves(){
  console.log("this");
  this.setState({history: this.state.history.reverse(), sortAsc: !this.state.sortAsc}
)};

  render(){
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let colors = current && current.colors;
    if(winner){
      winner.line.map(i => colors[i] = "brown");
    }

    const moves = history.map((step, move) => {
      let moveTried = !this.state.sortAsc ? history.length - 1 - move : move;
      const desc = moveTried ? 
          'Go to move #' + moveTried :
          'Go to game start';
         
          return (
            <li key={move}>
              <button onClick={ () => this.jumpTo(move)}>{desc}{}{history[move].location != null && (' - location : ' + history[move].location + ' - col-row : ' + history[move].colRow)} </button>
            </li>
          )
    });
    let status;
    if (winner && winner.square) {
        status = 'Winner: ' + winner.square;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

   

      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares}
                   onClick={(i) => this.handleClick(i)} colors={colors}/>
          </div>
          <div className="game-info">
            <div>{status}</div><button onClick={() => this.sortMoves()}>sort</button>
            <ol>{moves}</ol>
          </div>
        </div>
  );
  }

}

const colRow = [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}];

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
      return {line: lines[i], square: squares[a]};
    }
  }
  return null;
}

export default Game

   
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
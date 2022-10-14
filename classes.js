/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

/*
Author: Mahad Osman
Date: Oct 14, 2022
Exercise: Refactoring Connect_4 with classes
Base provided by: Springboard
References: Springboard solution for connect four
    -How to bind the callback function for the eventhandler on the column-header
*/

class Game{
    constructor(player1, player2 ,width = 7,height =6,){
    this.height = height;
    this.width = width;
    //Creating an array of player objects to swap between the colors
    this.players = [player1, player2]
    //Setting player1 to start
    this.currPlayer = player1;
    this.makeBoard();
    this.makeHtmlBoard();
    //Adding a property for when the game is over
    }

makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
        this.board.push(Array.from({ length: this.width }));
        }
    }

makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML= '';
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top'); 
    
    //Have to bind the callback function otherwise this would not give us the proper event handler
    //Referenced the solution as my findspotforCol(x) was returning not found
    this.handleGameClick = this.handleClick.bind(this);
    top.addEventListener("click", this.handleGameClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
    
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
    
      board.append(row);
    }
  }
  findSpotForCol(x){
      for(let y = this.height - 1; y>= 0; y--){
          if(!this.board[y][x]){
              return y;
          }
      }
      return null;
  }

   placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    //Setting the pieces to the current players color set in when instating the player instances down below
    piece.style.backgroundColor = (this.currPlayer.color);
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  endGame(msg){
      alert(msg);
      // selecting the top to remove event listener 
      //Must also assign it to the tr with column top as that is where the event listener is set!
      const top = document.querySelector('#column-top');
      //By removing the eventListener the user will no longer be able to play pieces after end game is
      top.removeEventListener('click', this.handleGameClick);

  }
  handleClick(evt){
      const x = +evt.target.id;
      const y = this.findSpotForCol(x);
      if(y===null){
          return;
      }
      this.board[y][x] =this.currPlayer;
      this.placeInTable(y,x);

// check for win
  if (this.checkForWin()) {
      //returns player color has won as just currPLayer will return undefined
    return this.endGame(`Player ${this.currPlayer.color} won!`);
  }
    
     // check for tie
  if (this.board.every(row => row.every(cell => cell))) {
    return this.endGame('Tie!');
  }
  //this.currPlayer = this.currPlayer === 'p1' ? 'p2' : 'p1';
  //Now set to switch betwen the player array elements
  this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
  
  checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

//creating a player class to instatate an instance of player
//Will also assign the color to color property within the player
class Player{
    constructor(color){
        this.color = color;
    }
}

//Adding an event listener to the button to start the game
document.querySelector('#gameStart').addEventListener('click',(e)=>{
    //prevent the page from refreshing 
    e.preventDefault();

    //Will create a new player while also assigning the text boxes value to their color argument
    let player1 = new Player(document.querySelector('#player1').value);
    console.log(player1)
    let player2 = new Player(document.querySelector('#player2').value);
    console.log(player2)

    //If text boxes are left empty will set it to default colors
    if(player1.color === ''){
        player1.color = 'red';
    }
    if (player2.color === ''){
        player2.color = 'blue';
    }

    //Creates a new game while assigning player1, player2 to the new games constructors 
new Game(player1, player2);
});


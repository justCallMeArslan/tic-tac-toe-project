

function Gameboard() {
    const cols = 3; // values hardcoded intentionally for study project and being 99% of games grid
    const rows = 3;

    let board = Array(cols * rows).fill(""); // fill the grid of the game 3x3

    function resetBoard() {
        board.fill(""); // resets grid to initial state
    }

    function placeMark(index, mark) {
        //adding validation from invalid index e.g {100, "X"}
        if (index < 0 || index >= board.length) {
            return {
                status: false,
                reason: "Invalid index"
            }
        }
        // adding mark validation for "X" and "O" only allowed
        if (mark !== "X" && mark !== "O") {
            return {
                status: false,
                reason: "Invalid mark"
            }
        }
        // adding validation to prevent marking already marked cell
        if (board[index] !== "") {
            return {
                status: false,
                reason: "Cell is not empty"
            }
        }
        board[index] = mark;  // function runs, meansell is empty and we place mark
        return {
            status: true,
        }
    }

    // checking for grid status isFull or Not?
    function isFull() {
        return !board.includes(""); //when board full we get return board NOT include "", any other 
        // time if we call function we recieve false
    }

    // getter for grid
    function getGrid() {
        return Object.freeze([...board]); // creates "frozen" mutated shallow copy of board, only for 
        // array
    }
    return { placeMark, getGrid, resetBoard, isFull }; // returns for usage in gameController
}


function winChecker(grid) {
    const winningLines = [
        //rows 
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        //columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        //diagonal
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const [a, b, c] of winningLines) {
        // comparing a, b, c that they are not empty and the same X or O
        if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
            return grid[a]; // return X or O as a mark of winner
        }
    }
    return null; // if no winner on the board 
}

// test of Gameboard() functionallity

// const board = Gameboard();

// board.placeMark(0, "X"); // mark placed
// board.placeMark(20, "O"); // invalid index
// board.placeMark(0, "X"); // Cell is not empty
// board.placeMark(2, "Z"); // Invalid mark
// board.placeMark(1, "O");
// board.placeMark(2, "O");
// board.placeMark(3, "O");
// board.placeMark(4, "X");
// board.placeMark(5, "O");
// board.placeMark(6, "O");
// board.placeMark(7, "X");
// board.placeMark(8, "O"); // filled with no winner, returns full
// // board.resetBoard(); // board is empty

// const grid = board.getGrid();
// console.log(winChecker(grid));
// console.log(grid);



function Player(mark, nickname) {

    //adding validation for nickname
    if (!/^[a-zA-Z]+$/.test(nickname)){
        throw new Error ("Invalid characters used.  Only latin letters allowed.")
    }

    function getMark() { // closure for returning mark of player
        return mark
    }

    function getNickname() { // closure for returning name of player
        return nickname
    }

    return { getMark, getNickname };
}



function gameController() {

    const board = Gameboard(); // accessing board
    const playerOne = Player("X", "DOMforX");
    const playerTwo = Player("O", "DOMforO");
    const players = [playerOne, playerTwo];

    let currentPlayer = players[0];

    function switchPlayers() {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0] // checks  
        // whats player now (default is players[0]) and switches to opposite
    }

    function getCurrentPlayer() { // getter of who is CP
        return currentPlayer;
    }



    return { switchPlayers, getCurrentPlayer }
}

function Gameboard() {
    const cols = 3; // values hardcoded intentionally for study project
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
        // adding mark validation for "X" and "O" only allowed (will be deleted after DDM)
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
        board[index] = mark;  // all validation passed, mark being placed
        return {
            status: true,
        }
    }
    // checking for grid status isFull or Not?
    function isFull() {
        return !board.includes(""); // return true, when there is no empty cells left.
    }
    // getter for grid
    function getGrid() {
        return Object.freeze([...board]); // creates mutated shallow copy of board, and freezes it.
    }
    return { placeMark, getGrid, resetBoard, isFull }; // returns for usage in gameController
}

function Player(mark, nickname) {

    //adding validation for nickname
    const isValid = /^[a-zA-Z]+$/.test(nickname); //returns true/false
    function getMark() { // closure for returning mark of player
        return mark
    }
    function getNickname() { // closure for returning name of player
        return nickname
    }

    function getPlayerCard() { // set for displaying winner 
        return { mark, nickname }
    }
    return { getMark, getNickname, getPlayerCard, isValid };
}

function roundWin(boardInPlay) {
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
        if (boardInPlay[a] && boardInPlay[a] === boardInPlay[b] && boardInPlay[a] === boardInPlay[c]) {
            return boardInPlay[a]; // return X or O as a mark of round winner
        }
    }
    return null; // if no round winner on the board 
}


function gameController() {
    const board = Gameboard();

    const playerOne = Player("X", "DOMforX"); // nickname is going to be changed by DOM 
    const playerTwo = Player("O", "DOMforO"); // nickname is going to be changed by DOM 
    if (!playerOne.isValid || !playerTwo.isValid) {
        return {
            type: "INVALID_PLAYER",
            scope: {
                reason: "Please, use latin alphabet",
            }
        }
    }
    const players = [playerOne, playerTwo];
    let currentPlayer = players[0];

    function switchPlayers() {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0] // checks  
        // what is player now (default is players[0]) and switches to opposite
    }

    function getCurrentPlayer() { // can be used in DOM / may remove if unused 
        return currentPlayer;
    }

    // tracker of win counts (rounds)
    let scores = {
        X: 0,
        O: 0,
    }

    let gameOver = false; // flag when game should or shouldn't allow makeMove

    // attmempting to place mark,
    function makeMove(index) {
        if (gameOver === true) {
            return {
                type: "GAME_OVER"
            }
        }

        //placing mark until success
        const result = board.placeMark(index, currentPlayer.getMark());
        if (result.status === false) {
            return result;
        }

        // checking for winner
        const roundWinner = roundWin(board.getGrid())
        if (roundWinner !== null) {
            scores[roundWinner] += 1;
            matchWinner(); //should i make here const to store this data or not? if yes, why?
            resetRound();
            gameOver = true;
            return {
                type: "WIN",
                scope: {
                    mark: roundWinner,
                    nickname: currentPlayer.getNickname()
                }
            };
        } else if ((board.isFull())) {
            gameOver = true
            return {
                type: "TIE"
            }
        } else {
            switchPlayers();
            return {
                type: "PLAYING",
                scope: {
                    nextPlayer: currentPlayer.getNickname()
                }
            }
        }
    }

    function matchWinner() {
        if (scores[playerOne.getMark()] === 3) {
            return playerOne.getNickname() + 'wins the game';
        } else if (scores[playerTwo.getMark()] === 3) {
            return playerTwo.getNickname() + 'wins the game';
        }
        return null; // null means game is not ended, keep playing
    }


    function resetRound() { // reset function after round
        board.resetBoard();
        gameOver = false;
        currentPlayer = players[0];
    }

    function resetGame() { // staged for UI game reset (probably merger New Game button functionality)
        board.resetBoard();
        gameOver = false;
        currentPlayer = players[0];

        scores.X = 0;
        scores.O = 0;
    }


    return { getCurrentPlayer, makeMove, resetGame }
}




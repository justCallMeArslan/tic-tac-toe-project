const newGameBtn = document.querySelector(".new-game-btn");
const closeModal = document.querySelector(".close-modal");
const modal = document.querySelector(".form-pop-up");


function Gameboard() { // values hardcoded intentionally for study project, keeping in 
    // mind refactoring later for dynamic
    const cols = 3;
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

    return { getMark, getNickname, isValid };
}

function evaluateRound(boardInPlay) {
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
        if (boardInPlay[a] && boardInPlay[a] === boardInPlay[b]
            && boardInPlay[a] === boardInPlay[c]) {
            return {
                type: "ROUND_WIN",
                winner: boardInPlay[a],
            }
        }
    }
    if ((!boardInPlay.includes(""))) {
        return {
            type: "ROUND_TIE"
        }
    } else {
        return {
            type: "ROUND_PLAYING"
        }
    }
}


function gameController() {
    const board = Gameboard();

    const playerOne = Player("X", "DOMforX"); // nickname is going to be changed by DOM 
    const playerTwo = Player("O", "DOMforO"); // nickname is going to be changed by DOM 
    if (!playerOne.isValid || !playerTwo.isValid) {
        return {
            type: "INVALID_PLAYER",
            reason: "Please, use latin alphabet",
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

    function getScores() {
        return { ...scores }; // shallow copy of scores
    }

    let gameOver = false; // flag when game should or shouldn't allow makeMove

    // attmempting to place mark,
    function makeMove(index) {
        if (gameOver === true) {
            return {
                type: "GAME_STOP"
            }
        }

        //placing mark until success
        const result = board.placeMark(index, currentPlayer.getMark());
        if (result.status === false) {
            return result;
        }

        // checking for winner
        const roundWinner = evaluateRound(board.getGrid());
        if (roundWinner.type === "ROUND_WIN") {
            scores[roundWinner.winner] += 1;

            //check if match is won
            const matchWinner = evaluateMatch();
            if (matchWinner.type === "MATCH_WIN") {
                gameOver = true;
                return matchWinner; // will return evaluateMatch() return obj
            }

            // return after Round win
            return {
                type: "ROUND_WIN",
                mark: roundWinner.winner,
                nickname: currentPlayer.getNickname()
            };
        }
        if (roundWinner.type === "ROUND_TIE") {
            return {
                type: "ROUND_TIE" // UI event listener e.g. will click and reset (when needed)
            }
        }

        // no winner, round in progress
        switchPlayers();
        return {
            type: "ROUND_PLAYING",
            nextPlayer: currentPlayer.getNickname()
        };
    }

    function evaluateMatch() {
        if (scores[playerOne.getMark()] === 3) {
            return {
                type: "MATCH_WIN",
                nickname: playerOne.getNickname(),
                mark: playerOne.getMark()
            }
        } else if (scores[playerTwo.getMark()] === 3) {
            return {
                type: "MATCH_WIN",
                nickname: playerTwo.getNickname(),
                mark: playerTwo.getMark()
            }
        }
    }

    function resetRound() { // reset function after round
        board.resetBoard();
        currentPlayer = Math.random() > 0.5 ? players[0] : players[1]; // after first 
        // round randomize first turn
    }

    function resetGame() { // staged for UI game reset (probably merger New Game button functionality)
        board.resetBoard();
        gameOver = false;
        currentPlayer = players[0];

        scores.X = 0;
        scores.O = 0;
    }

    return { getCurrentPlayer, makeMove, resetGame, resetRound, getScores }

}



//testing part









// DOM part

// opening fomr for players info input


newGameBtn.addEventListener('click', function () {
    modal.showModal();
})
closeModal.addEventListener('click', function () {
    modal.close();
})
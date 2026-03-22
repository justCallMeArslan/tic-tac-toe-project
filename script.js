const newGameBtn = document.querySelector(".new-game-btn");
const closeModal = document.querySelector(".close-modal");
const modal = document.querySelector(".form-pop-up");
// const pOneNickname = document.querySelector("#p1-nickname");
// const pTwoNickname = document.querySelector("#p2-nickname");


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
                type: "ERROR",
                reason: "INVALID_INPUT"
            }
        }
        // adding mark validation for "X" and "O" only allowed (will be deleted after DDM)
        if (mark !== "X" && mark !== "O") {
            return {
                type: "ERROR",
                reason: "INVALID_INPUT"
            }
        }
        // adding validation to prevent marking already marked cell
        if (board[index] !== "") {
            return {
                type: "ERROR",
                reason: "INVALID_MOVE"
            }
        }
        board[index] = mark;  // all validation passed, mark being placed
        return {
            type: "SUCCESS",
        }
    }
    // checking for grid status isFull or Not?
    function isFull() {
        return !board.includes(""); // return true, when there is no empty cells left.
    }
    // getter for grid
    function getGrid() {
        return [...board]; // creates mutated shallow copy of board
    }
    return { placeMark, getGrid, resetBoard, isFull }; // returns for usage in gameController
}


function validateNickname(nickname) { //function to check 
    return /^[a-zA-Z\s]+$/.test(nickname);
}

function Player(mark, nickname) {
    function getMark() { // closure for returning mark of player
        return mark
    }
    function getNickname() { // closure for returning name of player
        return nickname
    }

    return { getMark, getNickname };
}

function evaluateRound(board) {
    const grid = board.getGrid();

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
        if (grid[a] && grid[a] === grid[b]
            && grid[a] === grid[c]) {
            return {
                type: "ROUND_WIN",
                winner: grid[a],
            }
        }
    }
    if (board.isFull()) {
        return {
            type: "ROUND_TIE"
        }
    } else {
        return {
            type: "ROUND_PLAYING"
        }
    }
}


function gameController(nicknameP1, nicknameP2) {
    const board = Gameboard();

    if (!validateNickname(nicknameP1) || !validateNickname(nicknameP2)) {
        return {
            type: "INVALID_PLAYER",
            reason: "Please, use only latin letters, no symbols or numbers allowed"
        }
    }

    const playerOne = Player("X", nicknameP1); // nickname is going to be changed by DOM 
    const playerTwo = Player("O", nicknameP2); // nickname is going to be changed by DOM 
    const players = [playerOne, playerTwo];
    let currentPlayer = players[0];

    // tracker of win counts (rounds)
    let scores = {
        X: 0,
        O: 0,
    }
    let gameOver = false; // flag when game should or shouldn't allow makeMove
    let roundActive = true; // flag to allow/forbid moves after round ends

    function switchPlayers() {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0] // checks  
        // what is player now (default is players[0]) and switches to opposite
    }
    function getCurrentPlayer() { // can be used in DOM / may remove if unused 
        return currentPlayer;
    }
    function getScores() {
        return { ...scores }; // shallow copy of scores
    }
    // attmempting to place mark,
    function makeMove(index) {
        if (gameOver) { // if true = match ended
            return {
                type: "MATCH_ENDED"
            };
        }

        if (!roundActive) { // if not true = false = round eded
            return {
                type: "ROUND_ENDED"
            };
        }

        //placing mark until success
        const result = board.placeMark(index, currentPlayer.getMark());
        if (result.type === "ERROR") {
            return result;
        }

        // checking for winner
        const roundWinner = evaluateRound(board);
        if (roundWinner.type === "ROUND_WIN") {
            scores[roundWinner.winner] += 1;
            roundActive = false; //end of round              
            //check if match is won
            const matchWinner = evaluateMatch();
            if (matchWinner.type === "MATCH_WIN") {
                gameOver = true;
                return matchWinner; // will return evaluateMatch() return obj
            }

            // return after Round win, UI decides reset (click to reset or some other behavior)
            return {
                type: "ROUND_WIN",
                mark: roundWinner.winner,
                nickname: currentPlayer.getNickname()
            };
        }
        if (roundWinner.type === "ROUND_TIE") {
            roundActive = false;
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
        } else {
            return {
                type: "MATCH_PLAYING"
            }
        }
    }

    function resetRound() { // reset function after round
        board.resetBoard();
        roundActive = true;
        currentPlayer = Math.random() > 0.5 ? players[0] : players[1]; // after first 
        // round randomize first player
    }

    function resetGame() { // staged for UI game reset (probably merger New Game button functionality)
        gameOver = false;
        scores.X = 0;
        scores.O = 0;
        resetRound();
    }

    function getBoard() { // to use in testing with grid printed
        return board;
    }

    return { getCurrentPlayer, getScores, makeMove, resetGame, resetRound, getBoard }

}



// DOM part




newGameBtn.addEventListener('click', function () {
    modal.showModal();
})
closeModal.addEventListener('click', function () {
    modal.close();
})
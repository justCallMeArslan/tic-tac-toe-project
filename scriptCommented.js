const newGameBtn = document.querySelector(".new-game-btn");
const modal = document.querySelector(".form-pop-up");
const form = document.querySelector(".players-container");
const cells = document.querySelectorAll(".cell");
const p1Name = document.querySelector(".p1-para");
const p1Score = document.querySelector(".p1-score");
const p2Name = document.querySelector(".p2-para");
const p2Score = document.querySelector(".p2-score");
const p1Nickname = document.querySelector("#p1-nickname");
const p2Nickname = document.querySelector("#p2-nickname");
const p1Mark = document.querySelector(".p1-mark");
const p2Mark = document.querySelector(".p2-mark");
const x = document.querySelector(".mark-x");
const o = document.querySelector(".mark-o");
const resetBtn = document.querySelector(".reset-button");
const turnPopup = document.querySelector(".turn-popup");
const winPopup = document.querySelector(".win-popup");


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


function gameController(mark1, mark2, nicknameP1, nicknameP2) {
    const board = Gameboard();

    if (!validateNickname(nicknameP1) || !validateNickname(nicknameP2)) {
        return {
            type: "INVALID_PLAYER",
            reason: "Please, use only latin letters, no symbols or numbers allowed"
        }
    }

    const playerOne = Player(mark1, nicknameP1);
    const playerTwo = Player(mark2, nicknameP2);
    const players = [playerOne, playerTwo];
    let currentPlayer = players[0];

    // tracker of win counts (rounds)

    let scores = {
        [playerOne.getMark()]: 0,
        [playerTwo.getMark()]: 0,
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

    function getPlayers() {
        return [...players];
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
        showTurnPopup(); // to notify what player has a turn
    }

    function resetGame() { // staged for UI game reset (probably merger New Game button functionality)
        gameOver = false;
        scores[playerOne.getMark()] = 0;
        scores[playerTwo.getMark()] = 0;
        resetRound();
    }

    function getBoard() { // to use in testing with grid printed
        return board;
    }

    return { getCurrentPlayer, getScores, makeMove, resetGame, resetRound, getBoard, getPlayers }

}



// DOM part

let game = null;

function renderBoard() {

    if (game === null) { // if there is no game started - stop function
        return
    };

    const grid = game.getBoard().getGrid();  // reads data from on-going game grid

    cells.forEach(cell => {
        const index = Number(cell.dataset.index); // dataset is the way to get information from data-index
        cell.textContent = grid[index]; // reflects grid in UI
    })
}

function renderScore() {
    const scores = game.getScores();

    p1Score.textContent = `Rounds won: ${scores[game.getPlayers()[0].getMark()]}`; // checking first 
    //wha player and then what mark used 
    p2Score.textContent = `Rounds won: ${scores[game.getPlayers()[1].getMark()]}`;
}

function renderMark() {
    p1Mark.textContent = `Player #1 mark: ${game.getPlayers()[0].getMark()}`;
    p2Mark.textContent = `Player #2 mark: ${game.getPlayers()[1].getMark()}`;

}


cells.forEach(cell => {
    cell.addEventListener("click", () => {
        if (game === null) {
            return
        }

        const index = Number(cell.dataset.index); // index which was clicked
        const move = game.makeMove(index); // placing mark after recieving index of what pressed

        if (move.type === "ROUND_ENDED") { // controlled by roundActive flag
            game.resetRound();
            highlightCurrentPlayerNickname();
            renderBoard();
            return;
        }

        renderBoard(); // to update UI after each move made
        if (move.type === "ROUND_WIN") { // render updated scores after round end
            renderScore();
        }
        highlightCurrentPlayerNickname();
        handleResult(move)
    });
})


function handleResult(result) {
    switch (result.type) {
        case "ROUND_WIN":
            alert(`${result.nickname} won the round!`);
            break;
        case "ROUND_TIE":
            alert("Round tied!");
            break;
        case "MATCH_WIN":
            showWinPopup(result.nickname);
            break;
        case "INVALID_MOVE":
            console.log("Invalid move.");
            break;
        case "ROUND_ENDED":
            console.log("No moves allowed until reset!");
            break;
        case "MATCH_ENDED":
            console.log("Start new game!");
            break;
    }
}


let selectedMark = null;

x.addEventListener("click", () => {
    selectedMark = "X";
});

o.addEventListener("click", () => {
    selectedMark = "O";
});

form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page reload on background (on form button click)

    const nicknameP1 = p1Nickname.value.toUpperCase().trim(); // getting p1 nickname and trim spaces (start and end)
    const nicknameP2 = p2Nickname.value.toUpperCase().trim();


    if (!selectedMark) {
        alert("Please choose X or O before submitting!");
        return;
    };

    const mark1 = selectedMark;
    const mark2 = mark1 === "X" ? "O" : "X";

    const newGame = gameController(mark1, mark2, nicknameP1, nicknameP2);

    if (newGame.type === "INVALID_PLAYER") {
        alert(newGame.reason);
        return;
    }

    game = newGame; // changing game state from null to PLAYING

    p1Name.textContent = `${nicknameP1}`;
    p2Name.textContent = `${nicknameP2}`;
    renderBoard(); // shows clean new board 
    renderMark();
    highlightCurrentPlayerNickname();
    modal.close(); // close modal after submission

})


function resetUI() {
    resetBtn.addEventListener("click", () => {
        game.resetGame();
        renderBoard();
        renderScore();
        renderMark();
        return;
    })
}
resetUI();

newGameBtn.addEventListener('click', function () {
    modal.showModal();
})

function showTurnPopup() {
    const playerInGame = game.getCurrentPlayer();
    turnPopup.textContent = `${playerInGame.getNickname()} starts next round!`;
    turnPopup.style.display = "block";
    setTimeout(() => {
        turnPopup.style.display = "none";
    }, 2000);
};

function showWinPopup(winnersNickname) {
    winPopup.textContent = `${winnersNickname} is the ABSOLUTE winner!!`;
    winPopup.style.display = "block";
    winPopup.addEventListener("click", () => {
        winPopup.style.display = "none";
    }, { once: true })
};

function highlightCurrentPlayerNickname() {
    const current = game.getCurrentPlayer().getNickname();
    p1Name.style.fontWeight = game.getPlayers()[0].getNickname() === current ? "bold" : "normal";
    p2Name.style.fontWeight = game.getPlayers()[1].getNickname() === current ? "bold" : "normal";
};


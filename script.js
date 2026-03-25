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

function Gameboard() {
    const cols = 3;
    const rows = 3;

    let board = Array(cols * rows).fill("");

    function resetBoard() {
        board.fill("");
    }

    function placeMark(index, mark) {
        if (index < 0 || index >= board.length) {
            return {
                type: "ERROR",
                reason: "INVALID_INPUT"
            }
        }
        if (mark !== "X" && mark !== "O") {
            return {
                type: "ERROR",
                reason: "INVALID_INPUT"
            }
        }
        if (board[index] !== "") {
            return {
                type: "ERROR",
                reason: "INVALID_MOVE"
            }
        }
        board[index] = mark;
        return {
            type: "SUCCESS",
        }
    }
    function isFull() {
        return !board.includes("");
    }
    function getGrid() {
        return [...board];
    }
    return { placeMark, getGrid, resetBoard, isFull };
}
function validateNickname(nickname) {
    return /^[a-zA-Z\s]+$/.test(nickname);
}
function Player(mark, nickname) {
    function getMark() {
        return mark
    }
    function getNickname() {
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
        if (grid[a] && grid[a] === grid[b]
            && grid[a] === grid[c]) {
            return {
                type: "ROUND_WIN",
                winner: grid[a]
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

    let scores = {
        [playerOne.getMark()]: 0,
        [playerTwo.getMark()]: 0,
    }
    let gameOver = false;
    let roundActive = true;

    function switchPlayers() {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0]
    }
    function getCurrentPlayer() {
        return currentPlayer;
    }
    function getScores() {
        return { ...scores };
    }
    function getPlayers() {
        return [...players];
    }
    function makeMove(index) {
        if (gameOver) {
            return {
                type: "MATCH_ENDED"
            };
        }
        if (!roundActive) {
            return {
                type: "ROUND_ENDED"
            };
        }
        const result = board.placeMark(index, currentPlayer.getMark());
        if (result.type === "ERROR") {
            return result;
        }
        const roundWinner = evaluateRound(board);
        if (roundWinner.type === "ROUND_WIN") {
            scores[roundWinner.winner] += 1;
            roundActive = false;
            const matchWinner = evaluateMatch();
            if (matchWinner.type === "MATCH_WIN") {
                gameOver = true;
                return matchWinner;
            }
            return {
                type: "ROUND_WIN",
                mark: roundWinner.winner,
                nickname: currentPlayer.getNickname()
            };
        }
        if (roundWinner.type === "ROUND_TIE") {
            roundActive = false;
            return {
                type: "ROUND_TIE"
            }
        }
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
    function resetRound() {
        board.resetBoard();
        roundActive = true;
        currentPlayer = Math.random() > 0.5 ? players[0] : players[1];
        showTurnPopup();
    }
    function resetGame() {
        gameOver = false;
        scores[playerOne.getMark()] = 0;
        scores[playerTwo.getMark()] = 0;
        resetRound();
    }
    function getBoard() {
        return board;
    }

    return { getCurrentPlayer, getScores, makeMove, resetGame, resetRound, getBoard, getPlayers }
}
// DOM part
let game = null;
function renderBoard() {
    if (game === null) {
        return
    };
    const grid = game.getBoard().getGrid();
    cells.forEach(cell => {
        const index = Number(cell.dataset.index);
        cell.textContent = grid[index];
    })
}
function renderScore() {
    const scores = game.getScores();
    p1Score.textContent = `Rounds won: ${scores[game.getPlayers()[0].getMark()]}`;
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
        const index = Number(cell.dataset.index);
        const move = game.makeMove(index);

        if (move.type === "ROUND_ENDED") {
            game.resetRound();
            highlightCurrentPlayerNickname();
            renderBoard();
            return;
        }
        renderBoard();
        if (move.type === "ROUND_WIN") {
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
    e.preventDefault();
    const nicknameP1 = p1Nickname.value.toUpperCase().trim();
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
    game = newGame;
    p1Name.textContent = `${nicknameP1}`;
    p2Name.textContent = `${nicknameP2}`;
    renderBoard();
    renderMark();
    highlightCurrentPlayerNickname();
    modal.close();

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




function Gameboard(size = 3) {
    let board = Array(size * size).fill(""); // fill the grid of the game 3x3

    function resetBoard() {
        board = Array(size * size).fill(""); // resets grid to initial state
    }

    function placeMark(index, mark) {
        //adding validation from invalid index e.g {100, "X"}
        if (index < 0 || index >= board.length) {
            return {
                status: false,
                reason: "Invalid index"
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
    function getGrid() {
        return Object.freeze([...board]); // creates "frozen" mutated shallow copy of board
    }


    function winChecker() {
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
            if (board[a] && board[a] === board[b] && board[a] === board[c]) { 
                return board[a]; // return X or O as a mark of winner
            }
        }
        return null; // if no winner on the board 
    }

    return { placeMark, getGrid, resetBoard }; // returns for usage in gameController

}

































function Player(mark, nickname) {

    function getMark() { // closure for returning mark of player
        return mark
    }

    function getNickname() { // closure for returning name of player
        return nickname;
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
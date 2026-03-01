

function Gameboard() {
    const rows = 3;
    const columns = 3;
    let board = Array(rows * columns).fill(""); // fill the grid of the game 3x3

    function resetBoard() {
        board = Array(rows * columns).fill(""); // resets grid to initial state
    }

    function placeMark(index, mark) {
        if (board[index] !== "") {
            return false;
        } // checks if cell/index isnt empty and return false
        board[index] = mark;  // function runs, meansell is empty and we place mark
        return true;

    }
    function getGrid() {
        const gridStatus = [...board]; // creates mutated shallow copy of board
        return gridStatus;
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


    return {switchPlayers, getCurrentPlayer}
}
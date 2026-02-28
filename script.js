

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

function Player(mark, name) {

    function getMark() { // closure for returning mark of player
        return mark
    }

    function getName() { // closure for returning naem of player
        return name;
    }
    return { getMark, getName };
}


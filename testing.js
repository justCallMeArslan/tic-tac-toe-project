//testing part

const game = gameController("Ars", "Aishok");
const board = game.getBoard(); // getBoard() needed to be added into gameController() for testing 
// with grid

function printBoard(board) {
    const grid = board.getGrid(); // salllow copy of board for round
    for (let i = 0; i < 3; i++) {
        console.log(grid.slice(i * 3, i * 3 + 3).join(" | ")); // creatin a grid in console
    }
    console.log("\n"); // empty line as <br> after board printed
}

console.log("First player:", game.getCurrentPlayer().getNickname());


function moveAndPrint(idx) { //function for easier testing
    const res = game.makeMove(idx);
    printBoard(board);
    console.log(res);
    return res;
}


moveAndPrint(1);





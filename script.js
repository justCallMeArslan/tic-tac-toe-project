

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = Array(rows * columns).fill(""); // fill the grid of the game 3x3


}



// Good start — you’ve initialized a 3×3 board! ✅

// Now pause and think carefully:

// Right now, you just ** created the array **, but ** Gameboard doesn’t return anything **, and ** nothing can interact with the board from outside **.

// Ask yourself:

// 1. How will the ** Game module place a mark ** on this board ?

//    * What function does it need to call ?
//    * How will that function check if a cell is empty before placing a mark ?

//     2. How will the Game ** read the current state of the board ** without accessing the array directly ?

//    * Should it get the array itself, or a ** copy ** to prevent external changes ?

//     3. How can you ** keep the `board` array private ** while still letting Game interact with it ?

//    * Hint : **return an object with methods only ** — these methods will close over the `board` variable.

// Think through these questions and sketch the ** names of 2–3 methods ** your Gameboard should expose next.Once you have them, we can reason about what each should do internally.

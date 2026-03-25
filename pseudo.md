Step 1. Three responsible parts : 
1. the board state (responsible for layout and changes state of board)
2. the players (read board state only)
3. the game-controller/flow logic (responsible for controling round, count and final result)

Step 2. Design
Board:

Data: board state and mark placed, board grid
Methods: factory

Player:

Data: id, placing marks
Methods: factory

Game Controller:

Data: round count, players score,  winner / loser, game reset
Methods: factory

Step 3. Order of Building

a. - build board module (no DOM yet)
b. - test it in console
c. - build player factory
d. - build game controller
e. - connect to DOM


Step 4. Design

Board only responsible for its state: controlling cells and their condtion (empty or not), 
what is grid overall
Game controls all logic processes


Game design flow:

For reference:
gameController() = game();
Gameboard() = board();

- game() initialize (click on Start button and choose Mark with Nickname)
- game() handles move 
- game() attempts to place mark
- board() updates grid
- winChecker() handles status for win/lose/isFull/Tie
- game() switches player
- game() updates score
- game() resets round 
- board() resets board
- game() decares winner 


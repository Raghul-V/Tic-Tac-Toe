const body = document.body;

var hardGame = confirm("Do you want to play against A.I.? ");

var human = "X";
var computer = "O";
var isGameOver = false;

var nthMove = 0;

var minimaxScore = {
    "X" : -1,
    "O" : 1
};

const board = body.querySelector("table");
const box = body.querySelectorAll("td");


function isMatchTie() {
    for (let i = 0; i < 9; i++) {
        if (!box[i].innerText) {
            return false;
        }
    }
    return true;
}


function isPlayerWon(player) {
    for (let i=0; i<3; i++) {
        if ((box[i*3].innerText == player && 
                box[i*3+1].innerText == player && 
                    box[i*3+2].innerText == player) || 
            (box[i].innerText == player && 
                box[i+3].innerText == player && 
                    box[i+6].innerText == player)) {
            return true;
        }
    }

    if ((box[0].innerText == player && 
            box[4].innerText == player && 
                box[8].innerText == player) || 
        (box[2].innerText == player && 
            box[4].innerText == player && 
                box[6].innerText == player)) {
        return true;
    }

    return false;
}


function minimax(player) {
    let opponent = (player == "X") ? "O" : "X";
    let bestScore = minimaxScore[opponent];
    let bestMove = null;

    // checks for all possible ways of finishing the game
    // and returns the best move
    for (let i = 0; i < box.length; i++) {
        if (box[i].innerText == "") {
            box[i].innerText = player;
            
            if (isPlayerWon(player)) {
                box[i].innerText = "";
                return [ minimaxScore[player], i ];
            }
            if (isMatchTie()) {
                box[i].innerText = "";
                return [ 0, i ];
            }
            
            [ score, pos ] = minimax(opponent);
            if (minimaxScore[player] == 1) {
                if (score == 1) {
                    box[i].innerText = "";
                    return [ 1, i ];
                }
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
                bestScore = Math.max(score, bestScore);
            }
            else {
                if (score == -1) {
                    box[i].innerText = "";
                    return [ -1, i ];
                }
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
            box[i].innerText = "";
        }
    }

    return [ bestScore, bestMove ];
}


function computerMove() {
    // if the center is empty, it fills the center
    if (!box[4].innerText) {
        box[4].innerText = computer;
        return true;
    }

    // if there is any possible move which can make the computer win
    // it fills that position
    for (let i = 0; i < box.length; i++) {
        if (!box[i].innerText) {
            box[i].innerText = computer;
            if (isPlayerWon(computer)) {
                return true;
            }
            box[i].innerText = "";
        }
    }

    // if there is any possible move which can make the human win
    // it occupies that position
    for (let i = 0; i < box.length; i++) {
        if (!box[i].innerText) {
            box[i].innerText = human;
            if (isPlayerWon(human)) {
                box[i].innerText = computer;
                return true;
            }
            box[i].innerText = "";
        }
    }

    // uses the minimax algorithm to find the optimal move
    if (nthMove != 1 && hardGame) {
        let [ score, bestMove ] = minimax(computer);
        if (bestMove === null) {
            for (let i = 0; i < 9; i++) {
                if (!box[i].innerText) {
                    bestMove = i;
                    break;
                }
            }
        }

        box[bestMove].innerText = computer;
        return true;
    }
    // it picks a random move from the remaining possible position
    else {
        let choices1 = [];
        let arr1 = [0, 2, 6, 8];
        let choices2 = [];
        let arr2 = [1, 3, 5, 7];

        for (let i = 0; i < 4; i++) {
            if (!box[arr1[i]].innerText) {
                choices1.push(arr1[i]);
            }
        }

        if (choices1.length) {
            let position = choices1[Math.floor(Math.random() * choices1.length)];
            box[position].innerText = computer;
            return true;
        }

        for (let i = 0; i < 4; i++) {
            if (!box[arr2[i]].innerText) {
                choices2.push(arr2[i]);
            }
        }

        if (choices2.length) {
            let position = choices2[Math.floor(Math.random() * choices2.length)];
            box[position].innerText = computer;
            return true;
        }
    }

    return false;
}


for (let i = 0; i < box.length; i++) {
    box[i].addEventListener('click', function () {
        if (isGameOver) {
            alert("Sorry, Game Over!... Refresh the page to play again.")
        }
        else if (!box[i].innerText) {
            nthMove += 1;
            box[i].innerText = human;
            if (isPlayerWon(human)) {
                board.style.backgroundColor = "rgb(0, 240, 15)";
                isGameOver = true;
                return;
            } 
            else if (isMatchTie()) {
                board.style.backgroundColor = "yellow";
                isGameOver = true;
                return;
            }

            computerMove();

            if (isPlayerWon(computer)) {
                board.style.backgroundColor = "red";
                isGameOver = true;
                return;
            } 
            else if (isMatchTie()) {
                board.style.backgroundColor = "yellow";
                isGameOver = true;
                return;
            }
        }
        else {
            alert("Sorry, the box is already filled!")
        }
    });
}


const width = 10

//The Tetrominoes
const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
]

const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
]

const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
]

const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
]

const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
]
//Holds all the shapes
const theTetraminoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
//Random colour array
const colors = ['orange', 'red', 'purple', 'green', 'blue']

const displayWidth = 4
let displayIndex = 0
let time = 1000;
let currentTime = 0;

//without rotations
const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
]

document.addEventListener("DOMContentLoaded", () => {
    let timerInterval = null;

    const grid = document.querySelector(".grid")
    let squares = Array.from(document.querySelectorAll(".grid div"))
    const ScoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    //next piece
    const displaySquares = document.querySelectorAll(".mini-grid div")
    let nextRandom;
    let timerId = null;
    let score, currentPosition, currentRotation;
    let currentPieceIndex, current, colour;
    const timerObject = document.getElementById("timer")
    
    function initGame() {
        score = 0;
        time = 500;
        ScoreDisplay.innerHTML = 0;
        currentPosition = 4;
        currentRotation = 0;
        score = 0;
        currentPieceIndex = Math.floor(Math.random() * theTetraminoes.length);
        current = theTetraminoes[currentPieceIndex][currentRotation];
        colour = colors[currentPieceIndex];

        /*Setup next Random */
        nextRandom = Math.floor(Math.random() * theTetraminoes.length);

        for (let i = 0; i < 200; i++) {
            squares[i].removeAttribute("class");
            squares[i].style.backgroundColor = "yellow";
        }
        startBtn.innerHTML = "Stop";
        playBtn.innerHTML = "Pause";
        currentTime = 0;
        timerInterval = setInterval(timerIncrement, 1000)
        timerObject.innerHTML = 0 + ":" + 0;
    }

    function timerIncrement() {
        currentTime++;
        let minutes = Math.floor(currentTime / 60);
        let seconds = (currentTime % 60);
        timerObject.innerHTML = " " + minutes + ":" + seconds;
        
    }

    //draw piece
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colour
        })
    }

    //display the shape in hte mini-grid display
    function displayShape() {
        /*Clear display Squares */
        displaySquares.forEach(square => {
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //clear piece
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].removeAttribute("class")
            squares[currentPosition + index].removeAttribute("style")
        })
    }

    function moveDown() {
        undraw();
        //move to next position
        currentPosition += width
        //redraw
        draw();
        //check freeze
        checkCollision();

    }




    function checkCollision() {

        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))

            //Draw new piece
            currentPieceIndex = nextRandom;
            currentRotation = 0;
            nextRandom = Math.floor(Math.random() * theTetraminoes.length);
            current = theTetraminoes[currentPieceIndex][currentRotation];
            colour = colors[currentPieceIndex];
            currentPosition = 4

            if (time > 800) {
                time -= 5;
            } else {
                time = 800;
            }
            clearInterval(timerId)
            timerId = setInterval(moveDown, time)
            draw();
            displayShape();
            addScore();
            gameOver();
        }

    }


    //move to left
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) {
            currentPosition -= 1
        }
        if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            currentPosition += 1
        }

        draw()
    }


    //move to right
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === (width - 1));
        if (!isAtRightEdge) {
            currentPosition += 1
        }
        if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            currentPosition -= 1
        }

        draw()
    }

    //rotate the tetromine
    function rotate() {
        if (currentPieceIndex == 4) {
            if (((currentPosition % 10) > 6) || ((currentPosition % 10) < 0)) {
                return;
            }
        }
        else {
            if (((currentPosition % 10) > 7) || ((currentPosition % 10) < 0)) {
                return;
            }
        }

        let nextRotation = currentRotation + 1;
        if (nextRotation === current.length) {
            nextRotation = 0;
        }
        //Check if it will clash with other parts
        nextPosition = theTetraminoes[currentPieceIndex][nextRotation]
        let willConflict = nextPosition.some(index => squares[currentPosition + index].classList.contains("taken"))
        if (willConflict) {
            return;
        }
        undraw();
        currentRotation = nextRotation;
        current = nextPosition
        draw()
        checkCollision();
    }

    const playBtn = document.getElementById("pause-button")

    startBtn.addEventListener('click', () => {
        if (timerId) {
            /*Stopped */
            document.removeEventListener("keydown", control);
            startBtn.innerHTML = "Start";
            clearInterval(timerId)
            clearInterval(timerInterval)
            timerId = null;
            playBtn.disabled = true;
            playBtn.innerHTML = "Play"
        } else {
            /*Start */
            initGame();
            playBtn.disabled = false;
            document.addEventListener('keydown', control);
            draw()
            timerId = setInterval(moveDown, time)

            nextRandom = Math.floor(Math.random() * theTetraminoes.length)
            displayShape()

        }
    })


    /* Add play/pause button */
    playBtn.addEventListener('click', () => {
        /*Running -> Pause*/
        if (playBtn.innerHTML === "Pause") {
            clearInterval(timerInterval)
            clearInterval(timerId)
            document.removeEventListener("keydown", control);
            playBtn.innerHTML = "Play";
        } else {
            /*Paused -> Run*/
            document.addEventListener('keydown', control);
            timerId = setInterval(moveDown, time)
            timerInterval = setInterval(timerIncrement, 1000)
            playBtn.innerHTML = "Pause";
        }
    })

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains("taken"))) {
                score += 10
                ScoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetramino')
                    squares[index].style.backgroundColor = 'yellow'
                })
                const squaresRemove = squares.splice(i, width)
                squares = squaresRemove.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            ScoreDisplay.innerHTML = 'Game Over';
            playBtn.disabled = true;
            startBtn.innerHTML = "Start";
            document.removeEventListener("keydown", control);
            clearInterval(timerId)
            clearInterval(timerInterval)
            startBtn.innerHTML = "Start"
            timerId = null;
        }
    }

    //Register event listeners
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        }
        else if (e.keyCode === 38) {
            rotate()
        }
        else if (e.keyCode === 39) {
            moveRight()
        }
        else if (e.keyCode === 40) {
            moveDown()
        }
    }

});






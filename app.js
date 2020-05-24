document.addEventListener("DOMContentLoaded", ()=> {
    const grid = document.querySelector(".grid")
    let squares = Array.from(document.querySelectorAll(".grid div"))
    const ScoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0;
    let timerId = null;
    const time = 100;
    let score = 0;
    const colors = ['orange','red','purple','green','blue']

  //The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTetraminoes = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;


  let random = Math.floor(Math.random() * theTetraminoes.length);
  let current = theTetraminoes[random][currentRotation];

  //draw Tetromino
  function draw() {
      current.forEach(index => {
          squares[currentPosition + index].classList.add('tetromino')
          squares[currentPosition + index].style.backgroundColor = colors[random]
      })
    }

    function undraw(){
        current.forEach(index =>{
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    function moveDown () {
        undraw();
        currentPosition += width
        draw();
        freeze();
    }

    function control(e){
        if(e.keyCode === 37){
            moveLeft();
        }
        else if (e.keyCode === 38){
            rotate()
        }
        else if(e.keyCode === 39){
            moveRight()
        }
        else if (e.keyCode === 40){
            moveDown()
        }
    }

    document.addEventListener('keyup',control);

   
    function freeze() {
        if(current.some(index =>squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition+index].classList.add('taken'))

            //Draw new piece
            random = nextRandom;
            currentRotation = 0;
            nextRandom = Math.floor(Math.random() * theTetraminoes.length);
            current = theTetraminoes[random][currentRotation];
            currentPosition = 4

            draw();
            displayShape();
            addScore();
            gameOver();
        }

    }


    //move to left
    function moveLeft(){
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge){
            currentPosition -= 1
        }
        if  (current.some(index => squares[currentPosition+index].classList.contains("taken"))){
            currentPosition += 1
        }

        draw()
    }


    //move to right
    function moveRight(){
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === (width-1));
        if (!isAtRightEdge){
            currentPosition += 1
        }
        if  (current.some(index => squares[currentPosition+index].classList.contains("taken"))){
            currentPosition -= 1
        }

        draw()
    }

    //rotate the tetromine
    function rotate(){
        undraw();
        currentRotation++
        if (currentRotation=== current.length){
            currentRotation = 0;
        }
        current = theTetraminoes[random][currentRotation]
        draw()
    }

    //next piece
    const displaySquares = document.querySelectorAll(".mini-grid div")
    const displayWidth = 4
    let displayIndex = 0

    //without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0,displayWidth,displayWidth+1,displayWidth*2+1],
        [1,displayWidth,displayWidth+1,displayWidth+2],
        [0,1,displayWidth,displayWidth+1],
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1],
    ]

    //display the shape in hte mini-grid display
    function displayShape(){
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
                displaySquares[displayIndex + index].classList.add("tetromino")
                displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    startBtn.addEventListener('click', () => {
        if(timerId){
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown,time)
            nextRandom = Math.floor(Math.random()*theTetraminoes.length)
            displayShape()
        }
    })

    function addScore(){
        for(let i = 0;i < 199;i+=width){
            const row = [i, i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]

            if(row.every(index => squares[index].classList.contains("taken"))){
                score+=10
                ScoreDisplay.innerHTML = score;
                row.forEach(index =>{
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetramino')
                    squares[index].style.backgroundColor = 'yellow'
                })
                const squaresRemove = squares.splice(i, width)
                console.log(squaresRemove)
                squares = squaresRemove.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function gameOver(){
        if (current.some (index => squares[currentPosition+index].classList.contains('taken'))){
            ScoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }
});






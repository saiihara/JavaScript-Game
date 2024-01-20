document.addEventListener('DOMContentLoaded', () => {

    /**
     * VARIABLES
     */

    const grid = document.querySelector('.grid');
    const contentDiv = document.querySelector('.content');
    const doodler = document.createElement('div');
    const highScoreDisplay = document.getElementById('highScore');
    const currentScoreDisplay = document.getElementById('currentScore');
    const newHighScoreMessage = document.getElementById('newHighScoreMessage');
    const startButton = document.getElementById('startButton');

    let isGameOver = false;
    let isGameStarted = false;
    let platformCount = 5;
    let platforms = [];
    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let score = 0;
    let highScore = 0;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    let upTimerId;
    let downTimerId;
    let platformIntervalId;


class Platform {
    // Constructor for the Platform class
    constructor(newPlatBottom) {
        this.left = Math.random() * 315; // Randomly set the left position of the platform within the grid

        this.bottom = newPlatBottom;  // Set the initial bottom position of the platform based on the parameter

        this.visual = document.createElement('div'); // Create a new div element to represent the platform visually

        const visual = this.visual;  // Reference to the created div element
        visual.classList.add('platform');

        // Set the initial left and bottom positions of the visual representation
        visual.style.left = this.left + 'px';
        visual.style.bottom = this.bottom + 'px';

        grid.appendChild(visual);
    }
}

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platGap = 600 / platformCount;  // Calculate the gap between each platform
            let newPlatBottom = 100 + i * platGap; // New position
            let newPlatform = new Platform(newPlatBottom); // Create a new Platform instance with the calculated bottom position
            grid.appendChild(newPlatform.visual); 
            platforms.push(newPlatform);
        }
    }

    function movePlatforms() {
          // Check if the cat is above a certain threshold (100) before moving platforms
        if (doodlerBottomSpace > 100) {
            platforms.forEach(platform => {
                platform.bottom -= 4; // move the platform
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                 // Check if the platform has moved above a certain threshold
                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform'); //first platform
                    platforms.shift();
                    score++; // Increase the player's score
                    let newPlatform = new Platform(600);  // Create a new platform at the bottom to replace the removed one
                    platforms.push(newPlatform);
                }
            });
        }
    }

    function createDoodler() {
        doodler.classList.add('doodler');
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
        grid.appendChild(doodler);
    }
    

    function fall() {
        isJumping = false;
        clearTimeout(upTimerId);   // Clear the upTimerId to stop the upward movement
        downTimerId = setInterval(() => {  // Make the cat fall continuously
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px'; //adds it
            if (doodlerBottomSpace <= 0) {   // Check if the cat has reached the bottom of the grid
                gameOver();
            }

            // Check for collisions with platforms

            platforms.forEach(platform => {
                if (
                    doodlerBottomSpace >= platform.bottom &&
                    doodlerBottomSpace <= (platform.bottom + 15) &&
                    (doodlerLeftSpace + 60) >= platform.left &&
                    doodlerLeftSpace <= (platform.left + 85) &&
                    !isJumping
                ) {
                     // If there is a collision, set the startPoint and initiate a jump
                    startPoint = doodlerBottomSpace;
                    jump();
                    isJumping = true;
                }
            });
        }, 20);
    }

    function jump() {
          // Clear the downTimerId to stop the downward movement
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(() => {
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
             // Check if the cat has reached the peak of the jump
            if (doodlerBottomSpace > startPoint + 200) {
                fall();
                isJumping = false;
            }
        }, 30);
    }

    function moveleft() {
        if (isGoingRight) {
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        clearInterval(leftTimerId);
        isGoingLeft = true;
        leftTimerId = setInterval(() => { // Set up the leftTimerId to move the cat left continuously
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 4;
                doodler.style.left = doodlerLeftSpace + 'px';
            }
        }, 20);
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        clearInterval(rightTimerId);
        isGoingRight = true;
        rightTimerId = setInterval(() => {   
            if (doodlerLeftSpace <= 313) {   // Check if the cat is still within the right boundary
                doodlerLeftSpace += 4;
                doodler.style.left = doodlerLeftSpace + 'px';
            }
        }, 20);
    }

    function moveStraight() {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function control(e) {
        doodler.style.bottom = doodlerBottomSpace + 'px';

        // Check the pressed key code
        if (e.keyCode === 37) { // If left arrow key is pressed, initiate left movement
            moveleft();
        } else if (e.keyCode === 39) { 
            moveRight();
        } else if (e.key === 'ArrowUp') {   
            moveStraight();
        }
        
    }
    
    document.addEventListener('keydown', (e) => {
        if (isGameStarted && !isGameOver) {
            control(e);
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (isGameStarted && !isGameOver) {
              // If left or right arrow key is released, stop horizontal movement (move straight).This is for when you hold the keys.
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                moveStraight();
            }
        }
    });;

    function updateHighScore() {
        currentScoreDisplay.textContent = 'Score: ' + score;
        highScoreDisplay.textContent =  highScore;
        
    }

    function handleGameOver() {
        isGameOver = true;
        updateHighScore(); // Call the updateHighScore function to update score displays
        startButton.style.display = 'block'; // Display the start button
        if (score > highScore) { // Check if the current score is greater than the high score
            highScore = score;
            highScoreDisplay.textContent = 'High Score: ' + highScore;
        }
    }

    function gameOver() {
        while (grid.firstChild) { // Remove all child elements from the grid
            grid.removeChild(grid.firstChild);
        }
        handleGameOver();
    }

    function startGame() {
        if (!isGameOver && !isGameStarted) {
            createPlatforms();
            createDoodler();
    
            // Set intervals only if they are not already set
            if (!isGoingLeft) {
                leftTimerId = setInterval(moveleft, 20);
            }
    
            if (!isGoingRight) {
                rightTimerId = setInterval(moveRight, 20);
            }
    
            // Set interval to move platforms continuously only if it's not already set
            if (!platformIntervalId) {
                platformIntervalId = setInterval(movePlatforms, 30);
            }
    
            // Set interval to update high score continuously
            upTimerId = setInterval(() => {
                updateHighScore();
            }, 30);
    
            jump();

            document.addEventListener('keyup', control);
            isGameStarted = true; 
            startButton.style.display = 'none';  // Hide the start button after the game starts
        }
    }
    startButton.addEventListener('click', () => {
        resetGame(); // Reset the game state
        startGame(); // Start the game
    });

    function resetGame() {
        // Clear existing intervals
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        clearInterval(upTimerId);

        // Reset game state variables
        isGameOver = false;
        isGameStarted = false;
        platformCount = 5;
        platforms = [];
        doodlerLeftSpace = 50;
        startPoint = 150;
        doodlerBottomSpace = startPoint;
        score = 0;
        isJumping = true;
        isGoingLeft = false;
        isGoingRight = false;

         // Remove all child elements from the grid
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }

        highScoreDisplay.textContent = 'High Score: ' + highScore;
        currentScoreDisplay.textContent = 'Score: ' + score;
    }

    // Initialize the game with a start button
    startButton.style.display = 'block';

    const audio = document.getElementById('miAudio');  
    audio.volume = 0.3; 

});

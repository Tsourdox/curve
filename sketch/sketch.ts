let snakes: Snake[];
let isRunning: boolean;
let backgroundColor: p5.Color;
let sound: p5.SoundFile;

function preload() {
    sound = (window as any).loadSound('../assets/mystic_drums.wav');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(50);
    noCursor();
    fullscreen();
    playMusic();

    createSnakes();
    isRunning = false;
    backgroundColor = color(20);
}

function playMusic() {
    sound.setLoop(true);
    sound.setVolume(0);
    sound.play();
    sound.setVolume(0.1, 0.5);
}

function pauseMusic() {
    sound.setVolume(0, 0.5);
    sound.pause(0.5)
}

function createSnakes() {
    snakes = [
        new Snake('Olivia', 'yellow', {
            left: LEFT_ARROW,
            right: RIGHT_ARROW
        }),
        new Snake('David', 'red', {
            left: KEY_A,
            right: KEY_D
        })
    ];
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    if (keyCode == SPACE) {
        isRunning = !isRunning;
    } else if (keyCode == ESC) {
        createSnakes();
        isRunning = false;
    } else if (keyCode == ENTER) {
        if (sound.isPlaying()) {
            pauseMusic();
        } else {
            playMusic();
        }
    }
    return false;
}

function draw() {
    background(backgroundColor);
    if (isRunning) {
        for (const snake of snakes) {
            snake.update();
        }
    }

    checkCollision();

    for (const snake of snakes) {
        snake.draw();
    }
}

function checkCollision() {
    for (const snake of snakes) {
        for (const snake_2 of snakes) {
            if (snake.id == snake_2.id) {
                continue;
            }

            // optimize check by not calulating near by sections when far away
            for (const bodySection of snake_2.body) {
                const dx = snake.head.x - bodySection.x
                const dy = snake.head.y - bodySection.y
                const distance = sqrt(dx * dx + dy * dy)

                const snakesRadius = (snake.thickness / 2) + (snake_2.thickness / 2)
                if (distance < snakesRadius) {
                    snake.isAlive = false
                }
            }
        }
    }
}
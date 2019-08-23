let snakes: Snake[];
let isRunning: boolean;

function setup() {
    createCanvas(windowWidth, windowHeight);
    createSnakes();
    isRunning = false;
}

function createSnakes() {
    snakes = [
        new Snake('Olivia', 'yellow', {
            left: LEFT_ARROW,
            right: RIGHT_ARROW
        }),
        new Snake('David', 'red', {
            left: 65,
            right: 68
        })
    ];
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    if (keyCode == 32) { // Space
        isRunning = !isRunning;
    } else if (keyCode == 27) { // Esc
        createSnakes();
        isRunning = false;
    }
    return false;
}

function draw() {
    background(20);
    if (isRunning) {
        for (const snake of snakes) {
            snake.update();
        }
    }

    for (const snake of snakes) {
        snake.draw();
    }
}
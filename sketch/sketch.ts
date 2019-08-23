let morph: Morph;

function setup() {
    createCanvas(windowWidth, windowHeight)
    morph = new Morph();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(100);
    morph.draw();
}
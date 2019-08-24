let snakes: Snake[]
let holes: Hole[]
let isRunning: boolean
let backgroundColor: p5.Color
let menuSound: p5.SoundFile
let music: Music
let musicFiles: MusicFiles
let time: number

function preload() {
    console.log('preload')
    const { loadSound: loadMusic } = (window as any) // todo fix typings for p5.sound
    musicFiles = {
        menuMusic: loadMusic('../assets/music/mystic_drums.wav'),
        gameMusic: loadMusic('../assets/music/evolution.mp3')
    }
}

function setup() {
    console.log('setup')
    createCanvas(windowWidth, windowHeight)
    frameRate(90)
    noCursor()
    fullscreen()
    music = new Music(musicFiles)
    music.playMenuMusic()

    createSnakes()
    createHoles()
    isRunning = false
    backgroundColor = color(20)
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
    ]
}

function createHoles() {
    holes = [
        new Hole(), new Hole(), new Hole(),
        new Hole(), new Hole(), new Hole(),
        new Hole(), new Hole(), new Hole(),
        new Hole(), new Hole(), new Hole()
    ]
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}

function keyPressed() {
    if (keyCode == SPACE) {
        isRunning = !isRunning
        if (isRunning) {
            music.playGameMusic()
        } else {
            music.playMenuMusic()
        }
    }

    if (keyCode == ESC) {
        createSnakes()
        createHoles()
        isRunning = false
        music.playMenuMusic()
    }

    if (keyCode == ENTER) {
        if (music.isPlaying()) {
            music.pauseMusic()
        } else {
            music.playMusic()
        }
    }
    return false
}

function draw() {
    background(backgroundColor)
    if (isRunning) {
        for (const snake of snakes) {
            snake.update()
        }
        for (const hole of holes) {
            hole.update()
        }
    }

    checkCollision()

    for (const snake of snakes) {
        snake.draw()
    }
    for (const hole of holes) {
        hole.draw()
    }
}

function checkCollision() {
    for (const snake of snakes) {
        for (const snake_2 of snakes) {
            if (snake.id == snake_2.id) {
                continue
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
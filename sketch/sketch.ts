let snakes: Snake[]
let holes: Hole[]
let isGameRunning: boolean
let backgroundColor: p5.Color
let menuSound: p5.SoundFile
let music: Music
let musicFiles: MusicFiles
let gameSounds: GameSounds
let time: number

function preload() {
    console.log('preload')

    const { loadSound } = (window as any) // todo fix typings for p5.sound
    musicFiles = {
        menu: loadSound('../assets/music/mystic_drums.wav'),
        game: loadSound('../assets/music/evolution.mp3')
    }
    gameSounds = {
        end: loadSound('../assets/sounds/end.wav')
    }
}

function setup() {
    console.log('setup')

    // Settings
    createCanvas(windowWidth, windowHeight)
    frameRate(60)
    noCursor()

    // Background
    backgroundColor = color(20)

    // Music
    music = new Music(musicFiles)
    music.playMenuMusic()

    // Sounds
    gameSounds.end.setVolume(1)

    // Game
    createSnakes()
    createHoles()
    isGameRunning = false
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
        }),
        new Snake('Manooni', 'blue', {
            left: KEY_H,
            right: KEY_J
        })
    ]
}

function createHoles() {
    holes = [
        new Hole(), new Hole(), new Hole(),
        new Hole(), new Hole(), new Hole(),
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
        isGameRunning = !isGameRunning
        if (isGameRunning) {
            music.playGameMusic()
        } else {
            music.playMenuMusic()
        }
    }

    if (keyCode == ESC) {
        createSnakes()
        createHoles()
        isGameRunning = false
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

    if (isGameRunning) {
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
        if (!snake.isAlive) {
            continue
        }

        // Check wall
        const { x, y } = snake.head
        if (x <= 0 || x >= width || y <= 0 || y >= height) {
            snake.isAlive = false
            gameSounds.end.play()
        }

        // Check other snakes
        for (const snake_2 of snakes) {
            if (snake.id == snake_2.id) {
                continue
            }

            // optimize check by not calulating near by sections when far away
            for (const bodySection of snake_2.body) {
                if (isCollision(snake.head, bodySection, snake.thickness, snake_2.thickness)) {
                    snake.isAlive = false
                    gameSounds.end.play()
                }
            }
        }

        // Check holes
        for (const hole of holes) {
            if (isCollision(snake.head, hole.position, snake.thickness, hole.radius)) {
                snake.isAlive = false
                gameSounds.end.play()
            }
        }
    }
}

function isCollision(a: Point, b: Point, aRadius: number, bRadius: number): boolean {
    const dx = a.x - b.x
    const dy = a.y - b.y
    const distance = sqrt(dx * dx + dy * dy)
    const collisionDistance = (aRadius / 2) + (bRadius / 2)
    return distance < collisionDistance
}
let backgroundColor: p5.Color
let music: Music
let musicFiles: MusicFiles
let gameSounds: GameSounds
let game: Game
let menu: Menu

function preload() {
    console.log('preload')

    const { loadSound } = (window as any) // todo fix typings for p5.sound
    musicFiles = {
        menu: loadSound('../assets/music/mystic_drums.wav'),
        game: loadSound('../assets/music/birthofahero.mp3')
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

    // Game & Menu
    menu = new Menu()
    game = new Game()
}

function draw() {
    background(backgroundColor)

    game.update()
    game.draw()
    menu.draw()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}

function keyPressed() {
    if (menu.isSetup) {
        // GAME SETUP
        if (keyCode >= KEY_1 && keyCode <= KEY_9) {
            game.reset()
            game.createSnakes(keyCode - 48)
            menu.isSetup = false
        }
    } else if (game.isPaused) {
        // PAUSED GAME
        if (keyCode == ESC) {
            game.reset()
            menu.isSetup = true
        } else if (keyCode == ENTER) {
            game.restart()
        }
        if (keyCode == SPACE) {
            game.resume()
        }
    } else {
        // GAME IS RUNNING
        if (keyCode == SPACE) {
            game.pause()
        }

    }

    return false
}
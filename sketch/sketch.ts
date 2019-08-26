let backgroundColor: p5.Color
let music: Music
let musicFiles: MusicFiles
let gameSounds: GameSounds
let game: Game
let menu: Menu
let mouse: Mouse

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
    frameRate(120)
    noCursor()
    backgroundColor = color(20)
    gameSounds.end.setVolume(1)

    // Create Game Instances
    music = new Music(musicFiles)
    menu = new Menu()
    game = new Game()
    mouse = new Mouse()

    // Start music on user action
    ;(window as any).userStartAudio().then(() => music.playMenuMusic())
}

function draw() {
    background(backgroundColor)

    game.update()
    game.draw()
    menu.draw()
    mouse.draw()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}

function keyPressed() {
    // Prevent error when reloading with keyboard shotcut
    if (!music || !menu || !game) {
        return
    }

    if (menu.setupStep == 'start') {
        // GAME START
        if (keyCode == SPACE) {
            menu.setupStep = 'number-of-players'
        }
    } else if (menu.isSetup) {
        // GAME SETUP
        if (keyCode >= KEY_1 && keyCode <= KEY_9) {
            game.reset()
            game.createSnakes(keyCode - 48)
            menu.setupStep = 'done'
        }
    } else if (game.isPaused) {
        // PAUSED GAME
        if (keyCode == ESC) {
            game.reset()
            menu.setupStep = 'number-of-players'
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
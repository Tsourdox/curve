let backgroundColor: p5.Color
let music: Music
let musicFiles: MusicFiles
let gameSounds: GameSounds
let game: Game
let menu: Menu
let mouse: Mouse
let backgroundImage: p5.Image

function preload() {
    console.log('preload')
    const { loadSound } = (window as any) // todo fix typings for p5.sound

    musicFiles = {
        menu: loadSound('../assets/music/mystic_drums.wav'),
        game: loadSound('../assets/music/birthofahero.mp3')
    }
    gameSounds = {
        died: loadSound('../assets/sounds/end.wav'),
        freeze: loadSound('../assets/sounds/freeze.wav'),
        teleport: loadSound('../assets/sounds/teleport.wav'),
        disappear: loadSound('../assets/sounds/disappear.wav'),
        burn: loadSound('../assets/sounds/burn.wav'),
        rebirth: loadSound('../assets/sounds/rebirth.wav'),
        shrink: loadSound('../assets/sounds/shrink.wav'),
        ghost: loadSound('../assets/sounds/ghost.wav')
    }
    backgroundImage = loadImage('../assets/images/hubble_photo.jpg');
}

function setup() {
    console.log('setup')

    // Settings
    createCanvas(windowWidth, windowHeight)
    frameRate(120)
    noCursor()
    backgroundColor = color(20)

    gameSounds.died.setVolume(0.5)
    gameSounds.freeze.setVolume(1)
    gameSounds.teleport.setVolume(1)
    gameSounds.disappear.setVolume(0.5)
    gameSounds.burn.setVolume(0.5)
    gameSounds.rebirth.setVolume(0.5)
    gameSounds.shrink.setVolume(0.7)

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
    // Possible background
    /*
        image(backgroundImage, 0, 0, width, height)
        background(color('rgba(0,0,0,0.9)'))
    */

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

    if (menu.isSetup) {
        // GAME SETUP
        switch (menu.setupStep) {
            case 'start': {
                if (keyCode == SPACE) {
                    menu.setupStep = 'snake-selection'
                    game.restart()
                }
                break
            }
            case 'snake-selection': {
                if (keyCode == SPACE || keyCode == ENTER) {
                    if (menu.selectedSnakes.length > 0) {
                        menu.setupStep = 'done'
                        game.restart(menu.selectedSnakes)
                    }
                }
                break
            }
        }
    } else if (game.isPaused) {
        // PAUSED GAME
        if (keyCode == ESC) {
            game.reset()
            menu.setupStep = 'snake-selection'
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
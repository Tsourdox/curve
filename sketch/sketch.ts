let backgroundColor: p5.Color
let menuSound: p5.SoundFile
let music: Music
let musicFiles: MusicFiles
let gameSounds: GameSounds
let game: Game
let time: number

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

    // Game
    game = new Game()

}

function draw() {
    background(backgroundColor)
    game.update();
    game.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}

function keyPressed() {
    if (keyCode == SPACE) {
        game.isRunning = !game.isRunning
        if (game.isRunning) {
            music.playGameMusic()
        } else {
            music.playMenuMusic()
        }
    }

    if (keyCode == ESC) {
        game.resetGame()
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
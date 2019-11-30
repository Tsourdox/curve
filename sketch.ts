let backgroundColor: p5.Color
let musicFiles: MusicFiles
let gameSounds: GameSounds
let snakes: Snakes
let music: Music
let game: Game
let menu: Menu
let mouse: Mouse
let scoreboard: ScoreBoard

function preload() {
    const { loadSound } = (window as any) // todo fix typings for p5.sound

    musicFiles = {
        menu: loadSound('./assets/music/mystic_drums.wav'),
        game: loadSound('./assets/music/birthofahero.mp3')
    }
    gameSounds = {
        died: loadSound('./assets/sounds/end.wav'),
        freeze: loadSound('./assets/sounds/freeze.wav'),
        unfreeze: loadSound('./assets/sounds/unfreeze.wav'),
        teleport: loadSound('./assets/sounds/teleport.wav'),
        disappear: loadSound('./assets/sounds/disappear.wav'),
        burn: loadSound('./assets/sounds/burn.wav'),
        rebirth: loadSound('./assets/sounds/rebirth.wav'),
        shrink: loadSound('./assets/sounds/shrink.wav'),
        ghost: loadSound('./assets/sounds/ghost.wav'),
        warning: loadSound('./assets/sounds/warning.wav')
    }
}

function setup() {
    // Canvas settings
    createCanvas(windowWidth, windowHeight)
    frameRate(60)
    noCursor()
    backgroundColor = color(20)

    gameSounds.died.setVolume(0.4)
    gameSounds.freeze.setVolume(1)
    gameSounds.unfreeze.setVolume(0.3)
    gameSounds.teleport.setVolume(1)
    gameSounds.disappear.setVolume(0.5)
    gameSounds.burn.setVolume(0.5)
    gameSounds.rebirth.setVolume(0.5)
    gameSounds.shrink.setVolume(0.7)
    gameSounds.warning.setVolume(0.8)

    // Create Game Instances
    scoreboard = new ScoreBoard()
    snakes = new Snakes()
    music = new Music(musicFiles)
    game = new Game([])
    menu = new Menu()
    mouse = new Mouse()

    // Start music on user action
    ;(window as any).userStartAudio().then(() => music.userStartAudio())
}

function draw() {
    background(backgroundColor)
    game.update()
    game.draw()
    menu.draw()
    mouse.draw()
}
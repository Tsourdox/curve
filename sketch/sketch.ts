let backgroundColor: p5.Color
let music: Music
let musicFiles: MusicFiles
let gameSounds: GameSounds
let game: Game
let snakes: Snakes
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

    /* Init highscore variable */
    if (!localStorage.getItem('highScore')) {
        localStorage.highScore = '0'
    }

    // Canvas settings
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
    game = new Game([])
    snakes = new Snakes()
    menu = new Menu()
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
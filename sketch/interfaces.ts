interface Point {
    x: number
    y: number
}

interface Controls {
    left: number
    right: number
    special?: number
}

interface GameSounds {
    snakeReset: p5.SoundFile
    freeze: p5.SoundFile
    teleport: p5.SoundFile
    holeDisappeared: p5.SoundFile
}
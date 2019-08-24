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
    end: p5.SoundFile
}
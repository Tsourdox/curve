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
    died: p5.SoundFile
    freeze: p5.SoundFile
    teleport: p5.SoundFile
}
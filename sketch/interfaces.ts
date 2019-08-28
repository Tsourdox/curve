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
    disappear: p5.SoundFile
    burn: p5.SoundFile
}
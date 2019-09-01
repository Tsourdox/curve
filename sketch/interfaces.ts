interface Point {
    x: number
    y: number
}

interface Controls {
    left: number
    right: number
    special: number
    asString: string
}

interface GameSounds {
    died: p5.SoundFile
    freeze: p5.SoundFile
    teleport: p5.SoundFile
    disappear: p5.SoundFile
    burn: p5.SoundFile
    rebirth: p5.SoundFile
    shrink: p5.SoundFile
    ghost: p5.SoundFile
}
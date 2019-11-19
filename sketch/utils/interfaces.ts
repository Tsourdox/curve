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
    warning: p5.SoundFile
}

enum Fonts {
    Chilanka = 'Chilanka',
    Helvetica = 'Helvetica',
    Monoton = 'Monoton'
}

interface HoleEffect {
    type: HoleEffecType
    time: number
    delay: number
    duration?: number
}

type ParticleGenerator = (position: p5.Vector) => Particle[]

enum HoleEffecType {
    'teleport',
    'redirect',
    'freeze',
    'none'
}

interface SnakeInfo {
    name: string
    description: string
    ability: string
    abilityDescription: string
}
class BurnAbility extends Ability {
    private readonly duration: number
    private time: number
    private isActive: boolean
    private readonly baseIncrement: number
    private readonly particleSystemMaxCount: number
    private particleSystems: ParticleSystem[]
    private indexOfLastSystem: number
    private trimIndex: number

    constructor(coldown: number, duration: number) {
        super('Burn', coldown)
        this.time = 0
        this.duration = duration
        this.isActive = false
        this.particleSystems = []
        this.particleSystemMaxCount = 30
        this.indexOfLastSystem = 0
        this.baseIncrement = 30
        this.trimIndex = 1
    }

    protected applyEffect(snake: Snake): void {
        this.isActive = true
        gameSounds.burn.play()
        snake.effect = 'burning'
        snake.thickness *= 1.5

        const strechedIncrement = round(snake.bodyParts.length / this.particleSystemMaxCount)
        const increment = max(this.baseIncrement, strechedIncrement)

        for (let i = 0; i < snake.bodyParts.length; i+= increment) {
            this.addParticleSystem(snake.bodyParts[i], i)
        }
    }

    private newFireParticleSystem(position: Point) {
        const { x, y } = position
        const spawnRate = 0.8
        return new ParticleSystem(createVector(x, y), spawnRate, fireParticle)
    }

    private addParticleSystem(position: Point, index: number) {
        this.particleSystems.push(this.newFireParticleSystem(position))
        this.indexOfLastSystem = index
    }

    private trimParticleSystem() {
        if (this.trimIndex > this.indexOfLastSystem / 2) {
            this.trimIndex = 1
        }
        this.particleSystems.splice(this.trimIndex, 1)
        this.trimIndex += 2
    }

    private moveLastParticalSystemToHead(snake: Snake) {
        const { x, y } = snake.head
        const lastParticalSystem  = this.particleSystems[this.particleSystems.length - 1]
        lastParticalSystem.updateOrigin(createVector(x, y))
    }

    public update(snake: Snake) {
        super.update()
        if (this.isActive) {
            this.time += deltaTime * 0.001

            this.moveLastParticalSystemToHead(snake)

            if (snake.bodyParts.length - this.indexOfLastSystem > this.baseIncrement) {
                this.addParticleSystem(snake.head, snake.bodyParts.length)
                this.trimParticleSystem()
            }

            if (this.time > this.duration) {
                this.isActive = false
                this.time = 0
                snake.effect = 'none'
                snake.thickness /= 1.5
                this.particleSystems = []
            }
        }
    }

    public draw(snake: Snake) {
        super.draw(snake)

        if (this.isActive) {
            for (const particleSystem of this.particleSystems) {
                particleSystem.run()
            }
        }
    }
}
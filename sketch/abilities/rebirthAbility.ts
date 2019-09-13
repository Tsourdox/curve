class RebirthAbility extends DelayedAbility {
    private particleSystems: ParticleSystem[]

    constructor(cooldown: number) {
        super('Rebirth', cooldown, 1.5)
        this.particleSystems = []
    }

    protected applyEffect(): void {
        this.particleSystems = []
        gameSounds.rebirth.play()
    }

    public update(snake: Snake) {
        if (this.isActivated) {
            if (this.time > this.delay) {
                const deadSnake = this.findSnakeToRebirth(snake)
                if (deadSnake) {
                    this.initParticleEffect(deadSnake, true)
                    deadSnake.birth()
                } else {
                    this.initParticleEffect(snake)
                    this.shiftSelf(snake)
                }
            }
        }

        super.update(snake)
    }

    public draw(snake: Snake) {
        super.draw(snake)

        for (const particleSystem of this.particleSystems) {
            particleSystem.run()
        }
    }

    private findSnakeToRebirth(snake: Snake): Snake | undefined {
        let closestSnake: Snake | undefined
        let distanceToClosestSnake = Number.MAX_VALUE

        for (const deadSnake of game.deadSnakes) {
            const distanceToDeadSnake = distanceBetween(snake.head, deadSnake.head)
            if (distanceToDeadSnake < distanceToClosestSnake) {
                closestSnake = deadSnake
                distanceToClosestSnake = distanceToDeadSnake
            }
        }

        if (distanceToClosestSnake < s(500)) {
            return closestSnake
        }
    }

    private shiftSelf(snake: Snake) {
        let shiftLength = round(snake.bodyParts.length * 0.9)

        while (shiftLength > 0) {
            snake.body[0].shift()
            if (!snake.body[0].length) {
                snake.body.shift()
            }
            shiftLength--
        }
    }

    private initParticleEffect(snake: Snake, whole = false) {
        const shiftLength = round(snake.bodyParts.length * (whole ? 1 : 0.9))
        for (let i = 0; i < shiftLength; i+= 3) {
            this.addParticleSystem(snake.bodyParts[i])
        }
    }

    private addParticleSystem(position: Point) {
        const { x, y } = position
        const spawnRate = 0.01
        const lifespan = 0.03
        const glow = new ParticleSystem(createVector(x, y), spawnRate, glowParticle, lifespan, 0)
        this.particleSystems.push(glow)
    }
}
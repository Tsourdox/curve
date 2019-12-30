class RebirthAbility extends DelayedAbility {
    private particleSystems: ParticleSystem[]
    private readonly particleSystemMaxCount = 100

    constructor(cooldown: number) {
        super('Rebirth', cooldown, 1.5)
        this.particleSystems = []
    }

    protected applyEffect(snake: Snake): void {
        this.particleSystems = []
        gameSounds.rebirth.play()
        snake.effect = 'glowing'
    }

    public update(snake: Snake) {
        if (this.isActivated) {
            if (this.time > this.delay) {
                const snakeToBirth = this.findSnakeToRebirth(snake)
                if (snakeToBirth) {
                    if (snakeToBirth.isAlive) {
                        this.initParticleEffect(snakeToBirth)
                        this.shiftSnake(snakeToBirth)
                    } else {
                        this.initParticleEffect(snakeToBirth, true)
                        snakeToBirth.birth()
                    }
                    snakeToBirth.speed = snakeToBirth.defaultSpeed
                } else {
                    this.initParticleEffect(snake)
                    this.shiftSnake(snake)
                    snake.speed = snake.defaultSpeed
                }
                snake.effect = 'none'
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

        for (const snake2 of game.snakes) {
            if (snake === snake2 && snake.isAlive) {
                continue
            }

            const distanceToDeadSnake = distanceBetween(snake.head, snake2.head)
            if (distanceToDeadSnake < distanceToClosestSnake) {
                closestSnake = snake2
                distanceToClosestSnake = distanceToDeadSnake
            }
        }

        if (distanceToClosestSnake < s(400)) {
            return closestSnake
        }
    }

    private shiftSnake(snake: Snake) {
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
        const strechedIncrement = ceil(snake.bodyParts.length / this.particleSystemMaxCount)
        const increment = min(10, strechedIncrement)

        for (let i = 0; i < shiftLength; i+= increment) {
            this.addParticleSystem(snake.bodyParts[i])
        }
    }

    private addParticleSystem(position: Point) {
        const { x, y } = position
        const spawnRate = 0.1
        const lifespan = 0.1
        const glow = new ParticleSystem(createVector(x, y), spawnRate, glowParticle, lifespan, 0)
        this.particleSystems.push(glow)
    }
}
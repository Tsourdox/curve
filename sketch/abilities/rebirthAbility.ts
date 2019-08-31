class RebirthAbility extends Ability {
    private readonly delay: number
    private time: number
    private isActive: boolean
    private snakeToRebirth?: Snake

    constructor(cooldown: number) {
        super('Rebirth', cooldown)
        this.time = 0
        this.delay = 1.5
        this.isActive = false
    }

    protected applyEffect(snake: Snake): void {
        this.isActive = true
        this.pauseCooldown = true
        gameSounds.rebirth.play()
    }

    public update(snake: Snake) {
        super.update(snake)

        if (this.isActive) {
            this.time += deltaTime * 0.001

            if (this.time > this.delay) {
                const deadSnake = this.findSnakeToRebirth(snake)
                if (deadSnake) {
                    this.rebirth(deadSnake)
                } else {
                    this.shrinkSelf(snake)
                }
            }

            if (this.time !== 0) {
                snake.drawHead(1 + (this.time * this.time * this.time) / 2)
            }
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

        if (distanceToClosestSnake < s(300)) {
            return closestSnake
        }
    }

    private rebirth(deadSnake: Snake) {
        deadSnake.birth()
        this.reset()
    }

    private shrinkSelf(snake: Snake) {
        let shrinkLength = round(snake.bodyParts.length * 0.75)
        snake.body[0] = snake.bodyParts.slice(shrinkLength, snake.bodyParts.length)
        this.reset()
    }

    private reset() {
        delete this.snakeToRebirth
        this.isActive = false
        this.pauseCooldown = false
        this.time = 0
    }
}
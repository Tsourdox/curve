class RebirthAbility extends DelayedAbility {

    constructor(cooldown: number) {
        super('Rebirth', cooldown, 1.5)
    }

    protected applyEffect(): void {
        gameSounds.rebirth.play()
    }

    public update(snake: Snake) {
        if (this.isActivated) {
            if (this.time > this.delay) {
                const deadSnake = this.findSnakeToRebirth(snake)
                if (deadSnake) {
                    deadSnake.birth()
                } else {
                    this.shrinkSelf(snake)
                }
            }
        }

        super.update(snake)
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

    private shrinkSelf(snake: Snake) {
        let shrinkLength = round(snake.bodyParts.length * 0.8)
        snake.body[0] = snake.bodyParts.slice(shrinkLength, snake.bodyParts.length)
    }
}
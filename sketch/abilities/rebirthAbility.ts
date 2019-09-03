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

        if (distanceToClosestSnake < s(500)) {
            return closestSnake
        }
    }

    private shrinkSelf(snake: Snake) {
        let shrinkLength = round(snake.bodyParts.length * 0.8)

        while (shrinkLength > 0) {
            snake.body[0].shift()
            if (!snake.body[0].length) {
                snake.body.shift()
            }
            shrinkLength--
        }
    }
}
class TeleportAbility extends Ability {

    constructor(cooldown: number) {
        super('Teleport', cooldown)
    }

    protected applyEffect(snake: Snake): void {
        const { x, y } = snake.head
        const newLocation = {
            x: modulo((x + cos(snake.direction) * s(100)), width),
            y: modulo((y + sin(snake.direction) * s(100)), height)
        }

        game.removeHoleContaining(newLocation, false, true)
        gameSounds.teleport.play()

        if (snake.bodySection.length == 1) {
            snake.body.pop()
        }
        snake.body.push([newLocation])
    }
}
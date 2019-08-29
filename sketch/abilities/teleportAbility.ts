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

        snake.body.push([newLocation])
        delete snake.nextBodyPart
    }
}
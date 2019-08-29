class TeleportAbility extends Ability {

    constructor(cooldown: number) {
        super('Teleport', cooldown)
    }

    protected applyEffect(snake: Snake): void {
        const { x, y } = snake.head
        const newLocation = {
            x: x + cos(snake.direction) * 100,
            y: y + sin(snake.direction) * 100
        }

        game.removeHoleContaining(newLocation, false, true)
        gameSounds.teleport.play()

        snake.body.push([newLocation])
        delete snake.nextBodyPart
    }
}
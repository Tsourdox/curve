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
        snake.body.push([newLocation])

        gameSounds.teleport.play()
    }
}
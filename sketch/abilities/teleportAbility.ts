class TeleportAbility extends Ability {
    private particleSystem?: ParticleSystem

    constructor(cooldown: number) {
        super('Teleport', cooldown)
    }

    protected applyEffect(snake: Snake): void {
        const { x, y } = snake.head
        const newLocation = {
            x: modulo((x + cos(snake.direction) * s(100)), width),
            y: modulo((y + sin(snake.direction) * s(100)), height)
        }

        game.removeHoleContaining(newLocation, false, true, s(100))
        gameSounds.teleport.play()

        if (snake.bodySection.length == 1) {
            snake.body.pop()
        }
        snake.body.push([newLocation])

        const origin = createVector(newLocation.x, newLocation.y)
        this.particleSystem = new ParticleSystem(origin, 0.00001, teleportParticle, 0.01)
    }

    public draw(snake: Snake, thickness?: number) {
        super.draw(snake, thickness)

        if (this.particleSystem) {
            this.particleSystem.run()
        }
    }
}
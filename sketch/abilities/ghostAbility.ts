class GhostAbility extends Ability {
    private readonly duration: number
    private time: number
    private isActive: boolean

    constructor(coldown: number, duration: number) {
        super('Ghost', coldown)
        this.time = 0
        this.duration = duration
        this.isActive = false
    }

    protected applyEffect(snake: Snake): void {
        this.isActive = true
        gameSounds.ghost.play()
        snake.effect = 'ghost'
        const snakeHead = snake.head
        snake.body.push([snakeHead])
    }

    update(snake: Snake) {
        super.update()
        if (this.isActive) {
            this.time += deltaTime * 0.001
            if (this.time > this.duration) {
                this.isActive = false
                this.time = 0
                snake.effect = 'none'
            }

            snake.bodySection.shift()
        }
    }
}
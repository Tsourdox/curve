class BurnAbility extends Ability {
    private readonly duration: number
    private time: number
    private isActive: boolean

    constructor(coldown: number, duration: number) {
        super('Burn', coldown)
        this.time = 0
        this.duration = duration
        this.isActive = false
    }

    protected applyEffect(snake: Snake): void {
        this.isActive = true
        gameSounds.burn.play()
        snake.isBurning = true
        snake.thickness *= 1.5
    }

    update(snake: Snake) {
        super.update()
        if (this.isActive) {
            this.time += deltaTime * 0.001
            if (this.time > this.duration) {
                this.isActive = false
                this.time = 0
                snake.isBurning = false
                snake.thickness /= 1.5
            }
        }
    }
}
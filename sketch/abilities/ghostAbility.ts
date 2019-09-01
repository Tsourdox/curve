class GhostAbility extends Ability {
    private readonly duration: number
    private time: number
    private isActive: boolean
    private isPassive: boolean

    constructor(coldown: number, duration: number) {
        super('Ghost', coldown)
        this.time = 0
        this.duration = duration
        this.isActive = false
        this.isPassive = false
    }

    protected applyEffect(snake: Snake, passive?: boolean): void {
        if (!this.isActive && !this.isPassive) {
            // Poor Sir Nicholas - headless once again ^^
            if (snake.bodySection.length > 1) {
                const snakeHead = snake.bodyParts.pop()
                snakeHead && snake.body.push([snakeHead])
            }
            snake.effect = 'ghost'
            snake.isInsideHoles = {}
            gameSounds.ghost.play()
        }

        if (passive) {
            this.isPassive = true
        } else {
            this.isActive = true
        }
    }

    public enterPassiveGhostForm(snake: Snake) {
        if (!this.isPassive) {
            this.applyEffect(snake, true)
        }
    }

    public leavePassiveGhostForm(snake: Snake) {
        if (this.isPassive) {
            this.isPassive = false

            if (!this.isActive) {
                snake.effect = 'none'
            }
        }
    }

    public update(snake: Snake) {
        super.update()

        if (this.isActive) {
            this.time += deltaTime * 0.001
            if (this.time > this.duration) {
                this.isActive = false
                this.time = 0
                if (!this.isPassive) {
                    snake.effect = 'none'
                }
            }

            this.shift(snake)
        } else if (this.isPassive) {
            this.shift(snake)
        }
    }

    private shift(snake: Snake) {
        if (snake.isAlive) {
            snake.bodySection.shift()
        }
    }
}
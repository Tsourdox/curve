abstract class DelayedAbility extends Ability {
    protected readonly delay: number
    protected time: number
    protected isActivated: boolean

    constructor(name: string, cooldown: number, delay: number) {
        super(name, cooldown)
        this.delay = delay
        this.time = 0
        this.isActivated = false
    }

    public use(snake: Snake): void {
        if (!this.isActivated) {
            this.isActivated = !!super.use(snake)
        }
    }

    public update(snake?: Snake) {
        if (this.isActivated) {
            if (this.time > this.delay) {
                this.isActivated = false
                this.time = 0
            }

            this.time += deltaTime * 0.001
        } else {
            super.update(snake)
        }
    }

    public draw(snake: Snake) {
        const thickness = snake.thickness + (snake.isAlive ? 1 * pow(this.time, 3) : 0)
        super.draw(snake, thickness)
    }
}
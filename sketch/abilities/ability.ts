abstract class Ability {
    public readonly name: string
    private readonly cooldown: number
    private timeToActivation: number

    private get isReady() {
        return !this.timeToActivation
    }

    constructor(name: string, cooldown: number) {
        this.name = name
        this.cooldown = cooldown
        this.timeToActivation = 0
    }

    protected abstract applyEffect(snake: Snake): void

    public use(snake: Snake): boolean | void {
        if (this.isReady) {
            this.timeToActivation = this.cooldown
            this.applyEffect(snake)
            return true
        }
    }

    public update(snake?: Snake) {
        if (this.timeToActivation > 0) {
            const newTime = this.timeToActivation - deltaTime * 0.001
            this.timeToActivation = Math.max(0, newTime)
        }
    }

    public draw(snake: Snake, thickness?: number) {
        this.drawCooldownCircle(snake, thickness)
    }

    private drawCooldownCircle(snake: Snake, thickness?: number) {
        noFill()
        strokeWeight(snake.thickness * 0.5)
        stroke(snake.activeColor)

        const { x, y } = snake.head
        const d = (thickness || snake.thickness) * 4
        const startAngle = -HALF_PI
        const endAngle = startAngle + (TWO_PI * (this.cooldown - this.timeToActivation) / this.cooldown)
        arc(x, y, d, d, startAngle, endAngle);
    }
}
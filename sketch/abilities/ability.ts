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

    public draw(x: number, y: number, color: p5.Color, thickness: number, diameter?: number) {
        this.drawCooldownCircle(x, y, color, thickness, diameter)
    }

    private drawCooldownCircle(x: number, y: number, color: p5.Color, thickness: number, diameter?: number) {
        noFill()
        stroke(color)
        strokeWeight(thickness * 0.5)

        const d = (diameter || thickness) * 4
        const startAngle = -HALF_PI
        const endAngle = startAngle + (TWO_PI * (this.cooldown - this.timeToActivation) / this.cooldown)
        arc(x, y, d, d, startAngle, endAngle);
    }
}
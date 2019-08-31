abstract class Ability {
    public readonly name: string
    private readonly cooldown: number
    private timeToActivation: number
    protected pauseCooldown: boolean

    private get isReady() {
        return !this.timeToActivation
    }

    constructor(name: string, cooldown: number) {
        this.name = name
        this.cooldown = cooldown
        this.timeToActivation = 0
        this.pauseCooldown = false
    }

    protected abstract applyEffect(snake: Snake): void

    public use(snake: Snake) {
        if (this.isReady) {
            this.timeToActivation = this.cooldown
            this.applyEffect(snake)
        }
    }

    public update(snake?: Snake) {
        if (this.timeToActivation > 0) {
            if (this.pauseCooldown && this.timeToActivation !== this.cooldown) {
                return
            }

            this.timeToActivation = Math.max(0, this.timeToActivation - deltaTime * 0.001)
        }
    }

    public draw(x: number, y: number, color: p5.Color, thickness: number) {
        this.drawCooldownCircle(x, y, color, thickness)
    }

    private drawCooldownCircle(x: number, y: number, color: p5.Color, thickness: number) {
        if (this.pauseCooldown) {
            return
        }

        noFill()
        stroke(color)
        strokeWeight(thickness * 0.5)

        const diameter = thickness * 4
        const startAngle = -HALF_PI
        const endAngle = startAngle + (TWO_PI * (this.cooldown - this.timeToActivation) / this.cooldown)
        arc(x, y, diameter, diameter, startAngle, endAngle);
    }
}
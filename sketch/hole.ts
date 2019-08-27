class Hole extends GameObject {
    private readonly baseRadius: number
    private readonly morphLimit: number
    private morphSpeed: number
    private morphValue: number
    private color: p5.Color
    private colorFrozened: p5.Color
    private isIncreasing: boolean
    public position: Point

    constructor() {
        super()
        this.color = color(random(30, 100), random(30, 100), random(30, 100))
        this.colorFrozened = color(random(40), random(40), random(80, 120))
        this.baseRadius = random(20, 150)
        this.morphLimit = random(10,100)
        this.morphSpeed = random(0.1, 1)
        this.morphValue = this.baseRadius * -1
        this.isIncreasing = true
        this.position = {
            x: random(width),
            y: random(height)
        }
    }

    public get radius() {
        return this.baseRadius + this.morphValue
    }

    public update() {
        this.updateMorphValue()
    }

    public draw(isFrozen?: boolean) {
        const { x, y } = this.position
        noStroke()
        fill(isFrozen ? this.colorFrozened : this.color)
        circle(x, y, this.radius)
    }

    private updateMorphValue() {
        if (this.isIncreasing) {
            this.morphValue += this.morphSpeed
            if (this.morphValue > this.morphLimit) {
                this.isIncreasing = false
            }
        } else {
            this.morphValue -= this.morphSpeed
            if (this.morphValue < 0) {
                this.isIncreasing = true
            }
        }
    }
}
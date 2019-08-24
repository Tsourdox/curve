class Hole {
    private readonly radius: number
    private readonly morphLimit: number
    private morphSpeed: number
    private morphValue: number
    private position: Point
    private color: p5.Color
    private isIncreasing: boolean
    private maxDuration: number
    private duration: number

    constructor() {
        this.color = color(random(30, 100), random(30, 100), random(30, 100))
        this.radius = random(20, 150)
        this.morphLimit = random(10,100)
        this.morphSpeed = random(0.1, 1)
        this.morphValue = this.radius * -1
        this.isIncreasing = true
        this.maxDuration = random(5, 30)
        this.duration = 0
        this.position = {
            x: random(width),
            y: random(height)
        }
    }

    update() {
        this.updateMorphValue();

        this.duration += deltaTime;
    }

    draw() {
        const { x, y } = this.position
        const radius = this.radius + this.morphValue

        noStroke()
        fill(this.color)
        circle(x, y, radius)
    }

    updateMorphValue() {
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
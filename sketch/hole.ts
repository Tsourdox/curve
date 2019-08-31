class Hole extends GameObject {
    private baseRadius: number
    private readonly morphLimit: number
    private readonly _position: Point
    private morphSpeed: number
    private morphValue: number
    private color: p5.Color
    private colorFrozened: p5.Color
    private isIncreasing: boolean
    public isFrozen: boolean
    public shouldDisappear: boolean

    constructor() {
        super()
        this.color = color(random(30, 100), random(30, 100), random(30, 100))
        this.colorFrozened = color(random(40), random(40), random(80, 120))
        this.baseRadius = random(50, 200)
        this.morphLimit = random(10, 100)
        this.morphSpeed = random(0.1, 1)
        this.morphValue = this.baseRadius * -1
        this.isIncreasing = true
        this.isFrozen = false
        this.shouldDisappear = false
        this._position = {
            x: random(width) / width,
            y: random(height) / height
        }
    }

    public shrink() {
        this.baseRadius *= 0.8
        if (this.baseRadius < 5) {
            this.shouldDisappear = true
        }
    }

    public get radius() {
        return s(this.baseRadius + this.morphValue)
    }

    public get position(): Point {
        return {
            x: this._position.x * width,
            y: this._position.y * height
        }
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

    public disappear() {
        this.shouldDisappear = true
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
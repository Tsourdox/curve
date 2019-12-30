type HoleState = 'none' | 'frozen' | 'ghosted'

class Hole extends GameObject {
    public readonly id: string
    private readonly morphLimit: number
    private readonly _position: Point
    private baseRadius: number
    private morphSpeed: number
    private morphValue: number
    private color: p5.Color
    private colorFrozened: p5.Color
    private colorGhosted: p5.Color
    private isIncreasing: boolean
    private shouldDisappear: boolean
    public state: HoleState

    public get isGone() {
        return this.radius < 0
    }

    public get isDisappearing() {
        return this.shouldDisappear
    }

    constructor() {
        super()
        this.id = random(99999999).toFixed()
        this.color = color(random(30, 100), random(30, 100), random(30, 100))
        this.colorFrozened = color(random(40), random(40), random(80, 120))
        this.colorGhosted = color(this.color.toString().replace(',1)', ',0.2)'))
        this.baseRadius = random(50, 200)
        this.morphLimit = random(10, this.baseRadius * 0.8)
        this.morphSpeed = random(0.1, 1)
        this.morphValue = this.baseRadius * -1
        this.isIncreasing = true
        this.state = 'none'
        this.shouldDisappear = false
        this._position = {
            x: random(width) / width,
            y: random(height) / height
        }
    }

    public shrink(amount: number) {
        this.baseRadius /= amount
        if (this.baseRadius < 10) {
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
        if (this.shouldDisappear) {
            this.baseRadius -= 20
        } else if (this.state !== 'frozen') {
            this.updateMorphValue()
        }
    }

    public draw() {
        const { x, y } = this.position
        noStroke()
        switch (this.state) {
            case 'frozen': fill(this.colorFrozened); break
            case 'ghosted': fill(this.colorGhosted); break
            default: fill(this.color)
        }
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
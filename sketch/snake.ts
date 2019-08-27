type BodySection = Point[]

class Snake extends GameObject {
    public readonly id: number
    public readonly name: string
    public readonly color: p5.Color
    private readonly controls: Controls
    private readonly ability?: Ability

    public body: BodySection[]
    public direction!: number
    public isAlive!: boolean
    public thickness!: number

    constructor(name: string, _color: string, controls: Controls, ability?: Ability) {
        super()
        this.id = random(0, 999999)
        this.name = name
        this.color = color(_color)
        this.controls = controls
        this.ability = ability
        this.body = []
        this.birth()
    }

    private get bodySection() {
        return this.body[this.body.length - 1]
    }

    private birth() {
        const paddingX = width * 0.1
        const paddingY = height * 0.1
        const startingPoint = {
            x: paddingX + random() * (width - paddingX * 2),
            y: paddingY + random() * (height - paddingY * 2)
        }
        this.body.push([startingPoint])
        this.direction = random(0, 360)
        this.thickness = 5
        this.isAlive = true
    }

    public get head() {
        return this.bodySection[this.bodySection.length - 1]
    }

    public update() {
        if (this.isAlive) {
            this.applyUseInputActions()
            this.growBody()
            this.ability && this.ability.update()
        } else {
            this.shrinkBody()
        }
    }

    public draw() {
        if (game.isPaused || !this.isAlive) {
            this.drawHead()
        }
        this.drawBody()
        if (this.ability) {
            const { x, y } = this.head
            this.ability.draw(x, y, this.color, this.thickness)
        }
    }

    private drawHead() {
        const { x, y } = this.head
        noStroke()
        fill(this.color)
        circle(x, y, this.thickness)
        noFill()
        stroke(this.color)
        strokeWeight(this.thickness * 0.5)
        circle(x, y, this.thickness * 4)
    }

    private drawBody() {
        stroke(this.color)
        strokeWeight(this.thickness)
        curveTightness(0.5)
        noFill()

        for (const bodySection of this.body) {
            const tail = bodySection[0]
            const head = bodySection[bodySection.length - 1]
            beginShape()
            curveVertex(tail.x, tail.y)
            for (const point of bodySection) {
                curveVertex(point.x, point.y)
            }
            curveVertex(head.x, head.y)
            endShape()
        }
    }

    private applyUseInputActions() {
        // Turn left/right
        if (keyIsDown(this.controls.left)) {
            this.direction -= 0.05
        }
        if (keyIsDown(this.controls.right)) {
            this.direction += 0.05
        }
        // Use ability
        if (this.ability && this.controls.special && keyIsDown(this.controls.special)) {
            this.ability.use(this)
        }
    }

    private growBody() {
        const { x, y } = this.head
        this.bodySection.push({
            x: x + cos(this.direction) * 1,
            y: y + sin(this.direction) * 1
        })
    }

    private shrinkBody() {
        for (let i = 0; i < 1; i++){
            if (this.body.length > 1) {
                this.body.shift()
            }
        }
    }
}
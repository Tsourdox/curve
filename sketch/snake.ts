type BodySection = Point[]

class Snake extends GameObject {
    public readonly id: number
    public readonly name: string
    public readonly color: p5.Color
    private readonly controls: Controls
    private readonly ability?: Ability

    public isBurning!: boolean
    public thickness: number
    public direction!: number
    public isAlive!: boolean
    public body!: BodySection[]

    constructor(name: string, _color: string, controls: Controls, ability?: Ability) {
        super()
        this.id = random(0, 999999)
        this.name = name
        this.color = color(_color)
        this.controls = controls
        this.ability = ability
        this.thickness = 5
        this.birth()
    }

    private get bodySection() {
        return this.body[this.body.length - 1]
    }

    private get bodyParts() {
        const parts: Point[] = []
        for (const section of this.body) {
            parts.push(...section)
        }
        return parts
    }

    public get readyForRebirth() {
        return !this.isAlive && this.body.length == 1 && this.bodySection.length == 1
    }

    public birth() {
        this.body = []
        const paddingX = width * 0.1
        const paddingY = height * 0.1
        const startingPoint = {
            x: paddingX + random() * (width - paddingX * 2),
            y: paddingY + random() * (height - paddingY * 2)
        }
        this.body.push([startingPoint])
        this.direction = random(0, 360)
        this.isAlive = true
        this.isBurning = false
    }

    public get head() {
        return this.bodySection[this.bodySection.length - 1]
    }

    public update() {
        if (this.isAlive) {
            this.applyPlayerActions()
            this.growBody()
        } else {
            this.shrinkBody()
        }

        this.ability && this.ability.update(this)
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

    private applyPlayerActions() {
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
            x: x + cos(this.direction) * 1.5,
            y: y + sin(this.direction) * 1.5
        })
    }

    private shrinkBody() {
        const shrinkSpeed = 2 + Math.round(this.bodyParts.length * 0.003)
        for (let i = 0; i < shrinkSpeed; i++){
            const firstBodySection = this.body[0]
            if (firstBodySection.length > 1) {
                firstBodySection.shift()
            } else if (this.body.length > 1) {
                this.body.shift()
            }
        }
    }
}
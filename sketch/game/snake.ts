type BodySection = Point[]
type Effect = 'none' | 'burning' | 'ghost'

class Snake extends GameObject {
    public readonly name: string
    public readonly color: p5.Color
    public readonly colorGhosted: p5.Color
    public readonly speed: number
    public readonly controls: Controls
    private readonly ability: Ability
    private rebirthProtection?: number

    public isInsideHoles: { [id: string]: HoleEffect | null }
    public thickness: number
    public effect!: Effect
    public direction!: number
    public isAlive!: boolean
    public body!: BodySection[]

    constructor(name: string, _color: string, controls: Controls, ability: Ability) {
        super()
        this.name = name
        this.color = color(_color)
        this.colorGhosted = color(this.color.toString().replace(',1)', ',0.2)'))
        this.speed = 1.5
        this.controls = controls
        this.ability = ability
        this.isInsideHoles = {}
        this.thickness = s(5)
        this.birth()
    }

    public get isProtected(): boolean {
        return !!this.rebirthProtection
    }

    public get bodySection() {
        return this.body[this.body.length - 1]
    }

    public get bodyParts() {
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
        this.isInsideHoles = {}
        this.effect = 'none'
        this.rebirthProtection = 3000
    }

    public enterPassiveGhostForm() {
        (this.ability as GhostAbility).enterPassiveGhostForm(this)
    }
    public leavePassiveGhostForm() {
        (this.ability as GhostAbility).leavePassiveGhostForm(this)
    }

    public get head() {
        return this.bodySection[this.bodySection.length - 1]
    }

    public update() {
        if (this.isAlive) {
            this.applyPlayerActions()
            this.growBody()
            this.updateRebirthProtection()
        } else {
            this.shrinkBody()
        }

        this.ability.update(this)
    }

    public draw() {
        if (game.isPaused || !this.isAlive) {
            this.drawHead()
        }
        this.drawBody()
        if (this.ability) {
            this.ability.draw(this)
        }
    }

    private updateRebirthProtection() {
        if (this.rebirthProtection) {
            this.rebirthProtection -= deltaTime
            if (this.rebirthProtection < 0) {
                delete this.rebirthProtection
            }
        }
    }

    public drawHead(enlarge = 1) {
        const { x, y } = this.head
        noStroke()
        fill(this.color)
        circle(x, y, this.thickness)
        noFill()
        stroke(this.color)
        strokeWeight(this.thickness * 0.5)
        circle(x, y, this.thickness * 4 * enlarge)
    }

    public get activeColor(): p5.Color {
        if (this.effect == 'ghost') {
            return this.colorGhosted
        } else if (this.rebirthProtection) {
            return this.rebirthProtection % 800 > 400 ? this.colorGhosted : this.color
        } else {
            return this.color
        }
    }

    private drawBody() {
        stroke(this.activeColor)
        strokeWeight(this.thickness)
        curveTightness(0.5)
        noFill()

        for (const bodySection of this.body) {
            const tail = bodySection[0]
            const head = bodySection[bodySection.length - 1]
            beginShape()
            curveVertex(tail.x, tail.y)
            for (let i = 0; i < bodySection.length; i+=10) {
                const point = bodySection[i]
                curveVertex(point.x, point.y)
            }
            curveVertex(head.x, head.y)
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
        if (keyIsDown(this.controls.special)) {
            this.ability.use(this)
        }
    }

    private growBody() {
        const { x, y } = this.head
        const nextBodyPart = {
            x: x + cos(this.direction) * s(this.speed),
            y: y + sin(this.direction) * s(this.speed)
        }

        const isInsideAHole = Object.keys(this.isInsideHoles).length
        if (isInsideAHole) {
            this.bodySection.pop()
            if (this.bodySection.length == 0) {
                this.bodySection.push(nextBodyPart)
            } else {
                this.body.push([nextBodyPart])
            }
        } else {
            this.bodySection.push(nextBodyPart)
        }
    }

    private shrinkBody() {
        const shrinkSpeed = 3 + Math.round(this.bodyParts.length * 0.005)
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
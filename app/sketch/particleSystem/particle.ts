interface ParticleProps {
    position?: p5.Vector
    velocity: p5.Vector
    color: p5.Color
    size: number
    lifespan: number
}

class Particle {
    protected readonly velocity: p5.Vector
    protected readonly position: p5.Vector
    protected readonly size: number
    protected readonly color: p5.Color
    protected readonly lifespan: number
    protected timeToDeath: number

    constructor(props: ParticleProps) {
        const position = props.position || createVector(0, 0)
        this.position = position.copy()
        this.velocity = props.velocity
        this.size = props.size
        this.color = props.color
        this.lifespan = props.lifespan
        this.timeToDeath = props.lifespan
    }

    public run() {
        this.update()
        this.draw()
    }

    private update() {
        this.position.add(this.velocity)
        this.timeToDeath = max(0, this.timeToDeath - deltaTime * 0.001)
    }

    private draw() {
        const { x, y } = this.position
        noStroke()
        fill(color(this.color.toString().replace(',1)', `,${this.opacity})`)))
        ellipse(x, y, this.size, this.size)
    }

    private get opacity(): number {
        if (this.timeToDeath) {
            return this.timeToDeath / this.lifespan
        }
        return 0
    }

    public get isDead() {
        return this.timeToDeath <= 0
    }

}
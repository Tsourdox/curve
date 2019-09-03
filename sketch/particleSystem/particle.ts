interface ParticleProps {
    position?: p5.Vector
    velocity: p5.Vector
    color: p5.Color
    size: number
}

class Particle {
    protected velocity: p5.Vector
    protected position: p5.Vector
    protected size: number
    protected color: p5.Color
    protected lifespan: number

    constructor(props: ParticleProps) {
        const position = props.position || createVector(0, 0)
        this.position = position.copy()
        this.velocity = props.velocity
        this.size = props.size
        this.color = props.color
        this.lifespan = 1
    }

    public run() {
        this.update()
        this.draw()
    }

    private update() {
        this.position.add(this.velocity)
        this.lifespan = max(0, this.lifespan - 0.02)
    }

    private draw() {
        const { x, y } = this.position
        noStroke()
        fill(color(this.color.toString().replace(',1)', `,${this.lifespan})`)))
        ellipse(x, y, this.size, this.size)
    }

    public get isDead() {
        return this.lifespan < 0
    }

}
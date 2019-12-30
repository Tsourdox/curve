class ParticleSystem {
    private origin: p5.Vector
    private particles: Particle[]
    private particleGenerator: ParticleGenerator
    private spawnRate: number
    private time: number
    private lifespan?: number

    constructor(origin: p5.Vector, spawnRate: number, particleGenerator: ParticleGenerator, lifespan?: number, startingTime?: number) {
        this.origin = origin.copy()
        this.particles = []
        this.spawnRate = spawnRate
        this.time = startingTime || random(spawnRate)
        this.particleGenerator = particleGenerator
        this.lifespan = lifespan
    }

    public updateOrigin(origin: p5.Vector) {
        this.origin = origin
    }

    private addParticle(newTime: number) {
        if (!this.particles.length || newTime % this.spawnRate < this.time % this.spawnRate) {
            this.particles.push(...this.particleGenerator(this.origin))
        }
    }

    public run() {
        const newTime = this.time + deltaTime * 0.001

        if (this.lifespan == undefined || this.lifespan > this.time) {
            this.addParticle(newTime)
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.run()

            if (particle.isDead) {
                this.particles.splice(i, 1)
            }
        }

        this.time += deltaTime * 0.001
    }
}


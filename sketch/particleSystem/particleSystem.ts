class ParticleSystem {
    private origin: p5.Vector
    private particles: Particle[]
    private particleGenerator: ParticleGenerator
    private spawnRate: number
    private time: number

    constructor(origin: p5.Vector, spawnRate: number, particleGenerator: ParticleGenerator) {
        this.origin = origin.copy()
        this.particles = []
        this.spawnRate = spawnRate
        this.time = random(spawnRate)
        this.particleGenerator = particleGenerator
    }

    public updateOrigin(origin: p5.Vector) {
        this.origin = origin
    }

    private addParticle(newTime: number) {
        if (!this.particles.length || newTime % this.spawnRate < this.time % this.spawnRate) {
            this.particles.push(this.particleGenerator(this.origin))
        }
    }

    public run() {
        const newTime = this.time + deltaTime * 0.001
        this.addParticle(newTime)

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


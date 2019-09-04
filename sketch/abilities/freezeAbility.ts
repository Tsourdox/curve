class FreezeAbility extends Ability {
    private readonly duration: number
    private time: number
    private isActive: boolean
    private originalHoleEffects: { [id: string]: HoleState }
    private particleSystems: ParticleSystem[]

    constructor(coldown: number, duration: number) {
        super('Freeze', coldown)
        this.time = 0
        this.duration = duration
        this.isActive = false
        this.originalHoleEffects = {}
        this.particleSystems = []
    }

    protected applyEffect(): void {
        this.isActive = true
        gameSounds.freeze.play()

        for (const index in game.holes) {
            const hole = game.holes[index]
            this.originalHoleEffects[hole.id] = hole.state
            hole.state = 'frozen'
        }

        for (const snake of game.snakes) {
            const { x, y } = snake.head
            this.particleSystems.push(
                new ParticleSystem(createVector(x, y), 0.01, snowParticle)
            )
        }
    }

    public update(snake: Snake) {
        super.update(snake)
        if (this.isActive) {
            this.time += deltaTime * 0.001

            for (const index in game.snakes) {
                const snake = game.snakes[index]
                const { x, y } = snake.head
                this.particleSystems[index].updateOrigin(createVector(x, y))
            }

            for (const particleSystem of this.particleSystems) {
                particleSystem.run()
            }

            if (this.time > this.duration) {
                this.isActive = false
                this.time = 0

                // Restore effects
                for (const hole of game.holes) {
                    hole.state = this.originalHoleEffects[hole.id] || 'none'
                }

                this.originalHoleEffects = {}
                this.particleSystems = []
            }
        }
    }
}
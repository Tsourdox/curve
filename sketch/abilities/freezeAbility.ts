class FreezeAbility extends Ability {
    private readonly duration: number
    private time: number
    private isActive: boolean
    private originalHoleEffects: { [id: number]: HoleEffect }

    constructor(coldown: number, duration: number) {
        super('Freeze', coldown)
        this.time = 0
        this.duration = duration
        this.isActive = false
        this.originalHoleEffects = {}
    }

    protected applyEffect(): void {
        this.isActive = true
        gameSounds.freeze.play()

        for (const index in game.holes) {
            const hole = game.holes[index]
            this.originalHoleEffects[hole.id] = hole.effect
            hole.effect = 'frozen'
        }
    }

    public update() {
        super.update()
        if (this.isActive) {
            this.time += deltaTime * 0.001
            if (this.time > this.duration) {
                this.isActive = false
                this.time = 0

                // Restore effects
                for (const hole of game.holes) {
                    hole.effect = this.originalHoleEffects[hole.id] || 'none'
                }

                this.originalHoleEffects = {}
            }
        }
    }
}
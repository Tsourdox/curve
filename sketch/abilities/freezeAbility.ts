class FreezeAbility extends Ability {
    private readonly duration: number
    private time: number
    private isActive: boolean

    constructor(coldown: number, duration: number) {
        super('Freeze', coldown)
        this.time = 0
        this.duration = duration
        this.isActive = false
    }

    protected applyEffect(): void {
        this.isActive = true
        gameSounds.freeze.play()
        game.isTimeFrozen = true
    }

    update() {
        super.update()
        if (this.isActive) {
            this.time += deltaTime * 0.001
            if (this.time > this.duration) {
                this.isActive = false
                this.time = 0
                game.isTimeFrozen = false
            }
        }
    }
}
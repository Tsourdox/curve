class FreezeAbility extends Ability {
    private readonly duration: number
    private timeLeft: number
    private isActive: boolean

    constructor(coldown: number, duration: number) {
        super('Freeze', coldown)
        this.duration = duration
        this.timeLeft = duration
        this.isActive = false
    }

    protected applyEffect(): void {
        this.isActive = true
        game.isTimeFrozened = true

        gameSounds.freeze.play()
    }

    update() {
        super.update()
        if (this.isActive) {
            this.timeLeft -= deltaTime * 0.001
            if (this.timeLeft <= 0) {
                this.isActive = false
                this.timeLeft = this.duration
                game.isTimeFrozened = false
            }
        }
    }
}
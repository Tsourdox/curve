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

        for (const index in game.holes) {
            const hole = game.holes[index]
            if (hole.state === 'ghosted') {
                hole.disappear()
            } else {
                 hole.state = 'frozen'
            }
        }
    }

    public update(snake: Snake) {
        super.update(snake)
        if (this.isActive) {
            const nextTime = this.time + deltaTime * 0.001

            // Start unfreeze audio
            const unfreezeStartTime = this.duration - 1.0
            if (nextTime > unfreezeStartTime && this.time <= unfreezeStartTime) {
                gameSounds.unfreeze.play()
            }

            // Update time
            this.time = nextTime

            // End effect and unfreeze all holes
            if (this.time > this.duration) {
                this.isActive = false
                this.time = 0
                this.unfreezeHoles()
            }
        }
    }

    private unfreezeHoles() {
        for (const hole of game.holes) {
            hole.state = 'none'
        }
    }
}

class EndCheck {
    private readonly WARNING_START_TIME = 15000
    private readonly WARNING_SOUND_START_TIME = 16400
    private readonly WARNING_END_TIME = 30000
    private _isGameOver: boolean
    private timeAlone: number

    public constructor() {
        this._isGameOver = false
        this.timeAlone = 0
    }

    public get isGameOver() {
        return this._isGameOver
    }

    public update(snakes: Snake[], isGamePaused?: boolean) {
        if (this.isWarningActive) {
            // Pause music if game is paused
            if (isGamePaused && gameSounds.warning.isPlaying()) {
                gameSounds.warning.pause()
            }

            // Play music if game is resumed
            if (!isGamePaused && gameSounds.warning.isPaused()) {
                gameSounds.warning.play()
            }
        }

        // Check end conditions if game is running
        if (!isGamePaused) {
            let nextTimeAlone = this.timeAlone + deltaTime

            // Alone warning
            const aliveSnakes = snakes.filter((snake) => snake.isAlive)
            if (aliveSnakes.length == 1 && snakes.length > 1) {
                if (nextTimeAlone > this.WARNING_START_TIME) {
                    this.alternateWarning()
                }
                const time = this.WARNING_SOUND_START_TIME
                if (nextTimeAlone >= time && this.timeAlone < time) {
                    gameSounds.warning.play()
                }
            } else {
                if (gameSounds.warning.isPlaying()) {
                    gameSounds.warning.stop()
                }
                nextTimeAlone = 0
            }

            // End condition
            if (this.isAllSnakesDead(snakes) || this.timeAlone > this.WARNING_END_TIME) {
                if (gameSounds.warning.isPlaying()) {
                    gameSounds.warning.stop()
                }
                this._isGameOver = true
            }

            this.timeAlone = nextTimeAlone
        }

    }

    public alternateWarning() {
        const stregth = (this.timeAlone) * 0.0004
        const speed = (this.timeAlone) * 0.004
        const alternatingValue = map(sin(speed), -1, 1, 0, stregth)

        noStroke()
        fill(255, 0, 0, alternatingValue)
        rectMode('corner')
        rect(0, 0, width, height)
    }

    private isAllSnakesDead(snakes: Snake[]) {
        return snakes.reduce((isDead, snake) => isDead && !snake.isAlive, true)
    }

    private get isWarningActive() {
        return this.timeAlone > this.WARNING_START_TIME
    }
}
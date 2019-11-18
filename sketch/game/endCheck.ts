
class EndCheck {
    private _isGameOver: boolean
    private timeAlone: number

    public constructor() {
        this._isGameOver = false
        this.timeAlone = 0
    }

    public get isGameOver() {
        return this._isGameOver
    }

    private isAllSnakesDead(snakes: Snake[]) {
        return snakes.reduce((isDead, snake) => isDead && !snake.isAlive, true)
    }

    public update(snakes: Snake[]) {
        this.timeAlone += deltaTime
        const aliveSnakes = snakes.filter((snake) => snake.isAlive)

        if (aliveSnakes.length == 1 && snakes.length > 1) {
            if (this.timeAlone > 15000) {
                this.alternateWarning()
            }
        } else {
            this.timeAlone = 0
        }

        if (this.isAllSnakesDead(snakes) || this.timeAlone > 30000) {
            this._isGameOver = true
        }
    }

    public alternateWarning() {
        const stregth = (this.timeAlone) * 0.001
        const speed = (this.timeAlone) * 0.005
        const alternatingValue = map(sin(speed), -1, 1, 0, stregth)
        fill(255, 0, 0, alternatingValue)
        rect(0, 0 , width, height)
    }
}
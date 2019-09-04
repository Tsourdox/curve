type SetupStep = 'start' | 'snake-selection' | 'done'

class Menu {
    private bgColor: p5.Color
    private textColor: p5.Color
    private snakeSelection: CharacterMenu
    public setupStep: SetupStep

    public get isSetup() {
        return this.setupStep != 'done'
    }

    public get selectedSnakes() {
        return this.snakeSelection.selectedSnakes
    }

    constructor() {
        this.bgColor = color(0, 160)
        this.textColor = color(180)
        this.setupStep = 'start'
        this.snakeSelection = new CharacterMenu()
    }

    public draw() {
        if (menu.isSetup || game.isPaused) {
            // Responsive centered content
            // Init variables
            const maxDiameter = min(width, height)
            const diameter = maxDiameter * 0.7
            const x = width * 0.5
            const y = height * 0.5

            // Pepare drawing
            noStroke()

            // Draw circle
            fill(this.bgColor)
            circle(width * 0.5, height * 0.5, diameter)

            // Pepare text
            textAlign(CENTER, CENTER)
            fill(this.textColor)

            if (this.setupStep == 'start') {
                textSize(diameter * 0.07)
                textStyle(BOLD)
                text('press space to begin', x, y)
                textStyle(NORMAL)

            } else {
                // Draw content
                if (this.setupStep == 'snake-selection') {
                    this.snakeSelection.draw(x, y, diameter)
                } else {
                    this.drawScore(x, y, diameter)
                    this.drawActions(x, y, diameter)
                }
            }
        }
    }

    private drawScore(x: number, y: number, diameter: number) {
        const score = game.hasEnded ? game.score : localStorage.highScore
        let scoreTitle = 'HIGH SCORE'
        if (game.hasEnded) {
            if (game.score > localStorage.highScore) {
                scoreTitle = 'NEW HIGH SCORE'
            } else {
                scoreTitle = 'SCORE'
            }
        }

        textSize(diameter * 0.07)
        text(scoreTitle, x, y - diameter * 0.2)
        textSize(diameter * 0.05)
        text(numberWithSpaces(score), x, y - diameter * 0.1)
    }

    private drawActions(x: number, y: number, diameter: number) {
        textStyle(BOLD)
        textSize(diameter * 0.06)
        const spaceActionText = game.hasEnded ? 'press space to restart' : 'press space to play/pause'
        text(spaceActionText, x, y + diameter * 0.1)

        textStyle(NORMAL)
        textSize(diameter * 0.05)
        text('press enter to end game', x, y + diameter * 0.22)
    }

}
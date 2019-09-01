type SetupStep = 'start' | 'snake-selection' | 'done'

class Menu {
    private bgColor: p5.Color
    private textColor: p5.Color
    private snakeSelection: SnakeSelection
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
        this.snakeSelection = new SnakeSelection()
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
                this.drawMainMenuHeader(x, y, diameter)

                // Draw content
                if (this.setupStep == 'snake-selection') {
                    this.snakeSelection.draw(x, y, diameter)
                } else {
                    this.printActionList(x, y, diameter)
                }
            }
        }
    }

    private drawMainMenuHeader(x: number, y: number, diameter: number) {
        textSize(diameter * 0.08)
        text('MAIN MENU', x, y - diameter * 0.25)

        if (game.hasEnded) {
            textSize(diameter * 0.06)
            text('SCORE: ' + game.score.toFixed() + ' P', x, y - diameter * 0.07)
        }
    }

    private printActionList(x: number, y: number, diameter: number) {
        game.hasEnded ? this.largeText(diameter) : this.normalText(diameter)
        text('press enter to restart the game', x, y - diameter * (game.hasEnded ? -0.1 : 0.02))

        if (!game.hasEnded) {
            this.largeText(diameter)
            text('press space to play/pause the game', x, y + diameter * 0.1)
        }

        this.normalText(diameter)
        text('press esc to select heroes', x, y + diameter * 0.22)
    }

    private largeText(diameter: number) {
        textSize(diameter * 0.045)
        textStyle(BOLD)
    }

    private normalText(diameter: number) {
        textSize(diameter * 0.04)
        textStyle(NORMAL)
    }

}
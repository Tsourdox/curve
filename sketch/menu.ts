type SetupStep = 'start' | 'number-of-players' | 'done'

class Menu {
    private bgColor: p5.Color
    private textColor: p5.Color
    public setupStep: SetupStep

    public get isSetup() {
        return this.setupStep != 'done'
    }

    constructor() {
        this.bgColor = color(0, 160)
        this.textColor = color(180)
        this.setupStep = 'start'
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
                if (this.setupStep == 'number-of-players') {
                    this.askForNumberOfPlayers(x, y, diameter)
                } else {
                    this.printActionList(x, y, diameter)
                }
            }
        }
    }

    private drawMainMenuHeader(x: number, y: number, diameter: number) {
        textSize(diameter * 0.08)
        text('MAIN MENU', x, y - diameter * 0.25)
    }

    private askForNumberOfPlayers(x: number, y: number, diameter: number) {
        textSize(diameter * 0.05)
        text('How many players are you?', x, y + diameter * 0.07)

        textSize(diameter * 0.07)
        text('1-6', x, y + diameter * 0.2)
    }

    private printActionList(x: number, y: number, diameter: number) {
        textSize(diameter * 0.04)
        text('press enter to restart the game', x, y - diameter * 0.02)
        textSize(diameter * 0.042)
        textStyle(BOLD)
        text('press space to play/pause the game', x, y + diameter * 0.1)
        textStyle(NORMAL)
        textSize(diameter * 0.04)
        text('press esc to select players', x, y + diameter * 0.22)
    }

}
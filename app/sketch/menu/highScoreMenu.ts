class HighScoreMenu {

    private mouseWasPressed: boolean

    constructor() {
        this.mouseWasPressed = false
    }

    public draw(x: number, y: number, menuDiameter: number) {
        this.drawButton()
        this.drawScoreList(x, y, menuDiameter)
    }

    private drawButton() {
        const diameter = min(width, height) * 0.1
        const x = diameter * 0.7
        const y = diameter * 0.7
        this.handleMouseClick(x, y, diameter)

        noStroke()
        fill(color(0))
        textAlign(CENTER, CENTER)
        circle(x, y, diameter)

        fill(color(180))
        textSize(diameter * 0.2)
        if (menu.setupStep != 'highscore') {
            text('high', x + diameter * 0.01, y - diameter * 0.13)
            text('score ', x + diameter * 0.03, y + diameter * 0.13)
        } else {
            text('back', x, y)
        }
    }

    handleMouseClick(x: number, y: number, diameter: number) {
        if (!this.mouseWasPressed && mouseIsPressed) {
            const mousePosition = { x: mouseX, y: mouseY }
            if (distanceBetween(mousePosition, { x, y }, 0, diameter) < 0) {
                if (menu.setupStep == 'highscore') {
                    menu.setupStep = 'selection'
                } else {
                    menu.setupStep = 'highscore'
                }
            }
        }

        this.mouseWasPressed = mouseIsPressed
    }

    private drawScoreList(x: number, y: number, menuDiameter: number) {
        if (menu.setupStep != 'highscore') {
            return
        }

        // Title
        fill(color(180))
        textFont(Fonts.Monoton)
        textSize(menuDiameter * 0.07)
        text('HIGH   SCORES', x, y - menuDiameter * 0.3)

        // List
        textFont(Fonts.Chilanka)
        const scores = scoreboard.topTenList
        for (let i = 0; i < scores.length; i++) {
            const scoreData = scores[i]
            let yPos = (y - menuDiameter * 0.2) + menuDiameter * 0.06 * i
            let xPos = x - menuDiameter * 0.07
            textAlign(RIGHT)
            textSize(menuDiameter * 0.04)
            text(scoreData.score, xPos, yPos)

            xPos += menuDiameter * 0.02
            yPos -= menuDiameter * 0.005
            textAlign(LEFT)
            textSize(menuDiameter * 0.025)
            text(scoreData.players.join(', '), xPos, yPos)
        }
    }
}
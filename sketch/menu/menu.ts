type SetupStep = 'story' | 'selection' | 'done'

class Menu {
    private bgColor: p5.Color
    private textColor: p5.Color
    private storyMenu: StoryMenu
    private characterMenu: CharacterMenu
    private muteButton: MuteButton
    public setupStep: SetupStep
    public diameter: number

    constructor() {
        this.bgColor = color(0, 160)
        this.textColor = color(180)
        this.setupStep = 'selection'
        this.storyMenu = new StoryMenu()
        this.characterMenu = new CharacterMenu()
        this.muteButton = new MuteButton()
        this.diameter = 0
    }

    public get isSetup() {
        return this.setupStep != 'done'
    }

    public get selectedSnakes() {
        return this.characterMenu.selectedSnakes
    }

    public replayStory() {
        this.storyMenu = new StoryMenu()
        this.setupStep = 'story'
    }

    public draw() {
        if (menu.isSetup || game.isPaused) {
            // Responsive centered content
            // Init variables
            this.diameter = min(width, height) * 0.7
            const x = width * 0.5
            const y = height * 0.5

            // Pepare drawing
            noStroke()

            // Draw circle
            fill(this.bgColor)
            circle(width * 0.5, height * 0.5, this.diameter)

            // Pepare text
            textAlign(CENTER, CENTER)
            fill(this.textColor)
            textFont(Fonts.Chilanka)

            // Draw content
            if (this.setupStep == 'story') {
                this.storyMenu.draw(x, y, this.diameter)
            } else if (this.setupStep == 'selection') {
                this.characterMenu.draw(x, y, this.diameter)
            } else {
                this.drawScore(x, y)
                this.drawActions(x, y)
            }
            this.muteButton.draw()
        }
    }

    private drawScore(x: number, y: number) {
        const score = game.hasEnded ? game.score : scoreboard.highScore
        let scoreTitle = 'HIGH  SCORE'
        if (game.hasEnded) {
            if (game.score >= scoreboard.highScore) {
                scoreTitle = 'NEW  HIGH  SCORE'
            } else {
                scoreTitle = 'SCORE'
            }
        }

        textFont(Fonts.Monoton)
        textSize(this.diameter * 0.07)
        text(scoreTitle, x, y - this.diameter * 0.2)

        textFont(Fonts.Helvetica)
        textSize(this.diameter * 0.068)
        text(numberWithSpaces(score), x, y - this.diameter * 0.1)
        textFont(Fonts.Chilanka)
    }

    private drawActions(x: number, y: number) {
        textStyle(BOLD)
        textSize(this.diameter * 0.06)
        const spaceActionText = game.hasEnded ? 'press space to restart' : 'press space to play/pause'
        text(spaceActionText, x, y + this.diameter * 0.1)

        textStyle(NORMAL)
        textSize(this.diameter * 0.045)
        text('press backspace to end game', x, y + this.diameter * 0.22)
    }

}
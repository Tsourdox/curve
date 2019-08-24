class Menu {
    private bgColor: p5.Color
    private textColor: p5.Color
    public isSetup: boolean

    constructor() {
        this.bgColor = color(0, 150)
        this.textColor = color(220)
        this.isSetup = true
    }

    private get pos() {
        return {
            x: width * 0.2,
            y: height * 0.2
        }
    }
    private get size() {
        return {
            w: width * 0.6,
            h: height * 0.6
        }
    }

    public draw() {
        if (!game.isRunning) {
            const { x, y } = this.pos
            const { w, h } = this.size
            noStroke()
            fill(this.bgColor)
            circle(x + w * 0.5, y + h * 0.5, w * 0.8 )

            fill(this.textColor)
            textSize(width * 0.04)
            textAlign(CENTER, TOP);
            text('MAIN MENU', x, y + height * 0.09, w, h);

            if (this.isSetup) {
                textAlign(CENTER, CENTER);
                textSize(width * 0.02)
                text('select number of players', x, y + height * 0.02, w, h);

                textSize(width * 0.03)
                text('1-6', x, y + height * 0.1, w, h);
            } else {
                textSize(width * 0.02)
                textAlign(CENTER, CENTER);
                text('press enter to restart round', x, y - height * 0.02, w, h);
                text('press space to play/pause the game', x, y + height * 0.08, w, h);
                text('pess esc to select players', x, y + height * 0.18, w, h);
            }
        }
    }
}
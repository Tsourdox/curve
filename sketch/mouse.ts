class Mouse {
    private readonly color: p5.Color
    private readonly thickness: number
    private mouseHasBeenFound: boolean

    constructor() {
        this.color = color(200)
        this.thickness = 5
        this.mouseHasBeenFound = false
    }

    draw() {
        if (!this.mouseHasBeenFound) {
            this.mouseHasBeenFound = Boolean(mouseX || mouseY)
        } else if (menu.isSetup || game.isPaused) {
            noStroke()
            fill(this.color)
            circle(mouseX, mouseY, this.thickness)
            noFill()
            stroke(this.color)
            strokeWeight(this.thickness * 0.5)
            circle(mouseX, mouseY, this.thickness * 6)
        }
    }
}

function mouseClicked() {
    const mousePosition: Point = { x: mouseX, y: mouseY }

    if (menu.isSetup) {
        game.removeHoleContaining(mousePosition, true)
    }
}
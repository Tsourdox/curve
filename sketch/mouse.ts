class Mouse {
    private readonly color: p5.Color
    private readonly thickness: number

    constructor() {
        this.color = color(200)
        this.thickness = 5
    }

    draw() {
        if (menu.isSetup || game.isPaused) {
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
class MuteButton {
    private mouseWasPressed: boolean

    constructor() {
        this.mouseWasPressed = false
    }

    draw() {
        const diameter = min(width, height) * 0.1
        const x = width - diameter * 0.7
        const y = diameter * 0.7
        this.handleMouseClick(x, y, diameter)

        noStroke()
        fill(color(0))
        textAlign(CENTER, CENTER)
        circle(x, y, diameter)

        fill(color(music.isMuted ? 100 : 180))
        textSize(diameter * 0.2)
        text('Music:', x, y - diameter * 0.1)
        text(music.isMuted ? 'off' : 'on', x, y + diameter * 0.2)
    }

    handleMouseClick(x: number, y: number, diameter: number) {
        if (!this.mouseWasPressed && mouseIsPressed) {
            const mousePosition = { x: mouseX, y: mouseY }
            if (distanceBetween(mousePosition, { x, y }, 0, diameter) < 0) {
                music.toggleMute()
            }
        }

        this.mouseWasPressed = mouseIsPressed
    }
}
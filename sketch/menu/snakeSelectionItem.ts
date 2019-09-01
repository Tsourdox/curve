class SnakeSelectionItem {
    private readonly bgColor: p5.Color
    private readonly selectedColor: p5.Color
    private readonly textColor: p5.Color
    public snake: Snake
    public isSelected: boolean
    private mouseWasPressed: boolean

    constructor(snake: Snake) {
        this.snake = snake
        this.selectedColor = snake.color
        this.bgColor = color(50)
        this.textColor = color(180)
        this.isSelected = false
        this.mouseWasPressed = false
    }

    public draw(x: number, y: number, menuDiameter: number) {
        const diameter = menuDiameter * 0.3

        // Draw circle
        noStroke()
        fill(this.isSelected ? this.selectedColor : this.bgColor)
        circle(x, y, diameter)

        // Pepare text
        textAlign(CENTER, CENTER)
        fill(this.textColor)
        textSize(diameter * 0.2)
        textStyle(BOLD)


        text(this.snake.name, x, y)
        textStyle(NORMAL)

        // Handle selection
        if (!this.mouseWasPressed && mouseIsPressed) {
            const mousePosition = { x: mouseX, y: mouseY }
            if (distanceBetween(mousePosition, { x, y }, 0, diameter) < 0) {
                this.isSelected = !this.isSelected
            }
        }

        this.mouseWasPressed = mouseIsPressed
    }

}
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
        this.mouseWasPressed = false
        this.isSelected = !!JSON.parse(localStorage[snake.name] || 'false')
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

        textStyle(BOLD)
        textSize(diameter * 0.2)
        text(this.snake.name, x, y - diameter * 0.05)

        textStyle(NORMAL)
        textSize(diameter * 0.1)
        text(this.snake.controls.asString, x, y + diameter * 0.2)

        // Handle selection
        if (!this.mouseWasPressed && mouseIsPressed) {
            const mousePosition = { x: mouseX, y: mouseY }
            if (distanceBetween(mousePosition, { x, y }, 0, diameter) < 0) {
                this.isSelected = !this.isSelected
                localStorage.setItem(this.snake.name, this.isSelected.toString())
            }
        }

        this.mouseWasPressed = mouseIsPressed
    }

}
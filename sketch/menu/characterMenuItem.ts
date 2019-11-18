type MouseOverEvent = (snakeName: string) => void

class CharacterMenuItem {
    private readonly bgColor: p5.Color
    private readonly selectedColor: p5.Color
    private readonly textColor: p5.Color
    public snake: Snake
    public isSelected: boolean
    private isMouseOver: boolean
    private onMouseEnter: MouseOverEvent
    private onMouseLeave: Function
    private mouseWasPressed: boolean
    private keyWasPressed: boolean

    constructor(snake: Snake, onMouseEnter: MouseOverEvent, onMouseLeave: Function) {
        this.snake = snake
        this.onMouseEnter = onMouseEnter
        this.onMouseLeave = onMouseLeave
        this.isMouseOver = false
        this.selectedColor = snake.color
        this.bgColor = color(50)
        this.textColor = color(180)
        this.mouseWasPressed = false
        this.keyWasPressed = false
        this.isSelected = !!JSON.parse(localStorage[snake.name] || 'false')
    }

    private handleMouseHover(x: number, y: number, diameter: number) {
        const itemPosition = { x, y }
        const mousePosition = { x: mouseX, y: mouseY }
        const distance = distanceBetween(mousePosition, itemPosition, 0, diameter)
        if (distance < 0) {
            if (!this.isMouseOver) {
                this.onMouseEnter(this.snake.name)
            }
            this.isMouseOver = true
        } else {
            if (this.isMouseOver) {
                this.onMouseLeave()
            }
            this.isMouseOver = false
        }
    }

    public draw(x: number, y: number, menuDiameter: number) {
        const diameter = menuDiameter * 0.3
        this.handleMouseHover(x, y, diameter)

        // Draw circle
        noStroke()
        fill(this.isSelected ? this.selectedColor : this.bgColor)
        circle(x, y, diameter)

        // Pepare text
        textAlign(CENTER, CENTER)
        fill(this.isSelected ? color(0) : this.textColor)

        textStyle(BOLD)
        textSize(diameter * 0.26)
        text(this.snake.name, x, y - diameter * 0.04)

        textStyle(NORMAL)
        textFont(Fonts.Helvetica)
        textSize(diameter * 0.1)
        text(this.snake.controls.asString, x, y + diameter * 0.2)
        textFont(Fonts.Chilanka)

        this.updateSelection(x, y, diameter)

        // update state
        this.mouseWasPressed = mouseIsPressed
        this.keyWasPressed = keyIsPressed
    }

    private updateSelection(x: number, y: number, diameter: number) {
        // Mouse down
        if (!this.mouseWasPressed && mouseIsPressed) {
            const mousePosition = { x: mouseX, y: mouseY }
            if (distanceBetween(mousePosition, { x, y }, 0, diameter) < 0) {
                this.toggleSelection()
            }
        }
        // Key down
        if (!this.keyWasPressed && keyIsPressed) {
            const { left, special, right } = this.snake.controls
            if (keyCode == left || keyCode == special || keyCode == right) {
                this.toggleSelection()
            }
        }
    }

    private toggleSelection() {
        this.isSelected = !this.isSelected
        localStorage.setItem(this.snake.name, this.isSelected.toString())
    }
}
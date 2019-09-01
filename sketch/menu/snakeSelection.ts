class SnakeSelection {
    private snakeMenuItems: SnakeSelectionItem[]
    public nrOfSnakes: number

    public get selectedSnakes() {
        return (
            this.snakeMenuItems
                .filter((item) =>item.isSelected)
                .map((item) => item.snake)
        )
    }

    constructor() {
        this.nrOfSnakes = 0
        this.snakeMenuItems = []
        for (const snake of Snakes.all) {
            this.snakeMenuItems.push(new SnakeSelectionItem(snake))
        }
    }

    public draw(x: number, y: number, menuDiameter: number) {
        this.drawSnakeMenuItems(x, y, menuDiameter)

        noStroke()
        fill(color(180))
        textAlign(CENTER, CENTER)
        textStyle(BOLD)
        textSize(menuDiameter * 0.07)
        text(`Select your heroes!`, x, y)

        textStyle(NORMAL)
        textSize(menuDiameter * 0.04)
        text('press space to continue', x, y + menuDiameter * 0.2)
    }

    private drawSnakeMenuItems(x: number, y: number, menuDiameter: number) {
        const radius = menuDiameter * 0.7
        const nrOfItems = this.snakeMenuItems.length
        let addedAngle = 0
        for(let i = 0; i < nrOfItems; i++) {
            const angle = 2 * PI / (nrOfItems + 4)
            const shift = -angle

            if (i == this.snakeMenuItems.length / 2) {
                addedAngle = angle * 2
            }

            let itemX = x + radius * cos(angle * i + shift + addedAngle)
            let itemY = y + radius * sin(angle * i + shift + addedAngle)

            this.snakeMenuItems[i].draw(itemX, itemY, menuDiameter)
        }
    }

}
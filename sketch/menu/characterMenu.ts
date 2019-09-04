class CharacterMenu {
    private snakeMenuItems: CharacterMenuItem[]
    private displayedSnake?: string

    public get selectedSnakes() {
        return (
            this.snakeMenuItems
                .filter((item) =>item.isSelected)
                .map((item) => item.snake)
        )
    }

    constructor() {
        this.snakeMenuItems = []
        for (const snake of snakes.listAll) {
            this.snakeMenuItems.push(new CharacterMenuItem(snake, this.onMouseEnterMenuItem))
        }
    }

    private onMouseEnterMenuItem = (snakeName: string) => this.displayedSnake = snakeName

    public draw(x: number, y: number, menuDiameter: number) {
        this.drawSnakeMenuItems(x, y, menuDiameter)
        this.checkMouseOverMenu(x, y, menuDiameter)

        noStroke()
        fill(color(180))
        textAlign(CENTER, CENTER)

        if (this.displayedSnake) {
            this.drawCharacterInfo(x, y, menuDiameter)
        }
        else {
            this.drawAcions(x, y, menuDiameter)
        }
    }

    private drawAcions(x: number, y: number, menuDiameter: number) {
        textStyle(BOLD)
        textSize(menuDiameter * 0.07)
        text('select your characters', x, y)

        if (menu.selectedSnakes.length) {
            textStyle(NORMAL)
            textSize(menuDiameter * 0.04)
            text('press space to continue', x, y + menuDiameter * 0.22)
        }
    }

    private drawCharacterInfo(x: number, y: number, menuDiameter: number) {

        const snakeInfo = snakes.getInfo(this.displayedSnake || 'Bug')
        textStyle(BOLD)
        textSize(menuDiameter * 0.12)
        text(snakeInfo.name, x, y - menuDiameter * 0.3)
        textSize(menuDiameter * 0.06)
        text(snakeInfo.ability + ' ability', x, y + menuDiameter * 0.1)

        textStyle(NORMAL)
        rectMode(CENTER)
        textAlign(CENTER, TOP)
        textSize(menuDiameter * 0.03)
        text(snakeInfo.description, x, y + menuDiameter * 0.03, menuDiameter * 0.7, menuDiameter * 0.4)
        text(snakeInfo.abilityDescription, x, y + menuDiameter * 0.4, menuDiameter * 0.6, menuDiameter * 0.4)
    }

    private checkMouseOverMenu(x: number, y: number, menuDiameter: number) {
        const mousePos: Point = { x: mouseX, y: mouseY }
        const menuPos: Point = { x, y }
        const distance = distanceBetween(mousePos, menuPos, 0, menuDiameter)
        if (distance < 0) {
            delete this.displayedSnake
        }
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
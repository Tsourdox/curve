class CharacterMenu {
    private snakeMenuItems: CharacterMenuItem[]
    private displayedSnake?: string
    private showDefaultViewIn?: number

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
            this.snakeMenuItems.push(new CharacterMenuItem(snake, this.onMouseEnterMenuItem, this.onMouseLeaveMenuItem))
        }
    }

    private onMouseLeaveMenuItem = () => this.showDefaultViewIn = 1000
    private onMouseEnterMenuItem = (snakeName: string) => {
        this.displayedSnake = snakeName
        delete this.showDefaultViewIn
    }

    public draw(x: number, y: number, menuDiameter: number) {
        this.drawSnakeMenuItems(x, y, menuDiameter)
        this.checkMouseOverMenu(x, y, menuDiameter)

        noStroke()
        fill(color(180))
        textAlign(CENTER, CENTER)

        if (this.showDefaultViewIn) {
            this.showDefaultViewIn -= deltaTime
            if (this.showDefaultViewIn < 0) {
                delete this.displayedSnake
                delete this.showDefaultViewIn
            }
        }

        if (this.displayedSnake) {
            this.drawCharacterInfo(x, y, menuDiameter)
        } else {
            this.drawActions(x, y, menuDiameter)
        }
    }

    private drawActions(x: number, y: number, menuDiameter: number) {
        fill(color(180))
        textStyle(BOLD)
        textSize(menuDiameter * 0.08)

        if (menu.selectedSnakes.length) {
            if (menu.selectedSnakes.length >= 6) {
                this.snakeMenuItems[6].draw(x, y - menuDiameter * 0.1, menuDiameter)
            } else {
                text('characters selected', x, y)
                textSize(menuDiameter * 0.2)
                text(this.selectedSnakes.length, x, y - menuDiameter * 0.22)
            }
            fill(color(180))
            textStyle(NORMAL)
            textSize(menuDiameter * 0.05)
            text('press space to continue', x, y + menuDiameter * 0.22)
        } else {
            text('select your characters', x, y)
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
        textSize(menuDiameter * 0.035)
        text(snakeInfo.description, x, y + menuDiameter * 0.01, menuDiameter * 0.7, menuDiameter * 0.4)
        text(snakeInfo.abilityDescription, x, y + menuDiameter * 0.38, menuDiameter * 0.65, menuDiameter * 0.4)
    }

    private checkMouseOverMenu(x: number, y: number, menuDiameter: number) {
        const mousePos: Point = { x: mouseX, y: mouseY }
        const menuPos: Point = { x, y }
        const distance = distanceBetween(mousePos, menuPos, 0, menuDiameter)
        if (distance < 0) {
            if (this.displayedSnake == 'Tok') {
                if (this.showDefaultViewIn == undefined) {
                    this.showDefaultViewIn = 5000
                }
            } else {
                delete this.displayedSnake
                delete this.showDefaultViewIn
            }
        }
    }

    private drawSnakeMenuItems(x: number, y: number, menuDiameter: number) {
        const radius = menuDiameter * 0.7
        const nrOfItems = this.snakeMenuItems.length - 1
        let addedAngle = 0
        for(let i = 0; i < nrOfItems; i++) {
            const angle = 2 * PI / (nrOfItems + 4)
            const shift = -angle

            if (i == nrOfItems / 2) {
                addedAngle = angle * 2
            }

            let itemX = x + radius * cos(angle * i + shift + addedAngle)
            let itemY = y + radius * sin(angle * i + shift + addedAngle)

            this.snakeMenuItems[i].draw(itemX, itemY, menuDiameter)
        }
    }
}
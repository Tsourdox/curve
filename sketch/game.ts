class Game {
    private snakes: Snake[]
    private holes: Hole[]
    public isPaused: boolean
    public hasEnded: boolean

    private get objects(): GameObject[] {
        return [...this.snakes, ...this.holes]
    }

    constructor() {
        this.snakes = []
        this.holes = []
        this.isPaused = false
        this.hasEnded = false
        this.createHoles()
    }

    public update() {
        if (!this.isPaused || menu.isSetup) {
            for (const object of this.objects) {
                object.update()
            }

            if (!menu.isSetup){
                this.checkCollision()
                this.checkEndCondition()
            }
        }
    }

    public draw() {
        for (const object of this.objects) {
            object.draw()
        }
    }

    public resume() {
        if (!this.hasEnded) {
            this.isPaused = false
            music.playGameMusic()
        }
    }

    public pause() {
        this.isPaused = true
        music.playMenuMusic()
    }

    public reset() {
        this.isPaused = true
        this.hasEnded = false
        this.createSnakes(0)
        this.createHoles()
    }
    public restart() {
        this.isPaused = true
        this.hasEnded = false
        this.createSnakes(this.snakes.length)
        this.createHoles()
    }

    public createSnakes(nr: number) {
        this.snakes = Snakes.all.slice(0, nr)
    }

    public respawnHoleContaining(point: Point) {
        let holeContaingPoint: Hole | undefined
        this.holes.reverse()
        for (const hole of this.holes) {
            if (this.isCollision(point, hole.position, 0, hole.radius)) {
                holeContaingPoint = hole
                break
            }
        }
        this.holes.reverse()

        if (holeContaingPoint) {
            // Remove hole and add a new one
            this.holes.splice(this.holes.indexOf(holeContaingPoint), 1)
            this.holes.push(new Hole())
        }
    }

    private createHoles() {
        this.holes = [
            new Hole(), new Hole(), new Hole(),
            new Hole(), new Hole(), new Hole(),
            new Hole(), new Hole(), new Hole(),
            new Hole(), new Hole(), new Hole(),
            new Hole(), new Hole(), new Hole(),
            new Hole(), new Hole(), new Hole()
        ]
    }

    private checkEndCondition() {
        let isAllSnakesDead = this.snakes.reduce((isDead, snake) => isDead && !snake.isAlive, true)
        if (isAllSnakesDead) {
            this.hasEnded = true
            this.pause()
        }
    }

    private checkCollision() {
        for (const snake of this.snakes) {
            if (!snake.isAlive) {
                continue
            }

            // Check wall
            const { x, y } = snake.head
            if (x <= 0 || x >= width || y <= 0 || y >= height) {
                snake.isAlive = false
                gameSounds.end.play()
            }

            // Check other snakes
            for (const snake_2 of this.snakes) {
                if (snake.id == snake_2.id) {
                    continue
                }

                // optimize check by not calulating near by sections when far away
                for (const bodySection of snake_2.body) {
                    if (this.isCollision(snake.head, bodySection, snake.thickness, snake_2.thickness)) {
                        snake.isAlive = false
                        gameSounds.end.play()
                    }
                }
            }

            // Check holes
            for (const hole of this.holes) {
                if (this.isCollision(snake.head, hole.position, snake.thickness, hole.radius)) {
                    snake.isAlive = false
                    gameSounds.end.play()
                }
            }
        }
    }


    private isCollision(a: Point, b: Point, aRadius: number, bRadius: number): boolean {
        const dx = a.x - b.x
        const dy = a.y - b.y
        const distance = sqrt(dx * dx + dy * dy)
        const collisionDistance = (aRadius / 2) + (bRadius / 2)
        return distance < collisionDistance
    }
}
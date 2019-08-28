class Game {
    private readonly spawnInterval: number
    private snakes: Snake[]
    private holes: Hole[]
    public isPaused: boolean
    public hasEnded: boolean
    public isTimeFrozen: boolean
    public time: number

    constructor() {
        this.spawnInterval = 3
        this.snakes = []
        this.holes = []
        this.isPaused = false
        this.hasEnded = false
        this.isTimeFrozen = false
        this.time = 0
        this.createHoles()
    }

    public update() {
        if (!this.isPaused || menu.isSetup) {
            const newTime = this.time + deltaTime * 0.001

            for (const snake of this.snakes) {
                snake.update()
            }
            if (!this.isTimeFrozen) {
                for (const hole of this.holes) {
                    hole.update()
                }
            }

            const shouldSpawnHole = this.time % this.spawnInterval > newTime % this.spawnInterval
            if (shouldSpawnHole && !menu.isSetup) {
                this.holes.push(new Hole())
            }

            if (!menu.isSetup){
                this.checkCollision()
                this.checkEndCondition()
            }

            this.time = newTime
        }
    }

    public draw() {
        for (const snake of this.snakes) {
            snake.draw()
        }
        for (const hole of this.holes) {
            hole.draw(this.isTimeFrozen)
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
        this.restart()
        this.createSnakes(0)
    }

    public restart() {
        this.isPaused = true
        this.hasEnded = false
        this.isTimeFrozen = false
        this.time = 0
        this.createHoles()
        this.createSnakes(this.snakes.length)
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
                gameSounds.died.play()
            }

            // Check other snakes
            for (const snake_2 of this.snakes) {

                // optimize check by not calulating nearby sections when far away
                for (const bodySections of snake_2.body) {
                    let hasSkippedFirstFewPoints = snake.id != snake_2.id

                    for (let i = bodySections.length - 1; i >= 0; i--) {
                        const bodySection = bodySections[i]
                        const thickness = snake_2.readyForRebirth ? snake_2.thickness * 5: snake_2.thickness
                        if (this.isCollision(snake.head, bodySection, snake.thickness, thickness)) {
                            if (hasSkippedFirstFewPoints) {
                                if (snake_2.readyForRebirth) {
                                    snake_2.birth()
                                } else {
                                    snake.isAlive = false
                                    gameSounds.died.play()
                                }
                            }
                        } else {
                            hasSkippedFirstFewPoints = true
                        }
                    }
                }
            }

            // Check hole collisions
            for (const hole of this.holes) {
                if (snake.isBurning) {
                    for (const bodySections of snake.body) {
                        for (const bodySection of bodySections ) {
                            if (this.isCollision(bodySection, hole.position, snake.thickness, hole.radius)) {
                                hole.disappear()
                            }
                        }
                    }
                } else {
                    if (this.isCollision(snake.head, hole.position, snake.thickness, hole.radius)) {
                        if (this.isTimeFrozen) {
                            hole.disappear()
                            gameSounds.disappear.play()
                        } else {
                            snake.isAlive = false
                            gameSounds.died.play()
                        }
                    }
                }
            }

            // Remove holes
            const disappearingHoles: Hole[] = []
            for (const hole of this.holes) {
                if (hole.shouldDisappear) {
                    disappearingHoles.push(hole)
                }
            }
            for (const hole of disappearingHoles) {
                this.holes.splice(this.holes.indexOf(hole), 1)
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
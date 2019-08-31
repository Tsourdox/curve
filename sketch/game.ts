class Game {
    private readonly spawnInterval: number
    private snakes: Snake[]
    public holes: Hole[]
    public isPaused: boolean
    public hasEnded: boolean
    public time: number

    constructor() {
        this.spawnInterval = 3
        this.snakes = []
        this.holes = []
        this.isPaused = false
        this.hasEnded = false
        this.time = 0
        this.createHoles()
    }

    public get deadSnakes() {
        return this.snakes.filter((snake) => !snake.isAlive)
    }

    public update() {
        if (!this.isPaused || menu.isSetup) {
            const newTime = this.time + deltaTime * 0.001

            for (const snake of this.snakes) {
                snake.update()
            }
            for (const hole of this.holes) {
                hole.update()
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
            hole.draw()
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
        this.time = 0
        this.createHoles()
        this.createSnakes(this.snakes.length)
    }

    public createSnakes(nr: number) {
        this.snakes = Snakes.all.slice(0, nr)
    }

    public removeHoleContaining(point: Point, respawn?: boolean, all?: boolean) {
        let holesContaingPoint: Hole[] = []

        // Select from end of list so that the top most circle is removed
        this.holes.reverse()
        for (const hole of this.holes) {
            if (distanceBetween(point, hole.position, 0, hole.radius) < 0) {
                holesContaingPoint.push(hole)
                if (!all) {
                    break
                }
            }
        }
        this.holes.reverse()

        // Remove holes
        for (const hole of holesContaingPoint) {
            this.holes.splice(this.holes.indexOf(hole), 1)
            if (respawn) {
                this.holes.push(new Hole())
            }
        }
    }

    private createHoles() {
        this.holes = []
        for (let i = 0; i < 10; i ++ ) {
            this.holes.push(new Hole())
        }

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

            const maxDistanceBetweenParts = s(snake.speed)

            // Check wall
            const { x, y } = snake.head
            if (x <= 0 || x >= width || y <= 0 || y >= height) {
                snake.isAlive = false
                gameSounds.died.play()
            }

            // Check other snakes
            for (const snake_2 of this.snakes) {
                for (const bodySections of snake_2.body) {
                    let hasSkippedFirstFewPoints = snake.name != snake_2.name

                    for (let i = bodySections.length - 1; i >= 0; i--) {
                        const bodyPart = bodySections[i]
                        const thickness = snake_2.readyForRebirth ? snake_2.thickness * 5: snake_2.thickness
                        const distance = distanceBetween(snake.head, bodyPart, snake.thickness, thickness)

                        if (distance < 0) {
                            if (hasSkippedFirstFewPoints) {
                                if (snake_2.readyForRebirth) {
                                    snake_2.birth()
                                } else if (snake.effect == 'ghost' || snake_2.effect == 'ghost') {
                                    continue
                                } else {
                                    snake.isAlive = false
                                    gameSounds.died.play()
                                }
                            }
                        } else {
                            hasSkippedFirstFewPoints = true
                            // Skip points that never will collide
                            i -= Math.floor(distance / maxDistanceBetweenParts)
                        }
                    }
                }
            }

            // Check hole collisions
            let nicLeftGhostedHole = true
            for (const hole of this.holes) {
                if (snake.effect === 'burning') {
                    for (const bodySections of snake.body) {
                        for (let i = 0; i < bodySections.length; i++ ) {
                            const bodySection = bodySections[i]
                            const distance = distanceBetween(hole.position, bodySection, hole.radius, snake.thickness)

                            if (distance < 0) {
                                hole.disappear()
                            } else {
                                // Skip points that never will collide
                                i += Math.floor(distance / maxDistanceBetweenParts)
                            }
                        }
                    }
                } else {
                    const distance = distanceBetween(snake.head, hole.position, snake.thickness, hole.radius)
                    if (distance < 0) {
                        if (hole.effect === 'frozen') {
                            hole.disappear()
                            gameSounds.disappear.play()
                        } else if (hole.effect === 'ghosted' && snake.name === 'Nic') {
                            nicLeftGhostedHole = false
                            snake.enterPassiveGhostForm()
                        } else if (snake.effect === 'ghost') {
                            if (hole.effect !== 'ghosted') {
                                hole.effect = 'ghosted'
                            }
                        } else {
                            snake.isAlive = false
                            gameSounds.died.play()
                        }
                    }
                }
            }

            // Did Nic leave his ghosted holes?
            if (snake.name === 'Nic' && nicLeftGhostedHole) {
                snake.leavePassiveGhostForm()
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
}
class Game {
    private disappearedHolesCount: number
    private readonly baseInterval: number
    private spawnInterval: number
    public snakes: Snake[]
    public holes: Hole[]
    public isPaused: boolean
    public hasEnded: boolean
    public time: number

    public get score() {
        const holes = this.disappearedHolesCount || 1
        const snakes = this.snakes.length
        return round(this.time * holes / sqrt(snakes))
    }

    constructor(snakes: Snake[], isPaused = true) {
        this.baseInterval = 3
        this.spawnInterval = this.baseInterval
        this.snakes = snakes
        this.holes = []
        this.isPaused = isPaused
        this.hasEnded = false
        this.time = 0
        this.disappearedHolesCount = 0
        this.createHoles()
    }

    public get deadSnakes() {
        return this.snakes.filter((snake) => !snake.isAlive)
    }

    public update() {
        if (!this.isPaused || menu.setupStep == 'start') {
            const newTime = this.time + deltaTime * 0.001

            for (const snake of this.snakes) {
                snake.update()
            }
            for (const hole of this.holes) {
                hole.update()
            }

            if (!menu.isSetup){
                this.spawnHole(newTime)
                this.checkCollisions()
                this.checkEndCondition()
                this.removeHoles()
            }

            this.time = newTime
            this.spawnInterval -= this.spawnInterval * 0.0001
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

    public removeHoleContaining(point: Point, respawn?: boolean, all?: boolean) {
        // Select from end of list so that the top most circle is removed
        this.holes.reverse()
        for (const hole of this.holes) {
            if (distanceBetween(point, hole.position, 0, hole.radius) < 0) {
                this.removeHole(hole)

                if (respawn) {
                    this.holes.push(new Hole())
                }
                if (!all) {
                    break
                }
            }
        }
        this.holes.reverse()
    }

    private removeHoles() {
        this.holes.reverse()
        for (const hole of this.holes) {
            if (hole.shouldDisappear) {
                this.removeHole(hole)
            }
        }
        this.holes.reverse()
    }

    private removeHole(hole: Hole) {
        this.holes.splice(this.holes.indexOf(hole), 1)
        this.disappearedHolesCount++

        for (const snake of this.snakes) {
            delete snake.isInsideHoles[hole.id]
        }
    }

    private spawnHole(newTime: number) {
        if (!menu.isSetup) {
            const shouldSpawnHole = this.time % this.spawnInterval > newTime % this.spawnInterval
            if (shouldSpawnHole) {
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

    private checkCollisions() {
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
            const nonCollsionList = []
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
                        if (hole.state === 'frozen') {
                            hole.disappear()
                            gameSounds.disappear.play()
                        } else if (hole.state === 'ghosted' && snake.name === 'Nic') {
                            nicLeftGhostedHole = false
                            snake.enterPassiveGhostForm()
                        } else if (snake.effect === 'ghost') {
                            if (hole.state !== 'ghosted') {
                                hole.state = 'ghosted'
                            }
                        } else {
                            this.handleCollisionWithHole(snake, hole)
                        }
                    } else {
                        nonCollsionList.push(hole.id)
                    }
                }
            }

            // Did Nic leave his ghosted holes?
            if (snake.name === 'Nic' && nicLeftGhostedHole) {
                snake.leavePassiveGhostForm()
            }

            // Update if snake left holes
            for (const id of nonCollsionList) {
                delete snake.isInsideHoles[id]
            }
        }
    }

    private handleCollisionWithHole(snake: Snake, hole: Hole) {
        const outcome = random(1)
        const holeEffect = snake.isInsideHoles[hole.id]

        if (holeEffect === undefined) {
            if (outcome < 0.2) {
                snake.isAlive = false
                gameSounds.died.play()
            } else {
                snake.isInsideHoles[hole.id] = {
                    type: floor(random(3)),
                    time: 0,
                    delay: random(0.1, 0.6)
                }
            }
        } else if (holeEffect !== null) {
            holeEffect.time += deltaTime * 0.001

            if (holeEffect.time > holeEffect.delay) {
                snake.isInsideHoles[hole.id] = null

                if (holeEffect.type == HoleEffecType.teleport) {
                    const randomHole = this.holes[floor(random(this.holes.length))]
                    snake.body.pop()
                    snake.body.push([randomHole.position])
                    snake.isInsideHoles[randomHole.id] = null
                } else if (holeEffect.type == HoleEffecType.redirect) {
                    const randomDirection = random(1) * TWO_PI
                    snake.direction = randomDirection
                } else if (holeEffect.type == HoleEffecType.freeze) {
                    // implement freeze or other effect?
                } else {
                    // a small chance that nothing happens
                }

            }
        }
    }
}
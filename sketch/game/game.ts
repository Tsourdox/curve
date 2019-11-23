class Game {
    private readonly collisionSystem: CollisionSystem
    private readonly baseInterval: number
    private disappearedHolesCount: number
    private spawnInterval: number
    public snakes: Snake[]
    public holes: Hole[]
    public isPaused: boolean
    public hasEnded: boolean
    public time: number
    private endCheck: EndCheck

    public get score() {
        const holes = this.disappearedHolesCount || 1
        const snakes = this.snakes.length
        return round(this.time * holes / sqrt(snakes))
    }

    constructor(snakes: Snake[], isPaused = true) {
        this.collisionSystem = new CollisionSystem()
        this.baseInterval = 3
        this.spawnInterval = this.baseInterval
        this.snakes = snakes
        this.holes = []
        this.isPaused = isPaused
        this.hasEnded = false
        this.time = 0
        this.disappearedHolesCount = 0
        this.createHoles()
        this.endCheck = new EndCheck()
    }

    public get deadSnakes() {
        return this.snakes.filter((snake) => !snake.isAlive)
    }

    public update() {
        if (!this.isPaused || menu.setupStep == 'story') {
            const newTime = this.time + deltaTime * 0.001

            for (const snake of this.snakes) {
                snake.update()
            }
            for (const hole of this.holes) {
                hole.update()
            }

            if (!menu.isSetup){
                this.spawnHole(newTime)
                this.collisionSystem.update(this.snakes, this.holes)
                this.checkEndCondition()
                this.removeHoles()
            }

            this.time = newTime
            this.spawnInterval -= this.spawnInterval * 0.0001
            this.endCheck.update(this.snakes)
        } else {
            this.endCheck.update(this.snakes, this.isPaused)
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

    public removeHoleContaining(point: Point, respawn?: boolean, all?: boolean, diameter?: number) {
        // Select from end of list so that the top most circle is removed
        const holesToRemove: Hole[] = []
        for (const hole of this.holes) {
            if (distanceBetween(point, hole.position, diameter, hole.radius) < 0) {
                holesToRemove.push(hole)
                if (!all) {
                    break
                }
            }
        }

        for (const hole of holesToRemove) {
            this.removeHole(hole)
            if (respawn) {
                this.holes.push(new Hole())
            }
        }
    }

    private removeHoles() {
        const holesToRemove: Hole[] = []
        for (const hole of this.holes) {
            if (hole.isGone) {
                holesToRemove.push(hole)
            }
        }

        for (const hole of holesToRemove) {
            this.removeHole(hole)
        }
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
        if (this.endCheck.isGameOver) {
            this.holes.forEach((hole) => hole.state = 'ghosted')
            this.hasEnded = true
            this.pause()
            scoreboard.saveScore()
        }
    }
}
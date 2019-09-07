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
                this.collisionSystem.update(this.snakes, this.holes)
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
            if (hole.isGone) {
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
            scoreboard.saveScore()
        }
    }
}
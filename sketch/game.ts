class Game {
    private snakes: Snake[]
    private holes: Hole[]
    public isPaused: boolean

    private get objects(): GameObject[] {
        return [...this.snakes, ...this.holes]
    }

    constructor() {
        this.snakes = []
        this.holes = []
        this.isPaused = false
        this.createHoles()
    }

    public createSnakes(nr: number) {
        this.snakes = [
            new Snake('Olivia', 'yellow', {
                left: LEFT_ARROW,
                right: RIGHT_ARROW
            }),
            new Snake('David', 'red', {
                left: KEY_Z,
                right: KEY_X
            }),
            new Snake('Manooni', 'blue', {
                left: KEY_U,
                right: KEY_I
            }),
            new Snake('Spacy', 'green', {
                left: KEY_Q,
                right: KEY_W
            }),
            new Snake('Lilla MY', 'purple', {
                left: KEY_N,
                right: KEY_M
            }),
            new Snake('Bamse', 'orange', {
                left: KEY_R,
                right: KEY_T
            })
        ].slice(0, nr)
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

    public resetGame() {
        this.createSnakes(0)
        this.createHoles()
        this.isPaused = true
    }
    public restartGame() {
        this.createSnakes(this.snakes.length)
        this.createHoles()
        this.isPaused = true
    }

    public update() {
        if (!this.isPaused || menu.isSetup) {
            for (const object of this.objects) {
                object.update()
            }

            this.checkCollision();
        }
    }

    public draw() {
        for (const object of this.objects) {
            object.draw()
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
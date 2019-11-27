class CollisionSystem {
    private maxDistanceBetweenParts: number = 0

    public update(snakes: Snake[], holes: Hole[]) {
        for (const snake of snakes) {
            if (!snake.isAlive) {
                continue
            }

            this.maxDistanceBetweenParts = s(snake.speed)
            this.checkCollisionWithSnakes(snake, snakes)
            this.checkCollisionWithHole(snake, holes)
        }
    }

    private checkCollisionWithSnakes(snake: Snake, snakes: Snake[]) {
        for (const snake_2 of snakes) {

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
                            } else if (
                                snake.isProtected ||
                                snake.effect == 'ghost' ||
                                snake_2.effect == 'ghost' ||
                                snake.effect == 'glowing'
                            ) {
                                continue
                            } else {
                                snake.isAlive = false
                                gameSounds.died.play()
                                return
                            }
                        }
                    } else {
                        hasSkippedFirstFewPoints = true
                        // Skip points that never will collide
                        i -= Math.floor(distance / this.maxDistanceBetweenParts)
                    }
                }
            }
        }
    }

    private checkCollisionWithHole(snake: Snake, holes: Hole[]) {
        let nicLeftGhostedHole = true
            const nonCollsionList = []
            for (const hole of holes) {
                if (snake.effect === 'burning') {
                    for (const bodySections of snake.body) {
                        for (let i = 0; i < bodySections.length; i++ ) {
                            const bodySection = bodySections[i]
                            const snakeBurnRadius = snake.thickness * 5
                            const distance = distanceBetween(hole.position, bodySection, hole.radius, snakeBurnRadius)

                            if (distance < 0) {
                                hole.disappear()
                            } else {
                                // Skip points that never will collide
                                i += Math.floor(distance / this.maxDistanceBetweenParts)
                            }
                        }
                    }
                } else {
                    const distance = distanceBetween(snake.head, hole.position, snake.thickness, hole.radius)
                    if (distance < 0 && !hole.isDisappearing) {
                        if (hole.state === 'frozen' || snake.effect === 'glowing') {
                            hole.disappear()
                            gameSounds.disappear.play()
                        } else if (hole.state === 'ghosted' && snake.name === 'Nic') {
                            nicLeftGhostedHole = false
                            snake.enterPassiveGhostForm()
                        } else if (snake.effect === 'ghost') {
                            if (hole.state !== 'ghosted') {
                                hole.state = 'ghosted'
                            }
                        } else if (!snake.isProtected) {
                            this.handleCollisionWithHole(snake, hole, holes)
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

    private handleCollisionWithHole(snake: Snake, hole: Hole, holes: Hole[]) {
        const outcome = random(1)
        const holeEffect = snake.isInsideHoles[hole.id]

        if (holeEffect === undefined) {
            // 15% chance to die instantly
            if (outcome < .15) {
                snake.isAlive = false
                gameSounds.died.play()
            } else if (outcome < .75) {
                // 60% chance that an effect is applied
                snake.isInsideHoles[hole.id] = {
                    type: floor(random(2)),
                    time: 0,
                    delay: random(0.1, 0.6)
                }
            }
            // 25% chance that nothing happens
        } else if (holeEffect !== null) {
            holeEffect.time += deltaTime * 0.001

            if (holeEffect.time > holeEffect.delay) {
                snake.isInsideHoles[hole.id] = null
                this.applyHoleEffectToSnake(holeEffect, snake, holes)
            }
        }
    }

    private applyHoleEffectToSnake(holeEffect: HoleEffect, snake: Snake, holes: Hole[]) {
        switch(holeEffect.type) {
            case HoleEffecType['teleport']: {
                const randomHole = holes[floor(random(holes.length))]
                snake.body.pop()
                snake.body.push([randomHole.position])
                snake.isInsideHoles[randomHole.id] = null
            }
            case HoleEffecType['redirect']: {
                const randomDirection = random(1) * TWO_PI
                snake.direction = randomDirection
            }
            case HoleEffecType['cripple']: {
                snake.speed *= .85
            }
        }
    }
}
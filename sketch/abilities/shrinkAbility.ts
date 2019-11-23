class ShrinkAbility extends Ability {

    constructor(cooldown: number) {
        super('Shrink', cooldown)
    }

    protected applyEffect(snake: Snake): void {
        gameSounds.shrink.play()
        for (const hole of game.holes) {
            if (hole.state === 'ghosted') {
                hole.disappear()
            } else {
                const distance = distanceBetween(snake.head, hole.position)
                const limit = Math.min(width, height)
                const proximityValue = limit / Math.pow(distance, 2.5) * 100
                hole.shrink(1.2 + proximityValue)
            }
        }
    }
}
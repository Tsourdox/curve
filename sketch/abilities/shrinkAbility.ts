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
                hole.shrink()
            }
        }
    }
}
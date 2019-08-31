class ShrinkAbility extends Ability {

    constructor(cooldown: number) {
        super('Shrink', cooldown)
    }

    protected applyEffect(snake: Snake): void {
        gameSounds.shrink.play()
        for (const hole of game.holes) {
            hole.shrink()
        }
    }
}
class Snakes {
    public static get all() {
        return [
            new Snake('Bliz', 'blue', this.controls[0], new FreezeAbility(14, 2.4)),
            new Snake('Hell', 'red', this.controls[1], new BurnAbility(8, 1.7)),
            new Snake('Glow', 'yellow', this.controls[2], new RebirthAbility(4)),
            new Snake('Dash', 'green', this.controls[3], new TeleportAbility(2.5)),
            new Snake('Ouk', 'purple', this.controls[4], new ShrinkAbility(10)),
            new Snake('Nic', 'white', this.controls[5], new GhostAbility(13, 5)),
        ]
    }

    public static create(snakes: Snake[]) {
        const allSnakes = this.all
        return snakes.map((snake) => {
            switch (snake.name) {
                case 'Bliz': return allSnakes[0]
                case 'Hell': return allSnakes[1]
                case 'Glow': return allSnakes[2]
                case 'Dash': return allSnakes[3]
                case 'Ouk': return allSnakes[4]
                case 'Nic': return allSnakes[5]
                default: return allSnakes[5]
            }
        })
    }

    private static get controls(): Controls[] {
        return [
            { left: LEFT_ARROW, special: UP_ARROW, right: RIGHT_ARROW, asString: '← ↑ →' },
            { left: KEY_Z, special: KEY_X, right: KEY_C, asString: 'z x c' },
            { left: KEY_T, special: KEY_Y, right: KEY_U, asString: 't y u' },
            { left: KEY_Q, special: KEY_W, right: KEY_E, asString: 'q w e' },
            { left: KEY_B, special: KEY_N, right: KEY_M, asString: 'b n m' },
            { left: KEY_O, special: KEY_P, right: KEY_Å, asString: 'o p å' }
        ]
    }
}
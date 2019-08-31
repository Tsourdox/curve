class Snakes {
    public static get all() {
        return [
            new Snake('Nic', 'white', this.controls[5], new GhostAbility(13, 5)),
            new Snake('Bliz', 'blue', this.controls[0], new FreezeAbility(14, 2.4)),
            new Snake('Hell', 'red', this.controls[1], new BurnAbility(12, 1.7)),
            new Snake('Glow', 'yellow', this.controls[2], new RebirthAbility(4)),
            new Snake('Dash', 'green', this.controls[3], new TeleportAbility(4)),
            new Snake('Ouk', 'purple', this.controls[4], new ShrinkAbility(10)),
        ]
    }

    private static get controls() {
        return [
            { left: LEFT_ARROW, special: UP_ARROW, right: RIGHT_ARROW },
            { left: KEY_Z, special: KEY_X, right: KEY_C },
            { left: KEY_Y, special: KEY_U, right: KEY_I },
            { left: KEY_Q, special: KEY_W, right: KEY_E },
            { left: KEY_B, special: KEY_N, right: KEY_M },
            { left: KEY_P, special: KEY_Å, right: KEY_POW_CHAR, }
        ]
    }
}
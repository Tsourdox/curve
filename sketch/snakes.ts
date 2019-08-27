class Snakes {
    public static get all() {
        return [
            new Snake('Pod', 'blue',
                {
                    left: LEFT_ARROW,
                    special: UP_ARROW,
                    right: RIGHT_ARROW
                },
                new FreezeAbility(8, 1)
            ),
            new Snake('Mess', 'red',
                {
                    left: KEY_Z,
                    special: KEY_X,
                    right: KEY_C
                },
                new TeleportAbility(3)
            ),
            new Snake('Glow', 'yellow', {
                left: KEY_Y,
                special: KEY_U,
                right: KEY_I
            }),
            new Snake('Luce', 'green', {
                left: KEY_Q,
                right: KEY_W
            }),
            new Snake('Ouc', 'purple', {
                left: KEY_N,
                right: KEY_M
            }),
            new Snake('Triz', 'orange', {
                left: KEY_R,
                right: KEY_T
            })
        ]
    }
}
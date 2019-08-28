class Snakes {
    public static get all() {
        return [
            new Snake('Pod', 'blue',
                {
                    left: LEFT_ARROW,
                    special: UP_ARROW,
                    right: RIGHT_ARROW
                },
                new FreezeAbility(9, 1.3)
            ),
            new Snake('Mess', 'red',
                {
                    left: KEY_Z,
                    special: KEY_X,
                    right: KEY_C
                },
                new BurnAbility(14, 1.7)
            ),
            new Snake('Glow', 'yellow',
                {
                    left: KEY_Y,
                    special: KEY_U,
                    right: KEY_I
                },
                new TeleportAbility(2.5)
            ),
            new Snake('Luce', 'green',
                {
                    left: KEY_Q,
                    special: KEY_W,
                    right: KEY_E
                },
                new TeleportAbility(2.5))
            ,
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
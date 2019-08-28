class Snakes {
    public static get all() {
        return [
            new Snake('Pod', 'blue',
                {
                    left: LEFT_ARROW,
                    special: UP_ARROW,
                    right: RIGHT_ARROW
                },
                new FreezeAbility(10, 2.2)
            ),
            new Snake('Mess', 'red',
                {
                    left: KEY_Z,
                    special: KEY_X,
                    right: KEY_C
                },
                new BurnAbility(12, 1.7)
            ),
            new Snake('Glow', 'yellow',
                {
                    left: KEY_Y,
                    special: KEY_U,
                    right: KEY_I
                },
                new TeleportAbility(4)
            ),
            new Snake('Luce', 'green',
                {
                    left: KEY_Q,
                    special: KEY_W,
                    right: KEY_E
                },
                new TeleportAbility(4))
            ,
            new Snake('Ouc', 'purple',
                {
                    left: KEY_B,
                    special: KEY_N,
                    right: KEY_M
                },
                new FreezeAbility(6, 1.3)
            ),
            new Snake('Triz', 'orange',
                {
                    left: KEY_P,
                    special: KEY_Å,
                    right: KEY_POW_CHAR,
                },
                new BurnAbility(16, 2.5)
            )
        ]
    }
}
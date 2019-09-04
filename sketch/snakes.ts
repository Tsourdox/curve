class Snakes {

    private get newSnakes(): { [name: string]: Snake } {
        return {
            'Bliz': new Snake('Bliz', 'blue', this.controls[0], new FreezeAbility(14, 2.4)),
            'Hell': new Snake('Hell', 'red', this.controls[1], new BurnAbility(11, 1.7)),
            'Glow': new Snake('Glow', 'yellow', this.controls[2], new RebirthAbility(2)),
            'Dash': new Snake('Dash', 'green', this.controls[3], new TeleportAbility(2.5)),
            'Ouk': new Snake('Ouk', 'purple', this.controls[4], new ShrinkAbility(9)),
            'Nic': new Snake('Nic', 'white', this.controls[5], new GhostAbility(13, 5)),
        }
    }

    public get listAll() {
        const snakesObject = this.newSnakes
        return Object.keys(snakesObject).map((name) => snakesObject[name])
    }

    public create(snakes: Snake[]) {
        const newSnakes = this.newSnakes
        return snakes.map((snake) => newSnakes[snake.name])
    }

    public getInfo(name: string): SnakeInfo {
        switch (name) {
            case 'Bliz': return {
                name, ability: 'Freeze',
                description: 'Created out of a blizzard from another world. Bliz gained the power to control her surroundings and create calm where chaos previously existed.',
                abilityDescription: 'Freezes all Force Fields for 2.4 seconds. Frozen Force Fields are unstable and collapse upon impact.'
            }
            case 'Hell': return {
                name, ability: 'Burn',
                description: 'From the deepest part of this world, Hell itself, rose up to defend what was left and rid it of all Force Fields for good.',
                abilityDescription: 'Burns hellishly hot for just 1.7 seconds but vaporizes any Force Fields that comes into contact with him.'
            }
            case 'Glow': return {
                name, ability: 'Rebirth',
                description: 'When the last sun died due to the mysterius Force Fields, it gave birth to Glow. Being pure light she uses it to guide her but also to helps her friends.',
                abilityDescription: 'After a short delay revives nearby friends - or shrinks herself if no one needs to be reborn.'
            }
            case 'Dash': return {
                name, ability: 'Teleport',
                description: 'No one knows how it happened, she just entered our world from nowhere. Dash jumps from location to location, from world to world - through anything.',
                abilityDescription: 'Instantly jumps forward shattering any Force Fields at that location.'
            }
            case 'Ouk': return {
                name, ability: 'Collapse',
                description: 'A mystical creature with legendary powers beyond this world. Ouk is the last survivor of her kind and has the will to stop anything.',
                abilityDescription: 'Instantly alters the space-time continuum around all Force Fields, pushing them towards their imminent collapse.'
            }
            case 'Nic': return {
                name, ability: 'Ghost',
                description: 'A powerful ghost from ancient times, sworn to protect his world. Nic has the power to tap into his ancient magic and reveil what can not be seen.',
                abilityDescription: 'Enter a powerful ghost state for 5 seconds enchanting all Force Fields he touches. While in this state he passes through almost everything.'
            }
            default: return {
                name: 'Bug', ability: 'Crash',
                description: 'Has the ability to mess with the game, be careful human!',
                abilityDescription: 'Instanty crashes the game (probably).'
            }
        }
    }

    private get controls(): Controls[] {
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
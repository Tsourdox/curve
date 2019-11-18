class Snakes {

    private get newSnakes(): { [name: string]: Snake } {
        return {
            'Bliz': new Snake('Bliz', 'blue', this.controls[0], new FreezeAbility(14, 4)),
            'Hell': new Snake('Hell', 'red', this.controls[1], new BurnAbility(7, 1.7)),
            'Glow': new Snake('Glow', 'yellow', this.controls[2], new RebirthAbility(4)),
            'Dash': new Snake('Dash', 'green', this.controls[3], new TeleportAbility(1.5)),
            'Ouk': new Snake('Ouk', 'purple', this.controls[4], new ShrinkAbility(11)),
            'Nic': new Snake('Nic', 'white', this.controls[5], new GhostAbility(17, 7)),
            'Tok': new Snake('Tok', 'orange', this.controls[6], new TeleportAbility(1.5))
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
                abilityDescription: 'Freezes all Anomalies for 5 seconds. Frozen Anomalies are unstable and collapse upon impact.'
            }
            case 'Hell': return {
                name, ability: 'Burn',
                description: 'From the deepest part of this world, Hell itself, rose up to defend what was left and rid it of all the Anomalies for good.',
                abilityDescription: 'Burns hellishly hot for just 1.7 seconds but vaporizes any Anomalies that comes into contact with him.'
            }
            case 'Glow': return {
                name, ability: 'Rebirth',
                description: 'When the last sun died due to the mysterious Anomalies, it gave birth to Glow. Being pure light she uses it to guide her but also to help her friends.',
                abilityDescription: 'Revives the neareast friend after a short delay. During this delay Glow is invulnerable.'
            }
            case 'Dash': return {
                name, ability: 'Teleport',
                description: 'No one knows how it happened, she just entered our world from nowhere. Dash jumps from location to location, from world to world - through anything.',
                abilityDescription: 'Instantly jumps forward shattering any Anomalies at that location.'
            }
            case 'Ouk': return {
                name, ability: 'Collapse',
                description: 'A mystical creature with legendary powers beyond this world. Ouk is the last survivor of her kind and has the will to stop anything.',
                abilityDescription: 'Instantly alters the space-time continuum around all Anomalies, pushing them towards their imminent collapse.'
            }
            case 'Nic': return {
                name, ability: 'Ghost',
                description: 'A powerful ghost from ancient times, sworn to protect his world. Nic has the power to tap into his ancient magic and reveil what can not be seen.',
                abilityDescription: 'Enters a powerful ghost state for 4 seconds weakening all Anomalies he enters. While in this state he passes through everything.'
            }
            case 'Tok': return {
                name, ability: 'Tokit',
                description: 'A mysterias entity that entered this world through the first anomaly. At the beginning Tok tried to re-enter the Anomalies but could not - he just created more chaos.',
                abilityDescription: 'All players gets the ability to push holes. Holes pushed off screen has a chance to disappear forever.'
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
            { left: KEY_8, special: KEY_9, right: KEY_0, asString: '8 9 0' },
            { left: KEY_L, special: KEY_Ö, right: KEY_Ä, asString: 'l ö ä' },
        ]
    }
}
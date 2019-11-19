"use strict";
var backgroundColor;
var musicFiles;
var gameSounds;
var snakes;
var music;
var game;
var menu;
var mouse;
var scoreboard;
function preload() {
    var loadSound = window.loadSound;
    musicFiles = {
        menu: loadSound('./assets/music/mystic_drums.wav'),
        game: loadSound('./assets/music/birthofahero.mp3')
    };
    gameSounds = {
        died: loadSound('./assets/sounds/end.wav'),
        freeze: loadSound('./assets/sounds/freeze.wav'),
        teleport: loadSound('./assets/sounds/teleport.wav'),
        disappear: loadSound('./assets/sounds/disappear.wav'),
        burn: loadSound('./assets/sounds/burn.wav'),
        rebirth: loadSound('./assets/sounds/rebirth.wav'),
        shrink: loadSound('./assets/sounds/shrink.wav'),
        ghost: loadSound('./assets/sounds/ghost.wav'),
        warning: loadSound('./assets/sounds/warning.wav')
    };
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    noCursor();
    backgroundColor = color(20);
    gameSounds.died.setVolume(0.4);
    gameSounds.freeze.setVolume(1);
    gameSounds.teleport.setVolume(1);
    gameSounds.disappear.setVolume(0.5);
    gameSounds.burn.setVolume(0.5);
    gameSounds.rebirth.setVolume(0.5);
    gameSounds.shrink.setVolume(0.7);
    gameSounds.warning.setVolume(0.8);
    scoreboard = new ScoreBoard();
    snakes = new Snakes();
    music = new Music(musicFiles);
    game = new Game([]);
    menu = new Menu();
    mouse = new Mouse();
    window.userStartAudio().then(function () { return music.userStartAudio(); });
}
function draw() {
    background(backgroundColor);
    game.update();
    game.draw();
    menu.draw();
    mouse.draw();
}
function mouseClicked() {
    var mousePosition = { x: mouseX, y: mouseY };
    if (menu && menu.isSetup) {
        game.removeHoleContaining(mousePosition, true);
    }
}
function keyPressed() {
    if (!music || !menu || !game) {
        return;
    }
    if (keyCode == ENTER) {
        music.toggleMute();
    }
    if (menu.isSetup) {
        if (menu.setupStep == 'story') {
            if (keyCode == SPACE) {
                enterCharacterSelection();
            }
        }
        else if (menu.setupStep == 'selection') {
            if (keyCode == SPACE && menu.selectedSnakes.length > 0) {
                reloadGame();
            }
            if (keyCode == BACKSPACE) {
                showGameIntro();
            }
        }
    }
    else if (game.hasEnded) {
        if (keyCode == BACKSPACE) {
            enterCharacterSelection();
        }
        if (keyCode == SPACE) {
            reloadGame();
        }
        if (keyCode == KEY_0) {
            game.holes.forEach(function (hole) { return hole.state = 'ghosted'; });
        }
    }
    else if (game.isPaused) {
        if (keyCode == BACKSPACE) {
            enterCharacterSelection();
        }
        if (keyCode == SPACE) {
            game.resume();
        }
    }
    else {
        if (keyCode == SPACE) {
            game.pause();
        }
    }
    return false;
}
function reloadGame() {
    var newSnakes = snakes.create(menu.selectedSnakes);
    game = new Game(newSnakes);
    menu.setupStep = 'done';
}
function enterCharacterSelection() {
    menu.setupStep = 'selection';
    game = new Game([]);
}
function showGameIntro() {
    menu.replayStory();
}
var Music = (function () {
    function Music(musicFiles) {
        this.menuVolume = 0.1;
        this.gameVolume = 0.6;
        this.isMusicAllowed = false;
        this.musicFiles = musicFiles;
        musicFiles.menu.setLoop(true);
        musicFiles.game.setLoop(true);
        if (localStorage.isMusicMuted === undefined) {
            localStorage.setItem('isMusicMuted', JSON.stringify(true));
        }
        if (!!JSON.parse(localStorage.isMusicMuted)) {
            this.muteMusic();
        }
        else {
            this.unmuteMusic();
        }
    }
    Music.prototype.userStartAudio = function () {
        this.isMusicAllowed = true;
        if (menu.isSetup) {
            this.playMenuMusic();
        }
        else {
            this.playGameMusic();
        }
    };
    Music.prototype.toggleMute = function () {
        if (this.isMusicAllowed) {
            if (this.isMuted) {
                this.unmuteMusic();
            }
            else {
                this.muteMusic();
            }
        }
    };
    Object.defineProperty(Music.prototype, "isMuted", {
        get: function () {
            return !this.isMusicAllowed || !!JSON.parse(localStorage.isMusicMuted);
        },
        enumerable: true,
        configurable: true
    });
    Music.prototype.playMenuMusic = function () {
        var _a = this.musicFiles, menu = _a.menu, game = _a.game;
        if (game.isPlaying()) {
            game.stop();
        }
        menu.play();
    };
    Music.prototype.playGameMusic = function () {
        var _a = this.musicFiles, menu = _a.menu, game = _a.game;
        if (menu.isPlaying()) {
            menu.stop();
        }
        game.play();
    };
    Music.prototype.muteMusic = function () {
        musicFiles.menu.setVolume(0);
        musicFiles.game.setVolume(0);
        localStorage.setItem('isMusicMuted', JSON.stringify(true));
    };
    Music.prototype.unmuteMusic = function () {
        musicFiles.menu.setVolume(this.menuVolume);
        musicFiles.game.setVolume(this.gameVolume);
        localStorage.setItem('isMusicMuted', JSON.stringify(false));
    };
    return Music;
}());
var ScoreBoard = (function () {
    function ScoreBoard() {
        this.scores = this.loadScoreFromLocalStorage();
    }
    ScoreBoard.prototype.loadScoreFromLocalStorage = function () {
        return JSON.parse(localStorage.getItem('scoreboard') || '[]');
    };
    ScoreBoard.prototype.updateScoreInLocalStorage = function () {
        localStorage.scoreboard = JSON.stringify(this.scores);
    };
    ScoreBoard.prototype.saveScore = function () {
        var newScore = {
            score: game.score,
            players: game.snakes.map(function (snake) { return snake.name; })
        };
        this.scores.push(newScore);
        this.updateScoreInLocalStorage();
    };
    Object.defineProperty(ScoreBoard.prototype, "highScore", {
        get: function () {
            var highScore = 0;
            for (var _i = 0, _a = this.scores; _i < _a.length; _i++) {
                var data = _a[_i];
                highScore = max(data.score, highScore);
            }
            return highScore;
        },
        enumerable: true,
        configurable: true
    });
    return ScoreBoard;
}());
var Snakes = (function () {
    function Snakes() {
    }
    Object.defineProperty(Snakes.prototype, "newSnakes", {
        get: function () {
            return {
                'Bliz': new Snake('Bliz', 'blue', this.controls[0], new FreezeAbility(14, 4)),
                'Hell': new Snake('Hell', 'red', this.controls[1], new BurnAbility(7, 1.7)),
                'Glow': new Snake('Glow', 'yellow', this.controls[2], new RebirthAbility(4)),
                'Dash': new Snake('Dash', 'green', this.controls[3], new TeleportAbility(1.5)),
                'Ouk': new Snake('Ouk', 'purple', this.controls[4], new ShrinkAbility(11)),
                'Nic': new Snake('Nic', 'white', this.controls[5], new GhostAbility(17, 7)),
                'Tok': new Snake('Tok', 'orange', this.controls[6], new TeleportAbility(1.5))
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Snakes.prototype, "listAll", {
        get: function () {
            var snakesObject = this.newSnakes;
            return Object.keys(snakesObject).map(function (name) { return snakesObject[name]; });
        },
        enumerable: true,
        configurable: true
    });
    Snakes.prototype.create = function (snakes) {
        var newSnakes = this.newSnakes;
        return snakes.map(function (snake) { return newSnakes[snake.name]; });
    };
    Snakes.prototype.getInfo = function (name) {
        switch (name) {
            case 'Bliz': return {
                name: name, ability: 'Freeze',
                description: 'Created out of a blizzard from another world. Bliz gained the power to control her surroundings and create calm where chaos previously existed.',
                abilityDescription: 'Freezes all Anomalies for 5 seconds. Frozen Anomalies are unstable and collapse upon impact.'
            };
            case 'Hell': return {
                name: name, ability: 'Burn',
                description: 'From the deepest part of this world, Hell itself, rose up to defend what was left and rid it of all the Anomalies for good.',
                abilityDescription: 'Burns hellishly hot for just 1.7 seconds but vaporizes any Anomalies that comes into contact with him.'
            };
            case 'Glow': return {
                name: name, ability: 'Rebirth',
                description: 'When the last sun died due to the mysterious Anomalies, it gave birth to Glow. Being pure light she uses it to guide her but also to help her friends.',
                abilityDescription: 'Revives the neareast friend after a short delay. During this delay Glow is invulnerable.'
            };
            case 'Dash': return {
                name: name, ability: 'Teleport',
                description: 'No one knows how it happened, she just entered our world from nowhere. Dash jumps from location to location, from world to world - through anything.',
                abilityDescription: 'Instantly jumps forward shattering any Anomalies at that location.'
            };
            case 'Ouk': return {
                name: name, ability: 'Collapse',
                description: 'A mystical creature with legendary powers beyond this world. Ouk is the last survivor of her kind and has the will to stop anything.',
                abilityDescription: 'Instantly alters the space-time continuum around all Anomalies, pushing them towards their imminent collapse.'
            };
            case 'Nic': return {
                name: name, ability: 'Ghost',
                description: 'A powerful ghost from ancient times, sworn to protect his world. Nic has the power to tap into his ancient magic and reveil what can not be seen.',
                abilityDescription: 'Enters a powerful ghost state for 4 seconds weakening all Anomalies he enters. While in this state he passes through everything.'
            };
            case 'Tok': return {
                name: name, ability: 'Tokit',
                description: 'A mysterias entity that entered this world through the first anomaly. At the beginning Tok tried to re-enter the Anomalies but could not - he just created more chaos.',
                abilityDescription: 'All players gets the ability to push holes. Holes pushed off screen has a chance to disappear forever.'
            };
            default: return {
                name: 'Bug', ability: 'Crash',
                description: 'Has the ability to mess with the game, be careful human!',
                abilityDescription: 'Instanty crashes the game (probably).'
            };
        }
    };
    Object.defineProperty(Snakes.prototype, "controls", {
        get: function () {
            return [
                { left: LEFT_ARROW, special: UP_ARROW, right: RIGHT_ARROW, asString: '← ↑ →' },
                { left: KEY_Z, special: KEY_X, right: KEY_C, asString: 'z x c' },
                { left: KEY_T, special: KEY_Y, right: KEY_U, asString: 't y u' },
                { left: KEY_Q, special: KEY_W, right: KEY_E, asString: 'q w e' },
                { left: KEY_B, special: KEY_N, right: KEY_M, asString: 'b n m' },
                { left: KEY_8, special: KEY_9, right: KEY_0, asString: '8 9 0' },
                { left: KEY_L, special: KEY_Ö, right: KEY_Ä, asString: 'l ö ä' },
            ];
        },
        enumerable: true,
        configurable: true
    });
    return Snakes;
}());
var Ability = (function () {
    function Ability(name, cooldown) {
        this.name = name;
        this.cooldown = cooldown;
        this.timeToActivation = 0;
    }
    Object.defineProperty(Ability.prototype, "isReady", {
        get: function () {
            return !this.timeToActivation;
        },
        enumerable: true,
        configurable: true
    });
    Ability.prototype.use = function (snake) {
        if (this.isReady) {
            this.timeToActivation = this.cooldown;
            this.applyEffect(snake);
            return true;
        }
    };
    Ability.prototype.update = function (snake) {
        if (this.timeToActivation > 0) {
            var newTime = this.timeToActivation - deltaTime * 0.001;
            this.timeToActivation = Math.max(0, newTime);
        }
    };
    Ability.prototype.draw = function (snake, thickness) {
        this.drawCooldownCircle(snake, thickness);
    };
    Ability.prototype.drawCooldownCircle = function (snake, thickness) {
        noFill();
        strokeWeight(snake.thickness * 0.5);
        stroke(snake.activeColor);
        var _a = snake.head, x = _a.x, y = _a.y;
        var d = (thickness || snake.thickness) * 4;
        var startAngle = -HALF_PI;
        var endAngle = startAngle + (TWO_PI * (this.cooldown - this.timeToActivation) / this.cooldown);
        arc(x, y, d, d, startAngle, endAngle);
    };
    return Ability;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BurnAbility = (function (_super) {
    __extends(BurnAbility, _super);
    function BurnAbility(coldown, duration) {
        var _this = _super.call(this, 'Burn', coldown) || this;
        _this.time = 0;
        _this.duration = duration;
        _this.isActive = false;
        _this.particleSystems = [];
        _this.particleSystemMaxCount = 30;
        _this.indexOfLastSystem = 0;
        _this.baseIncrement = 30;
        _this.trimIndex = 1;
        return _this;
    }
    BurnAbility.prototype.applyEffect = function (snake) {
        this.isActive = true;
        gameSounds.burn.play();
        snake.effect = 'burning';
        snake.thickness *= 1.5;
        var strechedIncrement = round(snake.bodyParts.length / this.particleSystemMaxCount);
        var increment = max(this.baseIncrement, strechedIncrement);
        for (var i = 0; i < snake.bodyParts.length; i += increment) {
            this.addParticleSystem(snake.bodyParts[i], i);
        }
    };
    BurnAbility.prototype.addParticleSystem = function (position, index) {
        var x = position.x, y = position.y;
        var spawnRate = 0.8;
        var fire = new ParticleSystem(createVector(x, y), spawnRate, fireParticle);
        this.particleSystems.push(fire);
        this.indexOfLastSystem = index;
    };
    BurnAbility.prototype.trimParticleSystem = function () {
        if (this.trimIndex > this.indexOfLastSystem / 2) {
            this.trimIndex = 1;
        }
        this.particleSystems.splice(this.trimIndex, 1);
        this.trimIndex += 2;
    };
    BurnAbility.prototype.moveLastParticalSystemToHead = function (snake) {
        var _a = snake.head, x = _a.x, y = _a.y;
        var lastParticalSystem = this.particleSystems[this.particleSystems.length - 1];
        lastParticalSystem.updateOrigin(createVector(x, y));
    };
    BurnAbility.prototype.update = function (snake) {
        _super.prototype.update.call(this);
        if (this.isActive) {
            this.time += deltaTime * 0.001;
            this.moveLastParticalSystemToHead(snake);
            if (snake.bodyParts.length - this.indexOfLastSystem > this.baseIncrement) {
                this.addParticleSystem(snake.head, snake.bodyParts.length);
                this.trimParticleSystem();
            }
            if (this.time > this.duration) {
                this.isActive = false;
                this.time = 0;
                snake.effect = 'none';
                snake.thickness /= 1.5;
                this.particleSystems = [];
            }
        }
    };
    BurnAbility.prototype.draw = function (snake) {
        _super.prototype.draw.call(this, snake);
        if (this.isActive) {
            for (var _i = 0, _a = this.particleSystems; _i < _a.length; _i++) {
                var particleSystem = _a[_i];
                particleSystem.run();
            }
        }
    };
    return BurnAbility;
}(Ability));
var DelayedAbility = (function (_super) {
    __extends(DelayedAbility, _super);
    function DelayedAbility(name, cooldown, delay) {
        var _this = _super.call(this, name, cooldown) || this;
        _this.delay = delay;
        _this.time = 0;
        _this.isActivated = false;
        return _this;
    }
    DelayedAbility.prototype.use = function (snake) {
        if (!this.isActivated) {
            this.isActivated = !!_super.prototype.use.call(this, snake);
        }
    };
    DelayedAbility.prototype.update = function (snake) {
        if (this.isActivated) {
            if (this.time > this.delay) {
                this.isActivated = false;
                this.time = 0;
            }
            this.time += deltaTime * 0.001;
        }
        else {
            _super.prototype.update.call(this, snake);
        }
    };
    DelayedAbility.prototype.draw = function (snake) {
        var thickness = snake.thickness + (snake.isAlive ? 1 * pow(this.time, 3) : 0);
        _super.prototype.draw.call(this, snake, thickness);
    };
    return DelayedAbility;
}(Ability));
var FreezeAbility = (function (_super) {
    __extends(FreezeAbility, _super);
    function FreezeAbility(coldown, duration) {
        var _this = _super.call(this, 'Freeze', coldown) || this;
        _this.time = 0;
        _this.duration = duration;
        _this.isActive = false;
        _this.particleSystems = [];
        return _this;
    }
    FreezeAbility.prototype.applyEffect = function () {
        this.isActive = true;
        gameSounds.freeze.play();
        for (var index in game.holes) {
            var hole = game.holes[index];
            if (hole.state === 'ghosted') {
                hole.disappear();
            }
            else {
                hole.state = 'frozen';
            }
        }
        for (var _i = 0, _a = game.snakes; _i < _a.length; _i++) {
            var snake = _a[_i];
            var _b = snake.head, x = _b.x, y = _b.y;
            this.particleSystems.push(new ParticleSystem(createVector(x, y), 0.01, snowParticle));
        }
    };
    FreezeAbility.prototype.update = function (snake) {
        _super.prototype.update.call(this, snake);
        if (this.isActive) {
            this.time += deltaTime * 0.001;
            for (var index in game.snakes) {
                var snake_1 = game.snakes[index];
                var _a = snake_1.head, x = _a.x, y = _a.y;
                this.particleSystems[index].updateOrigin(createVector(x, y));
            }
            for (var _i = 0, _b = this.particleSystems; _i < _b.length; _i++) {
                var particleSystem = _b[_i];
                particleSystem.run();
            }
            if (this.time > this.duration) {
                this.isActive = false;
                this.time = 0;
                this.particleSystems = [];
                this.unfreezeHoles();
            }
        }
    };
    FreezeAbility.prototype.unfreezeHoles = function () {
        for (var _i = 0, _a = game.holes; _i < _a.length; _i++) {
            var hole = _a[_i];
            hole.state = 'none';
        }
    };
    return FreezeAbility;
}(Ability));
var GhostAbility = (function (_super) {
    __extends(GhostAbility, _super);
    function GhostAbility(coldown, duration) {
        var _this = _super.call(this, 'Ghost', coldown) || this;
        _this.time = 0;
        _this.duration = duration;
        _this.isActive = false;
        _this.isPassive = false;
        return _this;
    }
    GhostAbility.prototype.applyEffect = function (snake, passive) {
        if (!this.isActive && !this.isPassive) {
            if (snake.bodySection.length > 1) {
                var snakeHead = snake.bodyParts.pop();
                snakeHead && snake.body.push([snakeHead]);
            }
            snake.effect = 'ghost';
            snake.isInsideHoles = {};
            gameSounds.ghost.play();
        }
        if (passive) {
            this.isPassive = true;
        }
        else {
            this.isActive = true;
        }
    };
    GhostAbility.prototype.enterPassiveGhostForm = function (snake) {
        if (!this.isPassive) {
            this.applyEffect(snake, true);
        }
    };
    GhostAbility.prototype.leavePassiveGhostForm = function (snake) {
        if (this.isPassive) {
            this.isPassive = false;
            if (!this.isActive) {
                snake.effect = 'none';
            }
        }
    };
    GhostAbility.prototype.update = function (snake) {
        _super.prototype.update.call(this);
        if (this.isActive) {
            this.time += deltaTime * 0.001;
            if (this.time > this.duration) {
                this.isActive = false;
                this.time = 0;
                if (!this.isPassive) {
                    snake.effect = 'none';
                }
            }
            this.shift(snake);
        }
        else if (this.isPassive) {
            this.shift(snake);
        }
    };
    GhostAbility.prototype.shift = function (snake) {
        if (snake.isAlive) {
            if (snake.bodySection.length === 1) {
                var head = snake.body.pop();
                snake.body.pop();
                snake.body.push(head);
            }
            else {
                snake.bodySection.shift();
            }
        }
    };
    return GhostAbility;
}(Ability));
var RebirthAbility = (function (_super) {
    __extends(RebirthAbility, _super);
    function RebirthAbility(cooldown) {
        var _this = _super.call(this, 'Rebirth', cooldown, 1.5) || this;
        _this.particleSystemMaxCount = 100;
        _this.particleSystems = [];
        return _this;
    }
    RebirthAbility.prototype.applyEffect = function (snake) {
        this.particleSystems = [];
        gameSounds.rebirth.play();
        snake.effect = 'glowing';
    };
    RebirthAbility.prototype.update = function (snake) {
        if (this.isActivated) {
            if (this.time > this.delay) {
                var snakeToBirth = this.findSnakeToRebirth(snake);
                if (snakeToBirth) {
                    if (snakeToBirth.isAlive) {
                        this.initParticleEffect(snakeToBirth);
                        this.shiftSnake(snakeToBirth);
                    }
                    else {
                        this.initParticleEffect(snakeToBirth, true);
                        snakeToBirth.birth();
                    }
                }
                else {
                    this.initParticleEffect(snake);
                    this.shiftSnake(snake);
                }
                snake.effect = 'none';
            }
        }
        _super.prototype.update.call(this, snake);
    };
    RebirthAbility.prototype.draw = function (snake) {
        _super.prototype.draw.call(this, snake);
        for (var _i = 0, _a = this.particleSystems; _i < _a.length; _i++) {
            var particleSystem = _a[_i];
            particleSystem.run();
        }
    };
    RebirthAbility.prototype.findSnakeToRebirth = function (snake) {
        var closestSnake;
        var distanceToClosestSnake = Number.MAX_VALUE;
        for (var _i = 0, _a = game.snakes; _i < _a.length; _i++) {
            var snake2 = _a[_i];
            if (snake === snake2 && snake.isAlive) {
                continue;
            }
            var distanceToDeadSnake = distanceBetween(snake.head, snake2.head);
            if (distanceToDeadSnake < distanceToClosestSnake) {
                closestSnake = snake2;
                distanceToClosestSnake = distanceToDeadSnake;
            }
        }
        if (distanceToClosestSnake < s(400)) {
            return closestSnake;
        }
    };
    RebirthAbility.prototype.shiftSnake = function (snake) {
        var shiftLength = round(snake.bodyParts.length * 0.9);
        while (shiftLength > 0) {
            snake.body[0].shift();
            if (!snake.body[0].length) {
                snake.body.shift();
            }
            shiftLength--;
        }
    };
    RebirthAbility.prototype.initParticleEffect = function (snake, whole) {
        if (whole === void 0) { whole = false; }
        var shiftLength = round(snake.bodyParts.length * (whole ? 1 : 0.9));
        var strechedIncrement = ceil(snake.bodyParts.length / this.particleSystemMaxCount);
        var increment = min(10, strechedIncrement);
        for (var i = 0; i < shiftLength; i += increment) {
            this.addParticleSystem(snake.bodyParts[i]);
        }
    };
    RebirthAbility.prototype.addParticleSystem = function (position) {
        var x = position.x, y = position.y;
        var spawnRate = 0.1;
        var lifespan = 0.1;
        var glow = new ParticleSystem(createVector(x, y), spawnRate, glowParticle, lifespan, 0);
        this.particleSystems.push(glow);
    };
    return RebirthAbility;
}(DelayedAbility));
var ShrinkAbility = (function (_super) {
    __extends(ShrinkAbility, _super);
    function ShrinkAbility(cooldown) {
        return _super.call(this, 'Shrink', cooldown) || this;
    }
    ShrinkAbility.prototype.applyEffect = function (snake) {
        gameSounds.shrink.play();
        for (var _i = 0, _a = game.holes; _i < _a.length; _i++) {
            var hole = _a[_i];
            if (hole.state === 'ghosted') {
                hole.disappear();
            }
            else {
                hole.shrink();
            }
        }
    };
    return ShrinkAbility;
}(Ability));
var TeleportAbility = (function (_super) {
    __extends(TeleportAbility, _super);
    function TeleportAbility(cooldown) {
        return _super.call(this, 'Teleport', cooldown) || this;
    }
    TeleportAbility.prototype.applyEffect = function (snake) {
        var _a = snake.head, x = _a.x, y = _a.y;
        var newLocation = {
            x: modulo((x + cos(snake.direction) * s(100)), width),
            y: modulo((y + sin(snake.direction) * s(100)), height)
        };
        game.removeHoleContaining(newLocation, false, true, s(100));
        gameSounds.teleport.play();
        if (snake.bodySection.length == 1) {
            snake.body.pop();
        }
        snake.body.push([newLocation]);
        var origin = createVector(newLocation.x, newLocation.y);
        this.particleSystem = new ParticleSystem(origin, 0.00001, teleportParticle, 0.01);
    };
    TeleportAbility.prototype.draw = function (snake, thickness) {
        _super.prototype.draw.call(this, snake, thickness);
        if (this.particleSystem) {
            this.particleSystem.run();
        }
    };
    return TeleportAbility;
}(Ability));
var CollisionSystem = (function () {
    function CollisionSystem() {
        this.maxDistanceBetweenParts = 0;
    }
    CollisionSystem.prototype.update = function (snakes, holes) {
        for (var _i = 0, snakes_1 = snakes; _i < snakes_1.length; _i++) {
            var snake = snakes_1[_i];
            if (!snake.isAlive) {
                continue;
            }
            this.maxDistanceBetweenParts = s(snake.speed);
            this.checkCollisionWithSnakes(snake, snakes);
            this.checkCollisionWithHole(snake, holes);
        }
    };
    CollisionSystem.prototype.checkCollisionWithSnakes = function (snake, snakes) {
        for (var _i = 0, snakes_2 = snakes; _i < snakes_2.length; _i++) {
            var snake_2 = snakes_2[_i];
            for (var _a = 0, _b = snake_2.body; _a < _b.length; _a++) {
                var bodySections = _b[_a];
                var hasSkippedFirstFewPoints = snake.name != snake_2.name;
                for (var i = bodySections.length - 1; i >= 0; i--) {
                    var bodyPart = bodySections[i];
                    var thickness = snake_2.readyForRebirth ? snake_2.thickness * 5 : snake_2.thickness;
                    var distance = distanceBetween(snake.head, bodyPart, snake.thickness, thickness);
                    if (distance < 0) {
                        if (hasSkippedFirstFewPoints) {
                            if (snake_2.readyForRebirth) {
                                snake_2.birth();
                            }
                            else if (snake.isProtected ||
                                snake.effect == 'ghost' ||
                                snake_2.effect == 'ghost' ||
                                snake.effect == 'glowing') {
                                continue;
                            }
                            else {
                                snake.isAlive = false;
                                gameSounds.died.play();
                            }
                        }
                    }
                    else {
                        hasSkippedFirstFewPoints = true;
                        i -= Math.floor(distance / this.maxDistanceBetweenParts);
                    }
                }
            }
        }
    };
    CollisionSystem.prototype.checkCollisionWithHole = function (snake, holes) {
        var nicLeftGhostedHole = true;
        var nonCollsionList = [];
        for (var _i = 0, holes_1 = holes; _i < holes_1.length; _i++) {
            var hole = holes_1[_i];
            if (snake.effect === 'burning') {
                for (var _a = 0, _b = snake.body; _a < _b.length; _a++) {
                    var bodySections = _b[_a];
                    for (var i = 0; i < bodySections.length; i++) {
                        var bodySection = bodySections[i];
                        var snakeBurnRadius = snake.thickness * 5;
                        var distance = distanceBetween(hole.position, bodySection, hole.radius, snakeBurnRadius);
                        if (distance < 0) {
                            hole.disappear();
                        }
                        else {
                            i += Math.floor(distance / this.maxDistanceBetweenParts);
                        }
                    }
                }
            }
            else {
                var distance = distanceBetween(snake.head, hole.position, snake.thickness, hole.radius);
                if (distance < 0 && !hole.isDisappearing) {
                    if (hole.state === 'frozen' || snake.effect === 'glowing') {
                        hole.disappear();
                        gameSounds.disappear.play();
                    }
                    else if (hole.state === 'ghosted' && snake.name === 'Nic') {
                        nicLeftGhostedHole = false;
                        snake.enterPassiveGhostForm();
                    }
                    else if (snake.effect === 'ghost') {
                        if (hole.state !== 'ghosted') {
                            hole.state = 'ghosted';
                        }
                    }
                    else if (!snake.isProtected) {
                        this.handleCollisionWithHole(snake, hole, holes);
                    }
                }
                else {
                    nonCollsionList.push(hole.id);
                }
            }
        }
        if (snake.name === 'Nic' && nicLeftGhostedHole) {
            snake.leavePassiveGhostForm();
        }
        for (var _c = 0, nonCollsionList_1 = nonCollsionList; _c < nonCollsionList_1.length; _c++) {
            var id = nonCollsionList_1[_c];
            delete snake.isInsideHoles[id];
        }
    };
    CollisionSystem.prototype.handleCollisionWithHole = function (snake, hole, holes) {
        var outcome = random(1);
        var holeEffect = snake.isInsideHoles[hole.id];
        if (holeEffect === undefined) {
            if (outcome < 0.2) {
                snake.isAlive = false;
                gameSounds.died.play();
            }
            else {
                snake.isInsideHoles[hole.id] = {
                    type: floor(random(3)),
                    time: 0,
                    delay: random(0.1, 0.6)
                };
            }
        }
        else if (holeEffect !== null) {
            holeEffect.time += deltaTime * 0.001;
            if (holeEffect.time > holeEffect.delay) {
                snake.isInsideHoles[hole.id] = null;
                if (holeEffect.type == HoleEffecType.teleport) {
                    var randomHole = holes[floor(random(holes.length))];
                    snake.body.pop();
                    snake.body.push([randomHole.position]);
                    snake.isInsideHoles[randomHole.id] = null;
                }
                else if (holeEffect.type == HoleEffecType.redirect) {
                    var randomDirection = random(1) * TWO_PI;
                    snake.direction = randomDirection;
                }
                else if (holeEffect.type == HoleEffecType.freeze) {
                }
                else {
                }
            }
        }
    };
    return CollisionSystem;
}());
var EndCheck = (function () {
    function EndCheck() {
        this.WARNING_START_TIME = 15000;
        this.WARNING_SOUND_START_TIME = 16400;
        this.WARNING_END_TIME = 30000;
        this._isGameOver = false;
        this.timeAlone = 0;
    }
    Object.defineProperty(EndCheck.prototype, "isGameOver", {
        get: function () {
            return this._isGameOver;
        },
        enumerable: true,
        configurable: true
    });
    EndCheck.prototype.update = function (snakes, isGamePaused) {
        if (this.isWarningActive) {
            if (isGamePaused && gameSounds.warning.isPlaying()) {
                gameSounds.warning.pause();
            }
            if (!isGamePaused && gameSounds.warning.isPaused()) {
                gameSounds.warning.play();
            }
        }
        if (!isGamePaused) {
            var nextTimeAlone = this.timeAlone + deltaTime;
            var aliveSnakes = snakes.filter(function (snake) { return snake.isAlive; });
            if (aliveSnakes.length == 1 && snakes.length > 1) {
                if (nextTimeAlone > this.WARNING_START_TIME) {
                    this.alternateWarning();
                }
                var time = this.WARNING_SOUND_START_TIME;
                if (nextTimeAlone >= time && this.timeAlone < time) {
                    gameSounds.warning.play();
                }
            }
            else {
                if (gameSounds.warning.isPlaying()) {
                    gameSounds.warning.stop();
                }
                nextTimeAlone = 0;
            }
            if (this.isAllSnakesDead(snakes) || this.timeAlone > this.WARNING_END_TIME) {
                if (gameSounds.warning.isPlaying()) {
                    gameSounds.warning.stop();
                }
                this._isGameOver = true;
            }
            this.timeAlone = nextTimeAlone;
        }
    };
    EndCheck.prototype.alternateWarning = function () {
        var stregth = (this.timeAlone) * 0.0004;
        var speed = (this.timeAlone) * 0.004;
        var alternatingValue = map(sin(speed), -1, 1, 0, stregth);
        noStroke();
        fill(255, 0, 0, alternatingValue);
        rectMode('corner');
        rect(0, 0, width, height);
    };
    EndCheck.prototype.isAllSnakesDead = function (snakes) {
        return snakes.reduce(function (isDead, snake) { return isDead && !snake.isAlive; }, true);
    };
    Object.defineProperty(EndCheck.prototype, "isWarningActive", {
        get: function () {
            return this.timeAlone > this.WARNING_START_TIME;
        },
        enumerable: true,
        configurable: true
    });
    return EndCheck;
}());
var Game = (function () {
    function Game(snakes, isPaused) {
        if (isPaused === void 0) { isPaused = true; }
        this.collisionSystem = new CollisionSystem();
        this.baseInterval = 3;
        this.spawnInterval = this.baseInterval;
        this.snakes = snakes;
        this.holes = [];
        this.isPaused = isPaused;
        this.hasEnded = false;
        this.time = 0;
        this.disappearedHolesCount = 0;
        this.createHoles();
        this.endCheck = new EndCheck();
    }
    Object.defineProperty(Game.prototype, "score", {
        get: function () {
            var holes = this.disappearedHolesCount || 1;
            var snakes = this.snakes.length;
            return round(this.time * holes / sqrt(snakes));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "deadSnakes", {
        get: function () {
            return this.snakes.filter(function (snake) { return !snake.isAlive; });
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.update = function () {
        if (!this.isPaused || menu.setupStep == 'story') {
            var newTime = this.time + deltaTime * 0.001;
            for (var _i = 0, _a = this.snakes; _i < _a.length; _i++) {
                var snake = _a[_i];
                snake.update();
            }
            for (var _b = 0, _c = this.holes; _b < _c.length; _b++) {
                var hole = _c[_b];
                hole.update();
            }
            if (!menu.isSetup) {
                this.spawnHole(newTime);
                this.collisionSystem.update(this.snakes, this.holes);
                this.checkEndCondition();
                this.removeHoles();
            }
            this.time = newTime;
            this.spawnInterval -= this.spawnInterval * 0.0001;
            this.endCheck.update(this.snakes);
        }
        else {
            this.endCheck.update(this.snakes, this.isPaused);
        }
    };
    Game.prototype.draw = function () {
        for (var _i = 0, _a = this.snakes; _i < _a.length; _i++) {
            var snake = _a[_i];
            snake.draw();
        }
        for (var _b = 0, _c = this.holes; _b < _c.length; _b++) {
            var hole = _c[_b];
            hole.draw();
        }
    };
    Game.prototype.resume = function () {
        if (!this.hasEnded) {
            this.isPaused = false;
            music.playGameMusic();
        }
    };
    Game.prototype.pause = function () {
        this.isPaused = true;
        music.playMenuMusic();
    };
    Game.prototype.removeHoleContaining = function (point, respawn, all, diameter) {
        var holesToRemove = [];
        for (var _i = 0, _a = this.holes; _i < _a.length; _i++) {
            var hole = _a[_i];
            if (distanceBetween(point, hole.position, diameter, hole.radius) < 0) {
                holesToRemove.push(hole);
                if (!all) {
                    break;
                }
            }
        }
        for (var _b = 0, holesToRemove_1 = holesToRemove; _b < holesToRemove_1.length; _b++) {
            var hole = holesToRemove_1[_b];
            this.removeHole(hole);
            if (respawn) {
                this.holes.push(new Hole());
            }
        }
    };
    Game.prototype.removeHoles = function () {
        var holesToRemove = [];
        for (var _i = 0, _a = this.holes; _i < _a.length; _i++) {
            var hole = _a[_i];
            if (hole.isGone) {
                holesToRemove.push(hole);
            }
        }
        for (var _b = 0, holesToRemove_2 = holesToRemove; _b < holesToRemove_2.length; _b++) {
            var hole = holesToRemove_2[_b];
            this.removeHole(hole);
        }
    };
    Game.prototype.removeHole = function (hole) {
        this.holes.splice(this.holes.indexOf(hole), 1);
        this.disappearedHolesCount++;
        for (var _i = 0, _a = this.snakes; _i < _a.length; _i++) {
            var snake = _a[_i];
            delete snake.isInsideHoles[hole.id];
        }
    };
    Game.prototype.spawnHole = function (newTime) {
        if (!menu.isSetup) {
            var shouldSpawnHole = this.time % this.spawnInterval > newTime % this.spawnInterval;
            if (shouldSpawnHole) {
                this.holes.push(new Hole());
            }
        }
    };
    Game.prototype.createHoles = function () {
        this.holes = [];
        for (var i = 0; i < 10; i++) {
            this.holes.push(new Hole());
        }
    };
    Game.prototype.checkEndCondition = function () {
        if (this.endCheck.isGameOver) {
            this.hasEnded = true;
            this.pause();
            scoreboard.saveScore();
        }
    };
    return Game;
}());
var GameObject = (function () {
    function GameObject() {
    }
    return GameObject;
}());
var Hole = (function (_super) {
    __extends(Hole, _super);
    function Hole() {
        var _this = _super.call(this) || this;
        _this.id = random(99999999).toFixed();
        _this.color = color(random(30, 100), random(30, 100), random(30, 100));
        _this.colorFrozened = color(random(40), random(40), random(80, 120));
        _this.colorGhosted = color(_this.color.toString().replace(',1)', ',0.2)'));
        _this.baseRadius = random(50, 200);
        _this.morphLimit = random(10, _this.baseRadius * 0.8);
        _this.morphSpeed = random(0.1, 1);
        _this.morphValue = _this.baseRadius * -1;
        _this.isIncreasing = true;
        _this.state = 'none';
        _this.shouldDisappear = false;
        _this._position = {
            x: random(width) / width,
            y: random(height) / height
        };
        return _this;
    }
    Object.defineProperty(Hole.prototype, "isGone", {
        get: function () {
            return this.radius < 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hole.prototype, "isDisappearing", {
        get: function () {
            return this.shouldDisappear;
        },
        enumerable: true,
        configurable: true
    });
    Hole.prototype.shrink = function () {
        this.baseRadius *= 0.75;
        if (this.baseRadius < 10) {
            this.shouldDisappear = true;
        }
    };
    Object.defineProperty(Hole.prototype, "radius", {
        get: function () {
            return s(this.baseRadius + this.morphValue);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Hole.prototype, "position", {
        get: function () {
            return {
                x: this._position.x * width,
                y: this._position.y * height
            };
        },
        enumerable: true,
        configurable: true
    });
    Hole.prototype.update = function () {
        if (this.shouldDisappear) {
            this.baseRadius -= 20;
        }
        else if (this.state !== 'frozen') {
            this.updateMorphValue();
        }
    };
    Hole.prototype.draw = function () {
        var _a = this.position, x = _a.x, y = _a.y;
        noStroke();
        switch (this.state) {
            case 'frozen':
                fill(this.colorFrozened);
                break;
            case 'ghosted':
                fill(this.colorGhosted);
                break;
            default: fill(this.color);
        }
        circle(x, y, this.radius);
    };
    Hole.prototype.disappear = function () {
        this.shouldDisappear = true;
    };
    Hole.prototype.updateMorphValue = function () {
        if (this.isIncreasing) {
            this.morphValue += this.morphSpeed;
            if (this.morphValue > this.morphLimit) {
                this.isIncreasing = false;
            }
        }
        else {
            this.morphValue -= this.morphSpeed;
            if (this.morphValue < 0) {
                this.isIncreasing = true;
            }
        }
    };
    return Hole;
}(GameObject));
var Snake = (function (_super) {
    __extends(Snake, _super);
    function Snake(name, _color, controls, ability) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.color = color(_color);
        _this.colorGhosted = color(_this.color.toString().replace(',1)', ',0.2)'));
        _this.speed = 1.5;
        _this.controls = controls;
        _this.ability = ability;
        _this.isInsideHoles = {};
        _this.thickness = s(5);
        _this.birth();
        return _this;
    }
    Object.defineProperty(Snake.prototype, "isProtected", {
        get: function () {
            return !!this.rebirthProtection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Snake.prototype, "bodySection", {
        get: function () {
            return this.body[this.body.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Snake.prototype, "bodyParts", {
        get: function () {
            var parts = [];
            for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
                var section = _a[_i];
                parts.push.apply(parts, section);
            }
            return parts;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Snake.prototype, "readyForRebirth", {
        get: function () {
            return !this.isAlive && this.body.length == 1 && this.bodySection.length == 1;
        },
        enumerable: true,
        configurable: true
    });
    Snake.prototype.birth = function () {
        this.body = [];
        var paddingX = width * 0.1;
        var paddingY = height * 0.1;
        var startingPoint = {
            x: paddingX + random() * (width - paddingX * 2),
            y: paddingY + random() * (height - paddingY * 2)
        };
        this.body.push([startingPoint]);
        this.direction = random(0, 360);
        this.isAlive = true;
        this.isInsideHoles = {};
        this.effect = 'none';
        this.rebirthProtection = 3000;
    };
    Snake.prototype.enterPassiveGhostForm = function () {
        this.ability.enterPassiveGhostForm(this);
    };
    Snake.prototype.leavePassiveGhostForm = function () {
        this.ability.leavePassiveGhostForm(this);
    };
    Object.defineProperty(Snake.prototype, "head", {
        get: function () {
            return this.bodySection[this.bodySection.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Snake.prototype.update = function () {
        if (this.isAlive) {
            this.applyPlayerActions();
            this.growBody();
            this.updateRebirthProtection();
        }
        else {
            this.shrinkBody();
        }
        this.ability.update(this);
    };
    Snake.prototype.draw = function () {
        if (game.isPaused || !this.isAlive) {
            this.drawHead();
        }
        this.drawBody();
        this.ability.draw(this);
    };
    Snake.prototype.updateRebirthProtection = function () {
        if (this.rebirthProtection) {
            this.rebirthProtection -= deltaTime;
            if (this.rebirthProtection < 0) {
                delete this.rebirthProtection;
            }
        }
    };
    Snake.prototype.drawHead = function (enlarge) {
        if (enlarge === void 0) { enlarge = 1; }
        var _a = this.head, x = _a.x, y = _a.y;
        noStroke();
        fill(this.color);
        circle(x, y, this.thickness);
        noFill();
        stroke(this.color);
        strokeWeight(this.thickness * 0.5);
        circle(x, y, this.thickness * 4 * enlarge);
    };
    Object.defineProperty(Snake.prototype, "activeColor", {
        get: function () {
            if (this.effect == 'ghost') {
                return this.colorGhosted;
            }
            else if (this.rebirthProtection) {
                return this.rebirthProtection % 800 > 400 ? this.colorGhosted : this.color;
            }
            else {
                return this.color;
            }
        },
        enumerable: true,
        configurable: true
    });
    Snake.prototype.drawBody = function () {
        stroke(this.activeColor);
        strokeWeight(this.thickness);
        curveTightness(0.5);
        noFill();
        for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
            var bodySection = _a[_i];
            var tail = bodySection[0];
            var head = bodySection[bodySection.length - 1];
            if (bodySection.length == 1) {
                point(head.x, head.y);
                continue;
            }
            beginShape();
            curveVertex(tail.x, tail.y);
            for (var i = 0; i < bodySection.length; i += 10) {
                var point_1 = bodySection[i];
                curveVertex(point_1.x, point_1.y);
            }
            curveVertex(head.x, head.y);
            curveVertex(head.x, head.y);
            endShape();
        }
    };
    Snake.prototype.applyPlayerActions = function () {
        if (keyIsDown(this.controls.left)) {
            this.direction -= 0.05;
        }
        if (keyIsDown(this.controls.right)) {
            this.direction += 0.05;
        }
        if (keyIsDown(this.controls.special)) {
            this.ability.use(this);
        }
    };
    Snake.prototype.growBody = function () {
        var _a = this.head, x = _a.x, y = _a.y;
        var nextBodyPart = {
            x: x + cos(this.direction) * s(this.speed),
            y: y + sin(this.direction) * s(this.speed)
        };
        var isInsideAHole = Object.keys(this.isInsideHoles).length;
        if (isInsideAHole) {
            this.bodySection.pop();
            if (this.bodySection.length == 0) {
                this.bodySection.push(nextBodyPart);
            }
            else {
                this.body.push([nextBodyPart]);
            }
        }
        else {
            this.bodySection.push(nextBodyPart);
        }
        if (x <= 0 || x >= width || y <= 0 || y >= height) {
            this.body.push([{
                    x: modulo(this.head.x, width),
                    y: modulo(this.head.y, height)
                }]);
        }
    };
    Snake.prototype.shrinkBody = function () {
        var shrinkSpeed = 3 + Math.round(this.bodyParts.length * 0.005);
        for (var i = 0; i < shrinkSpeed; i++) {
            var firstBodySection = this.body[0];
            if (firstBodySection.length > 1) {
                firstBodySection.shift();
            }
            else if (this.body.length > 1) {
                this.body.shift();
            }
        }
    };
    return Snake;
}(GameObject));
var CharacterMenu = (function () {
    function CharacterMenu() {
        var _this = this;
        this.onMouseLeaveMenuItem = function () { return _this.showDefaultViewIn = 1000; };
        this.onMouseEnterMenuItem = function (snakeName) {
            _this.displayedSnake = snakeName;
            delete _this.showDefaultViewIn;
        };
        this.snakeMenuItems = [];
        for (var _i = 0, _a = snakes.listAll; _i < _a.length; _i++) {
            var snake = _a[_i];
            this.snakeMenuItems.push(new CharacterMenuItem(snake, this.onMouseEnterMenuItem, this.onMouseLeaveMenuItem));
        }
    }
    Object.defineProperty(CharacterMenu.prototype, "selectedSnakes", {
        get: function () {
            return (this.snakeMenuItems
                .filter(function (item) { return item.isSelected; })
                .map(function (item) { return item.snake; }));
        },
        enumerable: true,
        configurable: true
    });
    CharacterMenu.prototype.draw = function (x, y, menuDiameter) {
        this.drawSnakeMenuItems(x, y, menuDiameter);
        this.checkMouseOverMenu(x, y, menuDiameter);
        noStroke();
        fill(color(180));
        textAlign(CENTER, CENTER);
        if (this.showDefaultViewIn) {
            this.showDefaultViewIn -= deltaTime;
            if (this.showDefaultViewIn < 0) {
                delete this.displayedSnake;
                delete this.showDefaultViewIn;
            }
        }
        if (this.displayedSnake) {
            this.drawCharacterInfo(x, y, menuDiameter);
        }
        else {
            this.drawActions(x, y, menuDiameter);
        }
    };
    CharacterMenu.prototype.drawActions = function (x, y, menuDiameter) {
        fill(color(180));
        textStyle(BOLD);
        textSize(menuDiameter * 0.08);
        if (menu.selectedSnakes.length) {
            if (menu.selectedSnakes.length >= 6) {
                this.snakeMenuItems[6].draw(x, y - menuDiameter * 0.1, menuDiameter);
            }
            else {
                text('characters selected', x, y);
                textSize(menuDiameter * 0.2);
                text(this.selectedSnakes.length, x, y - menuDiameter * 0.22);
            }
            fill(color(180));
            textStyle(NORMAL);
            textSize(menuDiameter * 0.05);
            text('press space to continue', x, y + menuDiameter * 0.22);
        }
        else {
            text('select your characters', x, y);
        }
    };
    CharacterMenu.prototype.drawCharacterInfo = function (x, y, menuDiameter) {
        var snakeInfo = snakes.getInfo(this.displayedSnake || 'Bug');
        textStyle(BOLD);
        textSize(menuDiameter * 0.12);
        text(snakeInfo.name, x, y - menuDiameter * 0.3);
        textSize(menuDiameter * 0.06);
        text(snakeInfo.ability + ' ability', x, y + menuDiameter * 0.1);
        textStyle(NORMAL);
        rectMode(CENTER);
        textAlign(CENTER, TOP);
        textSize(menuDiameter * 0.035);
        text(snakeInfo.description, x, y + menuDiameter * 0.01, menuDiameter * 0.7, menuDiameter * 0.4);
        text(snakeInfo.abilityDescription, x, y + menuDiameter * 0.38, menuDiameter * 0.65, menuDiameter * 0.4);
    };
    CharacterMenu.prototype.checkMouseOverMenu = function (x, y, menuDiameter) {
        var mousePos = { x: mouseX, y: mouseY };
        var menuPos = { x: x, y: y };
        var distance = distanceBetween(mousePos, menuPos, 0, menuDiameter);
        if (distance < 0) {
            if (this.displayedSnake == 'Tok') {
                if (this.showDefaultViewIn == undefined) {
                    this.showDefaultViewIn = 5000;
                }
            }
            else {
                delete this.displayedSnake;
                delete this.showDefaultViewIn;
            }
        }
    };
    CharacterMenu.prototype.drawSnakeMenuItems = function (x, y, menuDiameter) {
        var radius = menuDiameter * 0.7;
        var nrOfItems = this.snakeMenuItems.length - 1;
        var addedAngle = 0;
        for (var i = 0; i < nrOfItems; i++) {
            var angle = 2 * PI / (nrOfItems + 4);
            var shift = -angle;
            if (i == nrOfItems / 2) {
                addedAngle = angle * 2;
            }
            var itemX = x + radius * cos(angle * i + shift + addedAngle);
            var itemY = y + radius * sin(angle * i + shift + addedAngle);
            this.snakeMenuItems[i].draw(itemX, itemY, menuDiameter);
        }
    };
    return CharacterMenu;
}());
var CharacterMenuItem = (function () {
    function CharacterMenuItem(snake, onMouseEnter, onMouseLeave) {
        this.snake = snake;
        this.onMouseEnter = onMouseEnter;
        this.onMouseLeave = onMouseLeave;
        this.isMouseOver = false;
        this.selectedColor = snake.color;
        this.bgColor = color(50);
        this.textColor = color(180);
        this.mouseWasPressed = false;
        this.keyWasPressed = false;
        this.isSelected = !!JSON.parse(localStorage[snake.name] || 'false');
    }
    CharacterMenuItem.prototype.handleMouseHover = function (x, y, diameter) {
        var itemPosition = { x: x, y: y };
        var mousePosition = { x: mouseX, y: mouseY };
        var distance = distanceBetween(mousePosition, itemPosition, 0, diameter);
        if (distance < 0) {
            if (!this.isMouseOver) {
                this.onMouseEnter(this.snake.name);
            }
            this.isMouseOver = true;
        }
        else {
            if (this.isMouseOver) {
                this.onMouseLeave();
            }
            this.isMouseOver = false;
        }
    };
    CharacterMenuItem.prototype.draw = function (x, y, menuDiameter) {
        var diameter = menuDiameter * 0.3;
        this.handleMouseHover(x, y, diameter);
        noStroke();
        fill(this.isSelected ? this.selectedColor : this.bgColor);
        circle(x, y, diameter);
        textAlign(CENTER, CENTER);
        fill(this.isSelected ? color(0) : this.textColor);
        textStyle(BOLD);
        textSize(diameter * 0.26);
        text(this.snake.name, x, y - diameter * 0.04);
        textStyle(NORMAL);
        textFont(Fonts.Helvetica);
        textSize(diameter * 0.1);
        text(this.snake.controls.asString, x, y + diameter * 0.2);
        textFont(Fonts.Chilanka);
        this.updateSelection(x, y, diameter);
        this.mouseWasPressed = mouseIsPressed;
        this.keyWasPressed = keyIsPressed;
    };
    CharacterMenuItem.prototype.updateSelection = function (x, y, diameter) {
        if (!this.mouseWasPressed && mouseIsPressed) {
            var mousePosition = { x: mouseX, y: mouseY };
            if (distanceBetween(mousePosition, { x: x, y: y }, 0, diameter) < 0) {
                this.toggleSelection();
            }
        }
        if (!this.keyWasPressed && keyIsPressed) {
            var _a = this.snake.controls, left = _a.left, special = _a.special, right = _a.right;
            if (keyCode == left || keyCode == special || keyCode == right) {
                this.toggleSelection();
            }
        }
    };
    CharacterMenuItem.prototype.toggleSelection = function () {
        this.isSelected = !this.isSelected;
        localStorage.setItem(this.snake.name, this.isSelected.toString());
    };
    return CharacterMenuItem;
}());
var Menu = (function () {
    function Menu() {
        this.bgColor = color(0, 160);
        this.textColor = color(180);
        this.setupStep = 'selection';
        this.storyMenu = new StoryMenu();
        this.characterMenu = new CharacterMenu();
        this.muteButton = new MuteButton();
        this.diameter = 0;
    }
    Object.defineProperty(Menu.prototype, "isSetup", {
        get: function () {
            return this.setupStep != 'done';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "selectedSnakes", {
        get: function () {
            return this.characterMenu.selectedSnakes;
        },
        enumerable: true,
        configurable: true
    });
    Menu.prototype.replayStory = function () {
        this.storyMenu = new StoryMenu();
        this.setupStep = 'story';
    };
    Menu.prototype.draw = function () {
        if (menu.isSetup || game.isPaused) {
            this.diameter = min(width, height) * 0.7;
            var x = width * 0.5;
            var y = height * 0.5;
            noStroke();
            fill(this.bgColor);
            circle(width * 0.5, height * 0.5, this.diameter);
            textAlign(CENTER, CENTER);
            fill(this.textColor);
            textFont(Fonts.Chilanka);
            if (this.setupStep == 'story') {
                this.storyMenu.draw(x, y, this.diameter);
            }
            else if (this.setupStep == 'selection') {
                this.characterMenu.draw(x, y, this.diameter);
            }
            else {
                this.drawScore(x, y);
                this.drawActions(x, y);
            }
            this.muteButton.draw();
        }
    };
    Menu.prototype.drawScore = function (x, y) {
        var score = game.hasEnded ? game.score : scoreboard.highScore;
        var scoreTitle = 'HIGH  SCORE';
        if (game.hasEnded) {
            if (game.score >= scoreboard.highScore) {
                scoreTitle = 'NEW  HIGH  SCORE';
            }
            else {
                scoreTitle = 'SCORE';
            }
        }
        textFont(Fonts.Monoton);
        textSize(this.diameter * 0.07);
        text(scoreTitle, x, y - this.diameter * 0.2);
        textFont(Fonts.Helvetica);
        textSize(this.diameter * 0.068);
        text(numberWithSpaces(score), x, y - this.diameter * 0.1);
        textFont(Fonts.Chilanka);
    };
    Menu.prototype.drawActions = function (x, y) {
        textStyle(BOLD);
        textSize(this.diameter * 0.06);
        var spaceActionText = game.hasEnded ? 'press space to restart' : 'press space to play/pause';
        text(spaceActionText, x, y + this.diameter * 0.1);
        textStyle(NORMAL);
        textSize(this.diameter * 0.045);
        text('press backspace to end game', x, y + this.diameter * 0.22);
    };
    return Menu;
}());
var MuteButton = (function () {
    function MuteButton() {
        this.mouseWasPressed = false;
    }
    MuteButton.prototype.draw = function () {
        var diameter = min(width, height) * 0.1;
        var x = width - diameter * 0.7;
        var y = +diameter * 0.7;
        this.handleMouseClick(x, y, diameter);
        noStroke();
        fill(color(0));
        textAlign(CENTER, CENTER);
        circle(x, y, diameter);
        fill(color(music.isMuted ? 100 : 180));
        textSize(diameter * 0.2);
        text('Music:', x, y - diameter * 0.1);
        text(music.isMuted ? 'off' : 'on', x, y + diameter * 0.2);
    };
    MuteButton.prototype.handleMouseClick = function (x, y, diameter) {
        if (!this.mouseWasPressed && mouseIsPressed) {
            var mousePosition = { x: mouseX, y: mouseY };
            if (distanceBetween(mousePosition, { x: x, y: y }, 0, diameter) < 0) {
                music.toggleMute();
            }
        }
        this.mouseWasPressed = mouseIsPressed;
    };
    return MuteButton;
}());
var StoryMenu = (function () {
    function StoryMenu() {
    }
    StoryMenu.prototype.draw = function (x, y, menuDiameter) {
        noStroke();
        fill(color(180));
        textAlign(CENTER, CENTER);
        rectMode(CENTER);
        textStyle(BOLD);
        textSize(menuDiameter * 0.1);
        text('Curve', x, y - menuDiameter * 0.32);
        textStyle(NORMAL);
        textAlign(CENTER, TOP);
        textSize(menuDiameter * 0.035);
        text(this.storyDescription, x, y + menuDiameter * 0.18, menuDiameter * 0.86, menuDiameter * 0.8);
        textStyle(BOLD);
        textSize(menuDiameter * 0.05);
        text('press space to play', x, y + menuDiameter * 0.32);
        textStyle(NORMAL);
    };
    Object.defineProperty(StoryMenu.prototype, "storyDescription", {
        get: function () {
            return "A long time ago an anomaly appeared in the space-time continuum. For the longest time it grew unnoticed and our world was in balance. Then something happened... more anomalies started appearing rappidly and eventually grew and destoyed parts of our world. When all hope seemed lost, that's when they arrived, seven legendary creatures that could help us save our world. \n\nGather your friends and rid the world of the anomalies - before it's to late.";
        },
        enumerable: true,
        configurable: true
    });
    return StoryMenu;
}());
var Particle = (function () {
    function Particle(props) {
        var position = props.position || createVector(0, 0);
        this.position = position.copy();
        this.velocity = props.velocity;
        this.size = props.size;
        this.color = props.color;
        this.lifespan = props.lifespan;
        this.timeToDeath = props.lifespan;
    }
    Particle.prototype.run = function () {
        this.update();
        this.draw();
    };
    Particle.prototype.update = function () {
        this.position.add(this.velocity);
        this.timeToDeath = max(0, this.timeToDeath - deltaTime * 0.001);
    };
    Particle.prototype.draw = function () {
        var _a = this.position, x = _a.x, y = _a.y;
        noStroke();
        fill(color(this.color.toString().replace(',1)', "," + this.opacity + ")")));
        ellipse(x, y, this.size, this.size);
    };
    Object.defineProperty(Particle.prototype, "opacity", {
        get: function () {
            if (this.timeToDeath) {
                return this.timeToDeath / this.lifespan;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "isDead", {
        get: function () {
            return this.timeToDeath <= 0;
        },
        enumerable: true,
        configurable: true
    });
    return Particle;
}());
function fireParticle(position) {
    return [
        new Particle({
            position: position,
            velocity: createVector(s(random(-0.3, 0.3)), s(random(-0.3, 0.3))),
            color: color(255, random(150), 0),
            size: s(random(2, 12)),
            lifespan: random(1, 2)
        })
    ];
}
function snowParticle(position) {
    return [
        new Particle({
            position: position,
            velocity: createVector(s(random(-0.7, 0.7)), s(random(-0.7, 0.7))),
            color: color(255),
            size: s(random(1, 6)),
            lifespan: random(0.4, 0.8)
        })
    ];
}
function glowParticle(position) {
    return [
        new Particle({
            position: position,
            velocity: createVector(s(random(-0.4, 0.4)), s(random(-0.4, 0.4))),
            color: color(255, 255, 0),
            size: s(random(6, 10)),
            lifespan: random(1, 2.5)
        })
    ];
}
function teleportParticle(position) {
    var particles = [];
    for (var i = 0; i < 100; i++) {
        var particleColor = color(255);
        if (random(1) < 0.6) {
            particleColor = color(round(random(50)), 255, round(random(50)));
        }
        particles.push(new Particle({
            position: position,
            velocity: createVector(s(random(-5, 5)), s(random(-5, 5))),
            color: particleColor,
            size: s(random(1, 4)),
            lifespan: random(0.1, 0.3)
        }));
    }
    return particles;
}
var ParticleSystem = (function () {
    function ParticleSystem(origin, spawnRate, particleGenerator, lifespan, startingTime) {
        this.origin = origin.copy();
        this.particles = [];
        this.spawnRate = spawnRate;
        this.time = startingTime || random(spawnRate);
        this.particleGenerator = particleGenerator;
        this.lifespan = lifespan;
    }
    ParticleSystem.prototype.updateOrigin = function (origin) {
        this.origin = origin;
    };
    ParticleSystem.prototype.addParticle = function (newTime) {
        var _a;
        if (!this.particles.length || newTime % this.spawnRate < this.time % this.spawnRate) {
            (_a = this.particles).push.apply(_a, this.particleGenerator(this.origin));
        }
    };
    ParticleSystem.prototype.run = function () {
        var newTime = this.time + deltaTime * 0.001;
        if (this.lifespan == undefined || this.lifespan > this.time) {
            this.addParticle(newTime);
        }
        for (var i = this.particles.length - 1; i >= 0; i--) {
            var particle = this.particles[i];
            particle.run();
            if (particle.isDead) {
                this.particles.splice(i, 1);
            }
        }
        this.time += deltaTime * 0.001;
    };
    return ParticleSystem;
}());
var ESC = 27;
var SPACE = 32;
var KEY_Z = 90;
var KEY_X = 88;
var KEY_C = 67;
var KEY_N = 78;
var KEY_B = 66;
var KEY_M = 77;
var KEY_Q = 81;
var KEY_W = 87;
var KEY_E = 69;
var KEY_T = 84;
var KEY_Y = 89;
var KEY_U = 85;
var KEY_L = 76;
var KEY_Ö = 186;
var KEY_Ä = 222;
var KEY_0 = 48;
var KEY_1 = 49;
var KEY_2 = 50;
var KEY_3 = 51;
var KEY_4 = 52;
var KEY_5 = 53;
var KEY_6 = 54;
var KEY_7 = 55;
var KEY_8 = 56;
var KEY_9 = 57;
var Fonts;
(function (Fonts) {
    Fonts["Chilanka"] = "Chilanka";
    Fonts["Helvetica"] = "Helvetica";
    Fonts["Monoton"] = "Monoton";
})(Fonts || (Fonts = {}));
var HoleEffecType;
(function (HoleEffecType) {
    HoleEffecType[HoleEffecType["teleport"] = 0] = "teleport";
    HoleEffecType[HoleEffecType["redirect"] = 1] = "redirect";
    HoleEffecType[HoleEffecType["freeze"] = 2] = "freeze";
    HoleEffecType[HoleEffecType["none"] = 3] = "none";
})(HoleEffecType || (HoleEffecType = {}));
var Mouse = (function () {
    function Mouse() {
        this.color = color(200);
        this.thickness = 5;
        this.mouseHasBeenFound = false;
    }
    Mouse.prototype.draw = function () {
        var thickness = s(this.thickness);
        if (!this.mouseHasBeenFound) {
            this.mouseHasBeenFound = Boolean(mouseX || mouseY);
        }
        else if (menu.isSetup || game.isPaused) {
            noStroke();
            fill(this.color);
            circle(mouseX, mouseY, thickness);
            noFill();
            stroke(this.color);
            strokeWeight(thickness * 0.5);
            circle(mouseX, mouseY, thickness * 6);
        }
    };
    return Mouse;
}());
function s(value) {
    return min(width, height) * value * 0.001;
}
function modulo(value, limit) {
    return ((value % limit) + limit) % limit;
}
function distanceBetween(a, b, aRadius, bRadius) {
    if (aRadius === void 0) { aRadius = 0; }
    if (bRadius === void 0) { bRadius = 0; }
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var distance = sqrt(dx * dx + dy * dy);
    var radius = (aRadius * 0.5) + (bRadius * 0.5);
    return distance - radius;
}
function numberWithSpaces(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
//# sourceMappingURL=build.js.map
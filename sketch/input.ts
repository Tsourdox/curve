/* NOTE: Game related inputs take place within game related classes */

function mouseClicked() {
    const mousePosition: Point = { x: mouseX, y: mouseY }

    if (menu && menu.isSetup) {
        game.removeHoleContaining(mousePosition, true)
    }
}

function keyPressed() {
    // Prevent error when reloading with keyboard shotcut
    if (!music || !menu || !game) {
        return
    }

    // Pause Music
    if (keyCode == ENTER) {
        music.toggleMute()
    }

    if (menu.isSetup) {
        // GAME SETUP
        if (menu.setupStep == 'story') {
            if (keyCode == SPACE) {
                enterCharacterSelection()
            }
        } else if (menu.setupStep == 'selection') {
            if (keyCode == SPACE && menu.selectedSnakes.length > 0) {
                reloadGame()
            }
            if (keyCode == BACKSPACE) {
                showGameIntro()
            }
            if (key == "h") {
                showHighScore()
            }
        } else if (menu.setupStep == 'highscore') {
            if (keyCode == BACKSPACE || keyCode == SPACE) {
                enterCharacterSelection()
            }
        }
    } else if (game.hasEnded) {
        // GAME OVER
        if (keyCode == BACKSPACE) {
            enterCharacterSelection()
        }
        if (keyCode == SPACE) {
            reloadGame()
        }
    } else if (game.isPaused) {
        // PAUSED GAME
        if (keyCode == BACKSPACE) {
            enterCharacterSelection()
        }
        if (keyCode == SPACE) {
            game.resume()
        }
    } else {
        // GAME IS RUNNING
        if (keyCode == SPACE) {
            game.pause()
        }

    }

    return false
}

function reloadGame() {
    const newSnakes = snakes.create(menu.selectedSnakes)
    game = new Game(newSnakes)
    menu.setupStep = 'done'
}

function enterCharacterSelection() {
    menu.setupStep = 'selection'
    game = new Game([])
}

function showGameIntro() {
    menu.setupStep = 'story'
}

function showHighScore() {
    menu.setupStep = 'highscore'
}
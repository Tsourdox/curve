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

    if (menu.isSetup) {
        // GAME SETUP
        switch (menu.setupStep) {
            case 'start': {
                if (keyCode == SPACE) {
                    enterCharacterSelection()
                }
                break
            }
            case 'snake-selection': {
                if (keyCode == SPACE) {
                    if (menu.selectedSnakes.length > 0) {
                        reloadGame()
                    }
                }
                break
            }
        }
    } else if (game.isPaused) {
        // PAUSED GAME
        if (keyCode == ENTER) {
            if (game.hasEnded) {
                saveHighScoreToLocalStorage()
            }
            enterCharacterSelection()
        }
        if (keyCode == SPACE) {
            if (game.hasEnded) {
                saveHighScoreToLocalStorage()
                reloadGame()
            } else {
                game.resume()
            }
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
    const newSnakes = Snakes.create(menu.selectedSnakes)
    game = new Game(newSnakes)
    menu.setupStep = 'done'
}

function enterCharacterSelection() {
    menu.setupStep = 'snake-selection'
    game = new Game([])
}

function saveHighScoreToLocalStorage() {
    const highScore = Number(localStorage.highScore)
    localStorage.highScore = max(game.score, highScore)
}
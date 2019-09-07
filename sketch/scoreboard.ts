interface ScoreData {
    score: number
    players: string[]
}

class ScoreBoard {

    private scores: ScoreData[]

    constructor() {
        this.scores = this.loadScoreFromLocalStorage()
        console.log(this.scores)
    }

    private loadScoreFromLocalStorage(): ScoreData[] {
        return JSON.parse(localStorage.getItem('scoreboard') || '[]')
    }

    private updateScoreInLocalStorage() {
        localStorage.scoreboard = JSON.stringify(this.scores)
    }


    public saveScore(): void {
        const newScore: ScoreData = {
            score: game.score,
            players: game.snakes.map((snake) => snake.name)
        }

        this.scores.push(newScore)
        this.updateScoreInLocalStorage()
    }

    public get highScore(): number {
        let highScore = 0

        for (const data of this.scores) {
            highScore = max(data.score, highScore)
        }

        return highScore
    }
}
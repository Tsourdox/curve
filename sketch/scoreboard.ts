interface ScoreData {
    score: number
    players: string[]
}

class ScoreBoard {

    private scores: ScoreData[]

    constructor() {
        this.scores = this.loadScoreFromLocalStorage()
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

    public get topTenList(): ScoreData[] {
        const sortedScores = this.scores.sort((a, b) => a.score > b.score ? -1 : 1)
        return sortedScores.slice(0, 10)
    }
}
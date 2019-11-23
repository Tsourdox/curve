class HighScoreMenu {

    public draw(x: number, y: number, menuDiameter: number) {
        // Title
        textFont(Fonts.Monoton)
        textSize(menuDiameter * 0.07)
        text('HIGH   SCORES', x, y - menuDiameter * 0.3)

        // List
        textFont(Fonts.Chilanka)
        const scores = scoreboard.topTenList
        for (let i = 0; i < scores.length; i++) {
            const scoreData = scores[i]
            let yPos = (y - menuDiameter * 0.2) + menuDiameter * 0.06 * i
            let xPos = x - menuDiameter * 0.07
            textAlign(RIGHT)
            textSize(menuDiameter * 0.04)
            text(scoreData.score, xPos, yPos)

            xPos += menuDiameter * 0.02
            yPos -= menuDiameter * 0.005
            textAlign(LEFT)
            textSize(menuDiameter * 0.025)
            text(scoreData.players.join(', '), xPos, yPos)
        }

    }
}
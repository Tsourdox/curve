class StoryMenu {

    public draw(x: number, y: number, menuDiameter: number) {
        noStroke()
        fill(color(180))
        textAlign(CENTER, CENTER)
        rectMode(CENTER)

        textStyle(BOLD)
        textSize(menuDiameter * 0.1)
        text('Boundless', x, y - menuDiameter * 0.3)

        textStyle(NORMAL)
        textAlign(CENTER, TOP)
        textSize(menuDiameter * 0.035)
        text(this.storyDescription, x, y + menuDiameter * 0.18, menuDiameter * 0.84, menuDiameter * 0.8)

        textStyle(BOLD)
        textSize(menuDiameter * 0.05)
        text('press space to play', x, y + menuDiameter * 0.32)
        textStyle(NORMAL)
    }

    private get storyDescription() {
        return "A long time ago an anomaly appeared in the space-time continuum. For the longest time it grew unnoticed and our world was in balance. Then something happened... more anomalies started appearing rappidly and eventually grew and destoyed parts of our world. When all hope seemed lost, that's when they arrived, seven legendary creatures that could help us save our world. \n\nGather your friends and rid the world of the anomalies - before it's to late."
    }
}
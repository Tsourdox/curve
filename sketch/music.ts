interface MusicFiles {
    menu: p5.SoundFile
    game: p5.SoundFile
}

class Music {
    private activeMusicFile: p5.SoundFile
    private musicFiles: MusicFiles

    constructor(musicFiles: MusicFiles) {
        this.musicFiles = musicFiles
        this.activeMusicFile = musicFiles.menu
        musicFiles.menu.setLoop(true)
        musicFiles.game.setLoop(true)
        musicFiles.menu.setVolume(0.1)
        musicFiles.game.setVolume(0.6)
    }

    private playMusicFile(musicFile: p5.SoundFile): void {
        this.stopMusic()
        this.activeMusicFile = musicFile
        if (!this.isMuted) {
            this.playMusic()
        }
    }

    private stopMusic() {
        this.activeMusicFile.stop()
    }

    private get isMuted() {
        return localStorage.isMusicMuted
    }

    public get isPlaying() {
        return this.activeMusicFile.isPlaying()
    }

    public playMusic() {
        if (!this.isPlaying) {
            this.activeMusicFile.play()
            localStorage.isMusicMuted = false
        }
    }

    public pauseMusic() {
        this.activeMusicFile.pause()
        localStorage.isMusicMuted = true
    }

    public playMenuMusic() {
        const { menu } = this.musicFiles
        this.playMusicFile(menu)
    }

    public playGameMusic() {
        const { game } = this.musicFiles
        this.playMusicFile(game)
    }
}
interface MusicFiles {
    menuMusic: p5.SoundFile
    gameMusic: p5.SoundFile
}

class Music {
    private readonly fadeTime = 1
    private activeMusicFile: p5.SoundFile
    private musicFiles: MusicFiles

    constructor(musicFiles: MusicFiles) {
        this.musicFiles = musicFiles
        this.activeMusicFile = musicFiles.menuMusic
    }

    private getVolume(forFile: p5.SoundFile) {
        const { menuMusic, gameMusic } = this.musicFiles
        switch (forFile) {
            case menuMusic: return 0.02
            case gameMusic: return 0.1
            default: return 0.1
        }
    }

    private playMusicFile(musicFile: p5.SoundFile, volume: number): void {
        const isSameActiveFile = musicFile == this.activeMusicFile
        if (this.isPlaying() && !isSameActiveFile) {
            this.stopMusic()
            this.activeMusicFile = musicFile
            this.playMusic(volume)
        } else {
            this.activeMusicFile = musicFile
            this.playMusic(volume)
        }
    }

    private stopMusic() {
        this.activeMusicFile.setVolume(0, this.fadeTime)
        this.activeMusicFile.stop(this.fadeTime)
    }

    public isPlaying() {
        return this.activeMusicFile.isPlaying()
    }

    public playMusic(volume?: number) {
        if (!this.activeMusicFile.isPlaying()) {
            volume = volume || this.getVolume(this.activeMusicFile)
            this.activeMusicFile.setLoop(true)
            this.activeMusicFile.setVolume(0)
            this.activeMusicFile.play()
            this.activeMusicFile.setVolume(volume, this.fadeTime)
        }
    }

    public pauseMusic() {
        this.activeMusicFile.setVolume(0, this.fadeTime)
        this.activeMusicFile.pause(0.5)
    }

    public playMenuMusic() {
        const { menuMusic } = this.musicFiles
        const volume = this.getVolume(menuMusic)
        this.playMusicFile(menuMusic, volume)
    }

    public playGameMusic() {
        const { gameMusic } = this.musicFiles
        const volume = this.getVolume(gameMusic)
        this.playMusicFile(gameMusic, volume)
    }
}
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
        this.activeMusicFile.stop(0.5)
    }

    public isPlaying() {
        return this.activeMusicFile.isPlaying()
    }

    public playMusic(volume: number) {
        if (!this.activeMusicFile.isPlaying()) {
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
        this.playMusicFile(this.musicFiles.menuMusic, 0.02)
    }

    public playGameMusic() {
        this.playMusicFile(this.musicFiles.gameMusic, 0.1)
    }
}
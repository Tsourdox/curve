interface MusicFiles {
    menu: p5.SoundFile
    game: p5.SoundFile
}

class Music {
    private musicFiles: MusicFiles
    private readonly menuVolume = 0.1
    private readonly gameVolume = 0.6

    constructor(musicFiles: MusicFiles) {
        this.musicFiles = musicFiles
        musicFiles.menu.setLoop(true)
        musicFiles.game.setLoop(true)

        if (this.isMuted) {
            this.muteMusic()
        } else {
            this.unmuteMusic()
        }
    }

    public get isMuted() {
        return !!JSON.parse(localStorage.isMusicMuted || '')
    }

    public muteMusic() {
        musicFiles.menu.setVolume(0)
        musicFiles.game.setVolume(0)
        localStorage.setItem('isMusicMuted', JSON.stringify(true))
    }

    public unmuteMusic() {
        musicFiles.menu.setVolume(this.menuVolume)
        musicFiles.game.setVolume(this.gameVolume)
        localStorage.setItem('isMusicMuted', JSON.stringify(false))
    }

    public playMenuMusic() {
        const { menu, game } = this.musicFiles
        if (game.isPlaying()) {
            game.stop()
        }
        menu.play()
    }

    public playGameMusic() {
        const { menu, game } = this.musicFiles
        if (menu.isPlaying()) {
            menu.stop()
        }
        game.play()
    }
}
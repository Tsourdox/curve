class RoomButton {
    private room: {
        name: string
        nrOfPlayers: number
    }
    private isActive: boolean
    private mouseWasPressed: boolean

    constructor() {
        this.room = {
            name: "",
            nrOfPlayers: 0
        }
        this.isActive = false
        this.mouseWasPressed = false
        this.setupSocketHooks()
    }

    draw() {
        const diameter = min(width, height) * 0.1
        const x = diameter * 0.7
        const y = height - diameter * 0.7
        this.handleMouseClick(x, y, diameter)

        noStroke()
        fill(color(0))
        textAlign(CENTER, CENTER)
        circle(x, y, diameter)

        fill(color(this.room ? 180 : 100))
        if (this.room.name) {
            textSize(diameter * 0.3)
            text(this.room.name, x, y - diameter * 0.08)
            textSize(diameter * 0.18)
            text(this.room.nrOfPlayers, x, y + diameter * 0.22)
        } else {
            textSize(diameter * 0.2)
            text('Join', x, y - diameter * 0.15)
            text('Room', x, y + diameter * 0.15)
        }
    }

    handleMouseClick(x: number, y: number, diameter: number) {
        if (!this.mouseWasPressed && mouseIsPressed) {
            const mousePosition = { x: mouseX, y: mouseY }
            if (distanceBetween(mousePosition, { x, y }, 0, diameter) < 0) {
                this.isActive = !this.isActive
                const room = prompt('Join a room')
                if (room) {
                    socket.emit('join room', room)
                } else {
                    socket.emit('leave room')
                }
            }
        }

        this.mouseWasPressed = mouseIsPressed
    }

    setupSocketHooks() {
        socket.on('join room - successful', this.joinSuccessful.bind(this))
        socket.on('join room - failed', this.joinFailed.bind(this))
        socket.on('leave room - successful', this.leaveSuccessful.bind(this))
        socket.on('leave room - failed', this.leaveFailed.bind(this))
        socket.on('someone joined room', this.someoneJoinedRoom.bind(this))
        socket.on('someone left room', this.someoneLeftRoom.bind(this))
    }

    joinSuccessful(roomName: string) {
        this.room.name = roomName
    }
    joinFailed(error: string) {
        console.error('Join failed with error:', error)
    }

    leaveSuccessful() {
        this.room.name = ""
    }
    leaveFailed(error: string) {
        console.error('Leave failed with error:', error)
    }

    someoneJoinedRoom(nrOfPlayers: number) {
        this.room.nrOfPlayers = nrOfPlayers
    }
    someoneLeftRoom(nrOfPlayers: number) {
        this.room.nrOfPlayers = nrOfPlayers
    }
}
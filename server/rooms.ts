import { CurveSocket } from "./server"

export function joinRoom(roomName: string, socket: CurveSocket, io: SocketIO.Server) {
    if (checkErrors(socket, roomName)) {
        return
    }

    leaveRoom(socket, io)

    socket.join(roomName, (err) => {
        if (err) {
            socket.emit('join room - failed', err)
            return
        }
        socket.room = roomName
        const room = socket.adapter.rooms[roomName]
        // Respond to client that join was successful
        io.to(socket.id).emit('join room - successful', roomName)

        // Broadcast message to all clients in the room
        io.to(roomName).emit('someone joined room', room.length)
    })
}


export function leaveRoom(socket: CurveSocket, io: SocketIO.Server) {
    if (socket.room) {
        socket.leave(socket.room)

        // Broadcast message to all clients in the room
        const room = socket.adapter.rooms[socket.room]
        if (room) {
            io.to(socket.room).emit('someone left room', room.length)
        }

        socket.room = ""
        socket.emit('leave room - successful')
    }

}

function checkErrors(socket: CurveSocket, roomName: string) {
    const room = socket.adapter.rooms[roomName]
    if (room && room.length > 6) {
        socket.emit('join room - failed', 'isFull')
        return true
    }
    if (roomName.length > 4) {
        socket.emit('join room - failed', 'max4Char')
        return true
    }
    if (roomName == socket.room) {
        socket.emit('join room - failed', 'alreadyInRoom')
        return true
    }

    return false
}
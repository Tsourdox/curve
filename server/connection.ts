import { CurveSocket } from "./server"
import { joinRoom } from "./rooms"

const interval = 4000

export function onDisconnecting(socket: CurveSocket, clients: CurveSocket[], io: SocketIO.Server) {
    console.log('disconnecting: ' + socket.id)
    // Broadcast message to all clients in the room
    if (socket.room) {
        const room = socket.adapter.rooms[socket.room]
        io.to(socket.room).emit('someone left room', room.length - 1)
    }

    socket.reconnectTimeout = interval * 5
    socket.reconnectInterval = setInterval(() => {
        console.log('Waiting for reconnect...')

        socket.reconnectTimeout -= interval
        if (socket.reconnectTimeout <= 0) {
            const index = clients.indexOf(socket)
            clients.splice(index, 1)
            clearInterval(socket.reconnectInterval)
            console.log('Socket was permanently removed!')
        }
    }, interval)
}

export function onReconnect(
    socket: CurveSocket,
    oldId: string,
    io: SocketIO.Server,
    clients: CurveSocket[]
) {
    const client = clients.find((client) => client.id == oldId)
    if (client) {
        // Cancel timout interval
        clearInterval(client.reconnectInterval)

        // Preserve vital information before old socket is removed
        if (client.room) {
            joinRoom(client.room, socket, io)
        }

        // Remove old socket
        const index = clients.indexOf(client)
        clients.splice(index, 1)

        socket.emit('reconnect-success', 'Reconnected successfully')
    } else {
        socket.emit('reconnect-fail', 'Reconnection failed')
    }
}
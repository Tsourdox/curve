import * as express from 'express'
import * as http from 'http'
import * as socketIO from 'socket.io'
import { joinRoom, leaveRoom } from './rooms'
import { onDisconnecting, onReconnect } from './connection'

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const port = process.env.PORT || 3000

export interface CurveSocket extends SocketIO.Socket {
    reconnectTimeout: number
    reconnectInterval: any
    room?: string
}

const clients: CurveSocket[] = []

io.on('connection', (socket: CurveSocket) => {
    console.log('connected....', socket.id)
    clients.push(socket)

    socket.on('disconnecting', () => onDisconnecting(socket, clients, io))
    socket.on('reconnect-forced', (data) => onReconnect(socket, data, io, clients))
    socket.on('join room', (data) => joinRoom(data, socket, io))
    socket.on('leave room', () => leaveRoom(socket, io))

    // Broadcast message to all clients in the room
    // socket.on('message', (data) => {
    //     io.to(data.room).emit('message', data)
    // })

    socket.emit('connected', socket.id)
})

app.use(express.static('../public'))
server.listen(port, () => console.log('listening on port ' + port))
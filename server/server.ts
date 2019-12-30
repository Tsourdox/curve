import * as express from 'express'
import * as http from 'http'
import * as socketIO from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const port = process.env.PORT || 3000

app.use(express.static('../public'))

io.on('connection', (socket: SocketIO.Socket) => {
    console.log('connected....', socket.id)

    socket.on('join room', (data) => {

        socket.join(data.room, () => {
            // Respond to client that join was successful
            io.to(socket.id).emit('join successful', 'success')

            // Broadcast message to all clients in the room
            io.to(data.room).emit('joined room', ` ${data.name} has joined the room!`)
        })

        // Broadcast message to all clients in the room
        socket.on('message', (data) => {
            io.to(data.room).emit('message', data)
        })
    })

    socket.emit('connected', 'Secret message.. :O')
})

server.listen(port, () => console.log('listening on port ' + port))
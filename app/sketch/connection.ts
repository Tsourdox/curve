class Connection {

    constructor() {
        // Connect to Socket
        socket.on('connected', () => {
            const activeSocketId = getItem('socket-id')
            if (activeSocketId) {
                socket.emit('reconnect-forced', activeSocketId)
            } else {
                storeItem('socket-id', socket.id)
            }
        })
        socket.on('reconnect-success', (data: string) => {
            console.log('reconnect', data)
            storeItem('socket-id', socket.id)
        })
        socket.on('reconnect-fail', (data: string) => {
            console.log('reconnect', data)
            storeItem('socket-id', socket.id)
        })
        socket.on('disconnect', () => {
            console.log('disconnected')
        })
    }
}
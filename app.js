const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5000
//listening port
const server = app.listen(PORT, () => {
    console.log(`server running on port: ${PORT} `)
})
app.use(express.static(path.join(__dirname, 'public')))

//socket io
const io = require('socket.io')(server)

let socketConnected = new Set()
io.on("connection", onConnected)

function onConnected(socket) {
    console.log(socket.id)
    socketConnected.add(socket.id)

    io.emit('clients-total', socketConnected.size)

    socket.on('disconnect', () => {
        console.log('Socket disconnected')
        socketConnected.delete(socket.id)
        io.emit('clients-total', socketConnected.size)
    })
    socket.on('message',(data) => {
        console.log(data)
        socket.broadcast.emit('chat-message',data)
    })

    socket.on('feedback' , (data) => {
        socket.broadcast.emit('feedback', data)
    })
}
const express = require('express')
const Emitter = require('events')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)

// Socket 
const io = require('socket.io')(http)
const users = []
io.on('connection', (socket) => {
    console.log('Connected...')
  
    socket.on('create_room', (data) => {
        socket.join(data)
        users.push(data)
        socket.broadcast.emit('users', users)
    })
    socket.on('message', (msg) => {
        io.to(msg.receiver).emit('message', msg)
    })

})



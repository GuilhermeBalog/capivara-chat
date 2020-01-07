const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const ejs = require('ejs')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const messages = []

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')

app.get('/', (request, response) => {
    response.render('index.html')
})

io.on('connection', socket => {
    console.log(`User login: ${socket.id}`)

    socket.emit('previousMessages', messages)

    socket.on('sendMessage', (message) => {
        messages.push(message)
        socket.broadcast.emit('recivedMessage', message)
    })
})

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`> Server listening on port ${port}`)
})
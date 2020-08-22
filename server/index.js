const express = require('express')
const http = require("http")
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000

// App init
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '..', 'client', 'build')))

// Backend endpoints
// const apiRoutes = require('./routes')(app) 

// React endpoints
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
});

// Setting up server and io
const server = http.createServer(app);
const io = require('socket.io').listen(server)

// io events 
let rooms = []
let games = []

io.on("connection", (socket) => {

    //When user connects for the the 1st time will get all the available rooms
    socket.on("get rooms", () => {
        io.to(socket.id).emit("rooms update", rooms)
    })

    //When new rooms is added update all users
    socket.on("new room", (room) => {
        if (rooms.includes(room))
            return
        rooms.push(room)
        io.emit("rooms update", rooms)
    })

    //When a user connects to a room
    socket.on("join", ([name, room]) => {
        socket.join(room)
        console.log(`${name} joined room ${room}!`)

        // if 2 players are in a room start game
        io.in(room).clients(async (err, clients) => {
            if (clients.length === 2) {
                startGame(room, clients)
            }
            //TODO EMIT ROOM IS FULL
        })
    })

    //When a users ends its turn
    socket.on("end turn", ([room, color, bPieces, wPieces]) => {
        updateGame(room, color, bPieces, wPieces)
    })

    socket.on("disconnect", () => {
        //todo with disconect
    })
})

const startGame = (room, player) => {
    console.log(`game started in room ${room}!`)
    io.to(room).emit("start")

    // Choose randomly who is first
    const first = Math.floor(Math.random() * 2)
    const second = first === 0 ? 1 : 0
    io.to(player[first]).emit("color", "white")
    io.to(player[second]).emit("color", "black")
 
    games.push({"name": room, "turn": "white"})
}

const updateGame = (room, color, bPieces, wPieces) => {
    //Check if it is that player's turn
    if (!games.find(game => game["name"] === room && game["turn"] === color))
        return

    //Update game
    const newColor = color === "black" ? "white" : "black"
    games.forEach(game => {
        if (game["name"] === room) {
            game["turn"] = newColor
            game["bPieces"] = bPieces
            game["wPieces"] = wPieces
        }
    })
     
    //Update the other player
    io.to(room).emit("turn update", [newColor, bPieces, wPieces])
}

// Start server
server.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}`)
)
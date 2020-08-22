import React, { useState } from "react"
import socket from './socket'
import Topnav from './Topnav'
import Login from './Login'
import Rooms from './Rooms'
import Game from './Game'
import './App.scss'

function App() { 
  const [name, setName] = useState()
  const [isLogged, setIsLogged] = useState(false)
  const [enteredLobby, setEnterLobby] = useState(false)
  const [gameStarted, setGameStarted] = useState(false) 
  const [color, setColor] = useState()
  const [room, setRoom] = useState() 

  const joinRoom = (room) => {
    socket.emit("join", [name, room]) 
    setRoom(room)
    setEnterLobby(true) 
    socket.on("start", () => { 
      setGameStarted(true)
    })  
    socket.on("color", col => setColor(col))
  }

  const renderApp = () => {
    
    if (!isLogged)
      return <Login setIsLogged={setIsLogged} setName={setName} />

    if (!enteredLobby)
      return <Rooms joinRoom={joinRoom} />

    if (!gameStarted)
      return <div>Wait for game to start (needs 2 players to connect)</div>
 
    return <Game color={color} room={room}/>
  }

  return (
    <>
      <Topnav />
      {renderApp()}
    </>
  )
}

export default App;
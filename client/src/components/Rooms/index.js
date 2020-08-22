import React, { useState, useEffect } from 'react'
import socket from '../socket'
import DisplayRooms from './DisplayRooms'

const Rooms = ({ joinRoom }) => {
    const [rooms, setRooms] = useState([])
    const [newRoom, setNewRoom] = useState() 
    const [errorMsg, setErrorMsg] = useState()

    useEffect(() => {
        socket.emit("get rooms")
        socket.on("rooms update", rooms => setRooms(rooms)) 
    }, [socket])

    const handleChange = (e) => { 
        setErrorMsg()
        setNewRoom(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (rooms.includes(newRoom)){
            setErrorMsg("Room already exits!")
            return
        }
  
        if (newRoom.length > 12) {
            setErrorMsg("Room name too long!")
            return
        } 

        socket.emit("new room", newRoom)
    }  

    return (
        <div className="rooms">
            <DisplayRooms rooms={rooms} joinRoom={joinRoom}/>
            {errorMsg}
            <form onSubmit={handleSubmit}>
                <label htmlFor="name"> Add room: </label> 
                <span>
                    <input id="name" type="text" onChange={handleChange} />
                    <button type="submit"> Enter </button>
                </span> 
            </form>
        </div>
    )
}

export default Rooms

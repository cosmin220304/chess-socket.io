import React from 'react'
import { v4 as uuidv4 } from 'uuid'

const DisplayRooms = ({ rooms, joinRoom }) => {
    return (
        <> 
        <ol>
            <li>
                Available Rooms:
            </li>
        {
            rooms.map(room =>
                <li key={uuidv4()}>
                    {room}
                    <button onClick={() => joinRoom(room)}>
                        join it
                     </button>
                </li>
            )
        }
        </ol>
        </>
    )
}

export default DisplayRooms

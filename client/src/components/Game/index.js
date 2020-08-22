import React, { useState } from 'react'
import Board from './Board'

const Game = ({color, room}) => { 
    return ( 
        color?
        <Board player={{ col: color }} room={room}/>
        :
        null 
    )
}

export default Game

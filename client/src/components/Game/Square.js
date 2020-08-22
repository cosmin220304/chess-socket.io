import React from 'react'

const Square = ({ i, j, piece, clickHndlr}) => {
    const color = (i + j) % 2 === 0 ? "white" : "black"
    const renderPiece = piece? `fas fa-chess-${piece.name} ${piece.outline}Outline` : null
 
    const squareStyle = {
        backgroundColor: color,
        color: color === "white" ? "black" : "white",
        fontSize: "0.9rem"
    }

    const pieceStyle = {
        fontSize: "1.5rem",  
        color: piece? piece.col : null,
    }

    return (
        <a href="# " style={squareStyle} className="square" onClick={() => clickHndlr(i, j, piece)}>
            {/*String.fromCharCode(97 + i)*/i}{j}
            <div className="centerChild">
                <i className={renderPiece} style={pieceStyle} />
            </div>
        </a>
    )
}

export default Square

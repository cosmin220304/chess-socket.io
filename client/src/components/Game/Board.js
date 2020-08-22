import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import socket from '../socket'
import { initalStateWhite, initalStateBlack, moveSet } from './gameRules'
import Square from './Square' 

const Board = ({ player, room }) => { 
    const [whiteP, setWhiteP] = useState([])
    const [blackP, setBlackP] = useState([])
    const [turn, setTurn] = useState("white")
    const [movedPiece, setMovedPiece] = useState()

    useEffect(() => {
        setWhiteP(initalStateWhite())
        setBlackP(initalStateBlack())

        socket.on("turn update", ([retTurn, bPieces, wPieces]) => { 
            selectPiece(-1, -1) 
            setTurn(retTurn)
            setWhiteP(wPieces)
            setBlackP(bPieces)
        })  
    }, []) 

    useEffect(() => { 
        if (movedPiece === undefined)
            return  

        if (!movedPiece) { 
            console.log(`${turn}'s turn`) 
            socket.emit("end turn", [room, player.col, blackP, whiteP])
        }
    }, [movedPiece])
 
    const movePiece = (newI, newJ) => {
        const oldPiece = getPiece(movedPiece.posI, movedPiece.posJ)
        const newPiece = { ...oldPiece, posI: newI, posJ: newJ }
        const newWhitePieces = whiteP.map(piece => _.isEqual(piece, oldPiece) ? newPiece : piece)
        const newBlackPieces = blackP.map(piece => _.isEqual(piece, oldPiece) ? newPiece : piece)

        if (checkIfChecked(newBlackPieces, newWhitePieces)) {
            alert("you are checked!")
            return;
        }

        //Reset
        setWhiteP(newWhitePieces)
        setBlackP(newBlackPieces)
        setMovedPiece(null)
    }

    const killPiece = (killedPiece) => {
        //Show killfeed
        console.log(`${movedPiece.col} ${movedPiece.name} killed ${killedPiece.col} ${killedPiece.name}`)

        const oldPiece = getPiece(movedPiece.posI, movedPiece.posJ)
        const newPiece = { ...movedPiece, posI: killedPiece.posI, posJ: killedPiece.posJ }

        let newWhitePieces = whiteP.filter(piece => !_.isEqual(piece, killedPiece))
        newWhitePieces = newWhitePieces.map(piece => _.isEqual(piece, oldPiece) ? newPiece : piece)

        let newBlackPieces = blackP.filter(piece => !_.isEqual(piece, killedPiece))
        newBlackPieces = newBlackPieces.map(piece => _.isEqual(piece, oldPiece) ? newPiece : piece)

        if (checkIfChecked(newBlackPieces, newWhitePieces)) {
            alert("you are checked!")
            return;
        }

        //Reset
        setWhiteP(newWhitePieces)
        setBlackP(newBlackPieces)
        setMovedPiece(null)
    }

    const selectPiece = (posI, posJ) => {
        const selPiece = getPiece(posI, posJ)
        setWhiteP(prev => prev.map(piece => _.isEqual(piece, selPiece) ? { ...piece, outline: "select" } : { ...piece, outline: "black" }))
        setBlackP(prev => prev.map(piece => _.isEqual(piece, selPiece) ? { ...piece, outline: "select" } : { ...piece, outline: "white" }))
    }

    const getPiece = (i, j, col) => {
        let findWhite, findBlack;

        if (col === "white" || !col)
            findWhite = whiteP.find(piece => piece.posI === i && piece.posJ === j)

        if (col === "black" || !col)
            findBlack = blackP.find(piece => piece.posI === i && piece.posJ === j)

        return findWhite || findBlack || null
    }

    const createSquares = () => {
        const squares = []
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                squares.push(<Square key={'sq' + i + j} i={i} j={j} piece={getPiece(i, j)} clickHndlr={clickHndlr} />)
            }
        }
        return squares
    }

    const clickHndlr = (posI, posJ, piece) => {
        if (player.col !== turn) {
            alert("not your turn!")
            return
        }
        if (piece && piece.col === player.col) {
            selectPiece(posI, posJ)
            setMovedPiece(piece)
            return
        }
        if (movedPiece) {
            const isAttacking = (piece !== null)
            const canMove = moveSet[movedPiece.name](movedPiece.posI, movedPiece.posJ, posI, posJ, movedPiece.col, isAttacking)
            const hasCollision = checkCollision(movedPiece, posI, posJ)

            if (canMove && !hasCollision) {
                if (isAttacking)
                    killPiece(piece)
                else
                    movePiece(posI, posJ)
            }
        }
    }

    const checkCollision = (checkedPiece, finalI, finalJ, findFunc) => {
        if (checkedPiece.name === "knight")
            return false

        let startI = checkedPiece.posI
        let startJ = checkedPiece.posJ
        let piece;

        while (startI !== finalI || startJ !== finalJ) {
            if (startI < finalI) startI += 1
            if (startI > finalI) startI -= 1
            if (startJ < finalJ) startJ += 1
            if (startJ > finalJ) startJ -= 1

            if (!findFunc)
                piece = getPiece(startI, startJ)
            else
                piece = findFunc(startI, startJ)

            //Special case for attacking enemy piece
            if (startI === finalI && startJ === finalJ && piece && piece.col !== checkedPiece.col) {
                console.log(checkedPiece)
                return false
            }

            if (piece)
                return true
        }

        console.log(checkedPiece)
        return false
    }

    const checkIfChecked = (newBlackPieces, newWhitePieces) => {
        let king, pieces;
        if (turn === "white") {
            king = newWhitePieces.filter(piece => piece.name === "king")[0]
            pieces = newBlackPieces
        }
        else {
            king = newBlackPieces.filter(piece => piece.name === "king")[0]
            pieces = newWhitePieces
        }

        const findFunc = (i, j) => {
            const findWhite = newWhitePieces.find(piece => piece.posI === i && piece.posJ === j)
            const findBlack = newBlackPieces.find(piece => piece.posI === i && piece.posJ === j)
            return findWhite || findBlack || null
        }

        const isChecked = pieces.some(p => {
            const canMove = moveSet[p.name](p.posI, p.posJ, king.posI, king.posJ, p.col, true)
            const hasCollision = checkCollision(p, king.posI, king.posJ, findFunc)
            if (canMove && !hasCollision) {
                console.log(p)
                return true
            }
            return false
        })
        return isChecked
    }

    return (
        <div className="centerChild">
            <div className="board">
                {createSquares()}
            </div>
        </div>
    )
}

export default Board

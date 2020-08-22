const initalStateWhite = () => {
    const posI = 0;
    const names = ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook",]
    let pieces = []

    for (let j = 0; j < 8; j++)
        pieces.push({ name: names[j], posI: posI, posJ: j, col: "white", outline: "black" })

    for (let j = 0; j < 8; j++)
        pieces.push({ name: "pawn", posI: posI + 1, posJ: j, col: "white", outline: "black" })

    return pieces
}

const initalStateBlack = () => {
    const posI = 7;
    const names = ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook",]
    let pieces = []

    for (let j = 0; j < 8; j++)
        pieces.push({ name: names[j], posI: posI, posJ: j, col: "black", outline: "white" })

    for (let j = 0; j < 8; j++)
        pieces.push({ name: "pawn", posI: posI - 1, posJ: j, col: "black", outline: "white" }) 

    return pieces
}

// si = start i, sj = start j, etc
const moveSet = {
    pawn: (si, sj, fi, fj, col, isAttacking) => {
        if (col === "white") {
            if (isAttacking === true) {
                //Pawn can attack diagonally
                if (si === fi - 1 && Math.abs(sj - fj) === 1)
                    return true
            }
            else {
                //move from start pos
                if (si === 1 && fi === 3 && sj === fj)
                    return true

                //normal move
                if (si === fi - 1 && sj === fj)
                    return true
            }
        } else {
            if (isAttacking === true) {
                //Pawn can attack diagonally
                if (si === fi + 1 && Math.abs(sj - fj) === 1)
                    return true
            }
            else {
                //move from start pos
                if (si === 6 && fi === 4 && sj === fj)
                    return true

                //normal move
                if (si === fi + 1 && sj === fj)
                    return true
            }
        }
        return false
    },
    rook: (si, sj, fi, fj) => {
        if (si === fi || sj === fj)
            return true
        return false
    },
    knight: (si, sj, fi, fj) => {
        const diff = [-2, -1, 1, 2]
        for (let d = 0; d < 4; d++) {
            for (let d2 = 0; d2 < 4; d2++) {
                if (Math.abs(diff[d]) !== Math.abs(diff[d2]))
                    if (fi === si + diff[d] && fj === sj + diff[d2])
                        return true
            }
        }
        return false
    },
    bishop: (si, sj, fi, fj) => {
        const diff = fi - si
        if (fj + diff === sj || fj - diff === sj)
            return true
        return false
    },
    queen: (si, sj, fi, fj) => {
        const diff = fi - si
        if (fj + diff === sj || fj - diff === sj)
            return true
        if (si === fi || sj === fj)
            return true
        return false
    },
    king: (si, sj, fi, fj) => { 
        if (Math.abs(si - fi) <= 1 && Math.abs(sj - fj) <= 1)
            return true 
        return false
    }
}

module.exports = {
    initalStateBlack: initalStateBlack,
    initalStateWhite: initalStateWhite,
    moveSet: moveSet
}
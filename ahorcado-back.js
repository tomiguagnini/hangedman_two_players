const palabras = require('./palabras.json')
const crypto = require('crypto')


class Ahorcado {
    constructor() {
        let numRandom = Math.floor(Math.random() * palabras.length)
        this.word = palabras[numRandom].toUpperCase().trim()
        this.board = generateId()
        this.player1 = generateId()
        this.player2 = generateId()
        this.lastPlay = 0
        this.gameOver = false
    }
    letter_valid(letter) {
        letter = letter.toUpperCase()
        if (letter == '' || letter == undefined) {
            return {
                valid: false,
                word: '',
            }
        }
        let index = this.word.search(letter)
        let aux = this.word.slice(index + 1)
        let array = new Array(this.word.length);
        if (index == -1 ){
            this.errors++
            return{
                valid:false,
                word:''
            }
        }
        while (index != -1) {
            //guarda la letra que encontro
            array[index] = this.word[index]
            //busca en el resto de la palabra
            let encontrado = aux.search(letter)

            if (encontrado == -1) {
                index = -1
            } else {
                index += aux.search(letter) + 1
            }

            //actualizo el resto de la palabra
            aux = aux.slice(index + 1)
        }
        return {
            valid: true,
            word: array,
        }

    }
    player_valid(id) {
        if (id == this.player1) {
            return 1
        } else {
            if (id == this.player2) {
                return 2
            } else
                return -1
        }
    }
    getLength() {
        return this.word.length
    }
    getBoard() {
        return this.board
    }
    getPlayers(num) {
        if (num == 1) {
            return this.player1

        } else {
            return this.player2
        }
    }
    setTurn(num) {
        if (num < 3) {
            this.lastPlay = num
        } 
    }
    getTurn(){
        if(this.lastPlay == 1 )
            return this.player2
        if(this.lastPlay == 2 )         
            return this.player1
        if(this.lastPlay == 0)
            return -1
    }
    setGameOver(){
        this.gameOver = true   
    }
    getGameOver(){
        return this.gameOver
    }
}

function generateId() {
    return crypto.randomBytes(16).toString('hex')
}

// function readPlays(board){
//     let db = fs.readFileSync(GAME_FILE, 'utf-8')
//     if (typeof db == 'undefined'){

//     }else{
//         db = JSON.parse(db)
//         return db.find((e) => e.board == board)
//     }
// }
// function appendPlays(board, lastPlay = '', errors = 0 ){    
//     let file = fs.readFileSync(GAME_FILE, 'utf-8')
//     let db =[]
//     let play ={
//         board: board,
//         lastPlay: lastPlay,
//         errors: errors,
//     }
//     if (file!= ''){
//         db = JSON.parse(file)
//     }    
//     db.push(play)
//     fs.writeFileSync(GAME_FILE, JSON.stringify(db))
// }

// function writePlays(board, lastPlay = '', errors = 0){
//     let db = fs.readFileSync(GAME_FILE, 'utf-8')
//     db = JSON.parse(db)
//     let play = readPlays(board)
//     play.lastPlay =lastPlay
//     play.errors = errors
//     let index = db.findIndex((e)=> e.board = board)
//     console.log('index',index)
//     db[index] = play
//     fs.writeFileSync(GAME_FILE, JSON.stringify(db))
// }


module.exports = Ahorcado;




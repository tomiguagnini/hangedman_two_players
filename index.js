const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//ahorcado

const Ahorcado = require('./ahorcado-back')
let salas = []

app.get('/',(req,res)=>{ 
    res.redirect('/ahorcado.html')
})

app.get('/api/ahorcado/newGame', (req, res) => {
  let ahorcado = new Ahorcado()
  salas.push(ahorcado)
  res.json({
    length: ahorcado.getLength(),
    board: ahorcado.getBoard(),
    player1: ahorcado.getPlayers(1),
    player2: ahorcado.getPlayers(2),
  })
})

app.get('/api/ahorcado/newGame/:id', (req, res) => {
  let id = req.params.id
  if (id != undefined) {
    let i = buscar_sala(id)
    if (i != -1) {
      let ahorcado = salas[i]
      res.json({
        length: ahorcado.getLength(),
        board: ahorcado.getBoard(),
        player1: ahorcado.getPlayers(1),
        player2: ahorcado.getPlayers(2),
      })
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(400)
  }
})

app.get('/api/ahorcado/turn:id', (req, res) => {
  let index = buscar_sala(req.params.id)
  if (index != -1) {
    res.json({ turn: salas[index].getTurn() })
  }
})

app.post('/api/ahorcado/check', (req, res) => {
  let index = buscar_sala(req.body.boardID)
  if (index != -1) {
    let player = salas[index].player_valid(req.body.playerID)
    if (player != -1) {
      let respuesta = salas[index].letter_valid(req.query.letra)
      salas[index].setTurn(player)
      res.json(respuesta)
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(400)
  }
})

app.post('/api/ahorcado/gameOver', (req, res) => {
  let boardID = req.body.boardID
  let playerID = req.body.playerID
  let index = buscar_sala(boardID)
  if (index != -1) {
    let player = salas[index].player_valid(playerID)
    if (player != -1) {
      salas[index].setGameOver()
      res.json({ ok: true })
    } else {
      res.sendStatus(401)
    }
  } else {
    res.json({ ok: true })
  }
})

app.get('/api/ahorcado/getGameOver/:id', (req, res) => {
  let boardID = req.params.id

  let index = buscar_sala(boardID)
  if (index != -1) {
    let ok = salas[index].getGameOver()
    if (ok) {
      salas.splice(index, 1)
    }
    res.json({ ok: ok })
  } else {
    res.json({ ok: true })
  }
})

function buscar_sala(id) {
  return salas.findIndex((e) => id == e.getBoard())
}



app.listen(3000)

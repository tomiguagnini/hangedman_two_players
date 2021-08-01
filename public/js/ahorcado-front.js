const url = location.origin + '/api/ahorcado'
const letras = document.querySelector('#letras')
const notificacion = document.querySelector('#notificacion')
const contenedorImagen = document.querySelector('#contenedor-img')
const btnEnviar = document.querySelector('#enviar')
const entrada = document.querySelector('#entrada')
const button_copy = document.getElementById('btn-copy')
const input = document.getElementById('board')

let errores = 0;
var playerID= '0';
var boardID= 0;

new_Game()
setInterval(()=>verificarSiTermino(),2000)


btnEnviar.addEventListener('click',()=>{
    esMiTurno()
    .then(res => {
        if(res){
            enviar_letra(entrada.value)
        }else
            notificacion.textContent = 'Espere su turno!'
    })
})
entrada.addEventListener('keydown',(e)=>{
    if(e.key =='Enter'){
        esMiTurno()
        .then(res => {
            if(res)
                enviar_letra(entrada.value)
            else
                notificacion.textContent = 'Espere su turno'
    })
    }
})
button_copy.addEventListener('click', () => {
  
  input.select()
  document.execCommand('copy')
  input.blur()
  button_copy.textContent = 'Copied!'
})

function new_Game(){
    errores = 0;
    entrada.focus()
    setImagen(0)
    if(que_jugador_soy() == 1 ){
        fetch(url + '/newGame')
        .then(response => response.json())
        .then(data => {
            playerID = data.player1
            boardID = data.board
            input.value =  window.location.origin +'/ahorcado.html' +'?boardID='+ data.board
            //console.log(data)
            setBoard(data.length)
        })
    }
    else{
        let parametro = window.location.search
        let i = parametro.search('=')
        let id = parametro.slice(i+1)   
        fetch(url + '/newGame/' +id)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            boardID = data.board
            playerID = data.player2
            setBoard(data.length)
        })
    }

        
    
}

function que_jugador_soy(){
    if(window.location.search.indexOf('boardID=') == -1 ){ //verifica si su url tiene id
        return 1
    }else{
        return 2
    }
}

function setBoard(num){
    notificacion.textContent = `${num} letras` 
    letras.innerHTML= ''
    for (let i=0;i<num;i++){
        letras.innerHTML += `<input id="i${i}"type="text" maxlength="1" disabled>`
    }
}

function setImagen(num){
    if( num == 0){
        contenedorImagen.innerHTML = null;
    }else{
        contenedorImagen.innerHTML = `<img src="./img/a${num}.png"></img>`
    }
}

function limpiarEntrada() {
    entrada.value = ''
    entrada.focus()
}

async function esMiTurno(){
    let response = false
    await fetch(url + '/turn'+boardID)
    .then(response => response.json())
    .then(data=> {
        if(data.turn == playerID||data.turn == -1){
            response = true
        }else
            response = false
    })
    return response
    
}

function enviar_letra(letra){
    let datos = {boardID: boardID, playerID: playerID}
    if( letra != '' ){
        Peticion('POST' , url + `/check?letra=${letra}`,datos) 
        .catch(error => console.error('Error:', error))
        .then(data => validate(data))
        limpiarEntrada()
    }
}

function validate(data){
    if(data.valid){
        correcto(data.word)
        verificarSiGano()
    }else{
        incorrecto()        
    }
}

function correcto(data){
    notificacion.textContent = 'Correcto! Espere su turno...'
    for (let i=0 ; i < data.length ; i++){
        if (data[i] != null){
            document.querySelector(`#i${i}`).value = data[i]
        }
    }
}

function verificarSiGano() {
    if(Object.values(letras.children).every(e => e.value != '')){
        gameOver('Felicitaciones Ganaste!')
    }    
}


function incorrecto(){
    notificacion.textContent = 'Incorrecto! Espere su turno...'
    if(errores < 7 ){
        setImagen(++errores)
    }else{
        gameOver('Has Perdido')
    }
    
}


function alertaFinal(mensaje) {
    swal({
        title:mensaje,
        text:`Errores: ${errores}`,
        buttons:['Salir','Jugar de nuevo'],
        background:'var(--fondo-secundario)',
        closeOnClickOutside: false,
    }).then((value)=>{
        if(value){
            window.location.href = '/ahorcado.html'
        }else{
            window.location.href = '/'
        }
        
    })
}

function gameOver(mensaje){
    let data = {boardID: boardID, playerID: playerID}
    Peticion('POST',url+ '/gameOver', data)
    alertaFinal(mensaje)

}

function verificarSiTermino(){
    fetch(url + '/getGameOver/'+ boardID)
    .then(res => res.json())
    .then(data=>{
        if(data.ok){
            gameOver('Partida Finalizada')
        }
    })
}


async function Peticion(method, url, data) {
    const response = await fetch(url, {
      method: method, // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    return response.json() // parses JSON response into native JavaScript objects
  }
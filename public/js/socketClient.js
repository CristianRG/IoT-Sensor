import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

const socket = io()

// events from the client

// const message = document.getElementById("message")
// const buttonSendMessage = document.getElementById("sendMessage")

// let room

// buttonSendMessage.addEventListener('click', function () {
//     if (room === undefined) {
//         const idChanel = message.value
//         socket.emit('join', { idChanel: idChanel })
//         room = idChanel
//     } else {
//         socket.emit('message', { room: room, message: message })
//     }
// })

const temperatura = document.getElementById('temperatura')
const movimiento = document.getElementById('movimiento')

socket.on('RECEIVED_INFORMATION', function (information) {
    if(information.movimiento){
        movimiento.innerHTML = information.movimiento;
    } else if (information.temperatura){
        temperatura.innerHTML = information.temperatura
    }
})

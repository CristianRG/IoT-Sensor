// limpiar input y obtener el mensaje
const inputMessage = document.getElementById('message')

// escuchar el evento de enter
inputMessage.addEventListener('keydown', function(e){
    if (e.key === 'Enter') {
        sendMessage(inputMessage.value)
    }
    // console.log(e)
})

// boton de enviar mensaje
const buttonSendMessage = document.getElementById('sendMessage')

// escuchar el evento de click
buttonSendMessage.addEventListener('click', function() {
    sendMessage(inputMessage.value)
})

// ejecutar al presionar boton o presionar enter en el input
function sendMessage(message) {
    // logica utilizando webSockets para enviar el mensaje

    renderMessage(message)
    // limpiar input
    // inputMessage.value = ''
}

// mostrar mensaje en pantalla
function renderMessage(message) {
    const listMessages = document.getElementById('listMessages')
    const newMessage = document.createElement('li')

    // if(message.idUser == user.idUser){
    //     newMessage.classList.add('you')
    // }
    newMessage.classList.add('you')
    newMessage.innerHTML = message
    listMessages.appendChild(newMessage)
}

const chats = document.querySelectorAll('.chats .chat')

chats.forEach((e)=>{
    e.addEventListener('click', function(){
        showMessages(e.id)
    })
})

function showMessages(idChat){
    alert('You clicked this')
}
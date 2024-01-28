// imports necesarios
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import express, { json, response } from "express";
import path from 'node:path';
import mysql from 'mysql'

// creación de la app, servidor y socket
const app = express()
const server = createServer(app)
const io = new Server(server)

import { loadChats } from './src/schemas/querys.js'

const URL_DB = `mysql://bwer5rbb1fcthxxz1211:pscale_pw_Ep0QRBFl9rgXAaTYhleHduozjoNABTMIuIwvAjZN6To@aws.connect.psdb.cloud/databaseusers?ssl={"rejectUnauthorized":true}`

const connection = mysql.createConnection(URL_DB)

let URL_HOST = ""

// express use una carpeta para los documentos estaticos
app.use(express.static('public'))

// directorio de vistas
const htmlFiles = path.join(process.cwd(), 'src', 'views')

// rutas
app.get('/', (req, res) => {
    const htmlFile = path.join(htmlFiles, 'index.html')
    // URL_HOST = req.protocol + '://' + req.
    console.log(req.host)
    res.sendFile(htmlFile)
})
// exportamos la app para el archivo de rutas.js


// eventos de socket
io.on('connection', (socket)=> {

    console.log("Client connected!")

    socket.on('example', (message)=> {
        console.log(message)
    })

    socket.on('join', (idChanel)=> {
        console.log(idChanel)

        socket.join(idChanel.idChanel)
    })

    socket.on('message', (message)=> {
        socket.to(message.room).emit('message', {message: message})
    })

    socket.on('SEND_INFORMATION', (information)=> {
        
        try {
            information = JSON.parse(information)
            
        }catch(e){
            console.log('Error al formatear')
        }
        
        if(information.movimiento){
            saveMove(information)
            //socket.broadcast.emit('RECEIVED_INFORMATION', {movimiento: information.movimiento})
        }else if(information.temperature){
            saveTemperature(information)
        }
        
    })

    socket.on('disconnect', ()=> {
        console.log("cliented disconnected")
    })
})



// api

app.get('/api/save/temperature', async (req, res)=> {
    //const information = req.body.split('')
    // console.log(req.query)
    try {
        await connection.query(`INSERT INTO temperatura values ("${req.query.temperature}");`)
    }catch(e) {
        console.log("error al insertar ")
    }
    res.json({status:200})
})

app.get('/api/save/move', async (req, res)=> {
    //const information = req.body.split('')
    // console.log(req.query)
    try {
        await connection.query(`INSERT INTO sensor values ("${req.query.time}", "${req.query.distance}");`)
    }catch(e) {
        console.log("error al insertar ")
    }
    res.json({status:200})
})

function saveTemperature(data) {
    fetch(`http:localhost:3000/api/save/temperature?temperature=${data.temperature}`)
    .then(response => response.json())
    .then(response => {
        console.log(response)
    })
}

function saveMove(data) {
    const timeMoveList = data.movimiento.split(' ')
    const timeMove = timeMoveList[0] + ' ' + timeMoveList[1]
    const distance = data.movimiento.split(' ')[2]
    fetch(`http:localhost:3000/api/save/move?time=${timeMove}&distance=${distance}`)
    .then(response => response.json())
    .then(response => {
        console.log(response)
    })
}


// puerto donde se ejecuta
const PORT = process.argv[2]

// servidor escuchando en el puerto 3000
server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}. Go to http://localhost:${PORT}`)
})
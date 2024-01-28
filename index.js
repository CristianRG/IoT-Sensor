// importamos una libreria de nodejs para ejecutar comandos del sistema
import { exec } from 'node:child_process'
// const { exec } = require('child_process')
// importamos express para poder usar la ruta desde otro dispositivo

import loudness from 'loudness'

import open from 'open'
import start from 'open'
import { checkForHttp } from './util.mjs'

// const express = require('express')
import express from 'express'

// const path = require('node:path')
import path from 'path'

// importamos createServer del modulo http
import { Server } from 'socket.io'
import { createServer } from 'node:http'

// creamos la aplicación
const app = express()

// creamos el servidor
const server = createServer(app)
const io = new Server(server)

// eventos escuchados por socket.io
io.on('connection', async (socket)=> {

    socket.emit('generalStatus', {volumen: await loudness.getVolume()})

    socket.on('disconnect', ()=> {
        console.log('client disconnected')
    })

    socket.on('coming soon', (msg)=> {
        console.log(msg);
    })

    socket.on('hibernate', () => {
        setTimeout(() => {
            console.log('Apagando...')
            exec('shutdown /h', (err, stdout, stderr) => {
                if (err) {
                    console.log(err)
                }
                console.log(stdout)
            })
        }, 2000)
    })

    socket.on('volumenUpdate', async (object)=> {
        if (object.volumen > 100 || object.volumen < 0) {
            socket.emit('message', {message: 'Invalid volumen'})
            return;
        }
        loudness.setVolume(object.volumen)
    })

    socket.on('open', async (object) => {
        const url = checkForHttp(object.website)
        await start(url)
        socket.emit('message', {message: 'Opened '+ url})
    })
})

app.get('/', (req, res) => {
    const htmlFile = path.join(process.cwd(), 'index.html')
    res.sendFile(htmlFile)
    console.log(req.method + ' ' + req.url)
})

app.get('/api/control/apagar', (req, res) => {
    // ejecutamos el comando del sistema para apagar la pc
    res.send('The Pc will hibernate in 2 seconds!')
    setTimeout(() => {
        console.log('Apagando...')
        exec('shutdown /h', (err, stdout, stderr) => {
            if (err) {
                console.log(err)
            }
            console.log(stdout)
        })
    }, 2000)
})

// escuchamos en un puerto
server.listen(3000, ()=> {
    console.log('App deployed in the port 3000. Go to: http://localhost:3000')
})
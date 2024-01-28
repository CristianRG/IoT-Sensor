import mysql from 'mysql'

// conexión a la base de datos
export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'appchat'
})

export async function tryToConnect() {
    try {
        await new Promise((resolve, reject) => {
            connection.connect((err)=>{
                if(err) {
                    return reject(err)
                }
                return resolve(connection)
            })
        })
    } catch (err) {

    }
}

export async function tryToDisconnect() {
    try {
        await new Promise((resolve, reject) => {
            connection.end((err)=>{
                if(err) {
                    return reject(err)
                }
                return resolve(connection)
            })
        })
    } catch (err) {

    }
}